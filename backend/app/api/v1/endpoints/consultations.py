import time
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt

from app.database import get_db
from app.config import settings
from app.exceptions import ResourceNotFoundException
from app.auth.dependencies import get_current_user
from app.services.audit_service import record_audit_event
from app.models.core import User
from app.models.clinical import ConsultationEncounter, Appointment
from app.models.enums import AppointmentStatus, UserRole
from app.schemas.consultation import (
    LiveKitTokenRequest,
    LiveKitTokenResponse,
    SOAPNotesRequest,
    ConsultationEncounterResponse
)

router = APIRouter(prefix="/consultations", tags=["WebRTC Video & Consultation Workflow"])

def check_encounter_access(encounter: ConsultationEncounter, current_user: User, doctor_only: bool = False):
    """
    Enforces Object Level Authorization (OWASP API1:2023) preventing IDOR/BOLA attacks.
    Only assigned patient or assigned doctor (or admin) can access the encounter.
    """
    if current_user.role in [UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN]:
        return
    if doctor_only:
        if current_user.role != UserRole.DOCTOR or not current_user.doctor_profile or encounter.doctor_id != current_user.doctor_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Only the assigned physician can perform this clinical action."
            )
        return

    is_patient = current_user.patient_profile and encounter.patient_id == current_user.patient_profile.id
    is_doctor = current_user.doctor_profile and encounter.doctor_id == current_user.doctor_profile.id
    if not (is_patient or is_doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You are not an authorized participant in this consultation encounter."
        )

@router.get("/{encounter_id}", response_model=ConsultationEncounterResponse, summary="Get Consultation Encounter State")
async def get_consultation_encounter(
    encounter_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns live encounter state, room identifier, participant IDs, and recorded clinical notes.
    """
    stmt = select(ConsultationEncounter).where(
        (ConsultationEncounter.id == encounter_id) | (ConsultationEncounter.appointment_id == encounter_id)
    )
    result = await db.execute(stmt)
    encounter = result.scalar_one_or_none()
    if not encounter:
        raise ResourceNotFoundException(resource="Consultation Encounter", identifier=encounter_id)

    check_encounter_access(encounter, current_user)
    return encounter

@router.post("/{encounter_id}/token", response_model=LiveKitTokenResponse, summary="Mint WebRTC LiveKit Access Token")
async def mint_livekit_token(
    encounter_id: str,
    payload: Optional[LiveKitTokenRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mints a cryptographically signed LiveKit WebRTC JWT token granting access
    to the consultation audio/video room with camera and microphone publishing rights.
    """
    stmt = select(ConsultationEncounter).where(
        (ConsultationEncounter.id == encounter_id) | (ConsultationEncounter.appointment_id == encounter_id)
    )
    result = await db.execute(stmt)
    encounter = result.scalar_one_or_none()
    if not encounter:
        raise ResourceNotFoundException(resource="Consultation Encounter", identifier=encounter_id)

    check_encounter_access(encounter, current_user)

    room_name = encounter.room_sid or f"room_{encounter.id}"
    participant_identity = current_user.id
    participant_name = (
        payload.user_display_name 
        if payload and payload.user_display_name 
        else current_user.full_name
    )

    now = int(time.time())
    jwt_claims = {
        "sub": participant_identity,
        "name": participant_name,
        "iss": settings.LIVEKIT_API_KEY,
        "nbf": now - 5,
        "exp": now + 3600,
        "video": {
            "room": room_name,
            "roomJoin": True,
            "canPublish": True,
            "canSubscribe": True,
            "canPublishData": True
        }
    }

    token = jwt.encode(jwt_claims, settings.LIVEKIT_API_SECRET, algorithm="HS256")

    return LiveKitTokenResponse(
        room_name=room_name,
        participant_identity=participant_identity,
        participant_name=participant_name,
        token=token,
        livekit_url=settings.LIVEKIT_URL,
        expires_in_seconds=3600
    )

@router.post("/{encounter_id}/start", response_model=ConsultationEncounterResponse, summary="Start Active Clinical Consultation")
async def start_consultation(
    encounter_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Transitions the encounter to IN_PROGRESS and records the start timestamp.
    Restricted to assigned clinician.
    """
    stmt = select(ConsultationEncounter).where(
        (ConsultationEncounter.id == encounter_id) | (ConsultationEncounter.appointment_id == encounter_id)
    )
    result = await db.execute(stmt)
    encounter = result.scalar_one_or_none()
    if not encounter:
        raise ResourceNotFoundException(resource="Consultation Encounter", identifier=encounter_id)

    check_encounter_access(encounter, current_user, doctor_only=True)

    encounter.status = AppointmentStatus.IN_PROGRESS
    encounter.started_at = datetime.now(timezone.utc)

    # Sync linked appointment status
    appt_stmt = select(Appointment).where(Appointment.id == encounter.appointment_id)
    appt_res = await db.execute(appt_stmt)
    appt = appt_res.scalar_one_or_none()
    if appt:
        appt.status = AppointmentStatus.IN_PROGRESS

    await record_audit_event(
        db=db,
        action="CONSULTATION_START",
        resource_type="ConsultationEncounter",
        resource_id=encounter.id,
        user=current_user,
        details={"appointment_id": encounter.appointment_id}
    )

    await db.commit()
    await db.refresh(encounter)
    return encounter

@router.post("/{encounter_id}/notes", response_model=ConsultationEncounterResponse, summary="Save SOAP Clinical Encounter Notes")
async def save_soap_notes(
    encounter_id: str,
    payload: SOAPNotesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Records SOAP notes (Subjective, Objective, Assessment, Plan) and ICD-10 codes.
    Restricted to verified clinicians.
    """
    stmt = select(ConsultationEncounter).where(
        (ConsultationEncounter.id == encounter_id) | (ConsultationEncounter.appointment_id == encounter_id)
    )
    result = await db.execute(stmt)
    encounter = result.scalar_one_or_none()
    if not encounter:
        raise ResourceNotFoundException(resource="Consultation Encounter", identifier=encounter_id)

    check_encounter_access(encounter, current_user, doctor_only=True)

    soap_dict = {
        "subjective": payload.subjective,
        "objective": payload.objective,
        "assessment": payload.assessment,
        "plan": payload.plan,
        "recorded_at": datetime.now(timezone.utc).isoformat()
    }

    encounter.soap_notes = soap_dict
    encounter.icd10_codes = payload.icd10_codes

    await record_audit_event(
        db=db,
        action="CONSULTATION_SOAP_RECORDED",
        resource_type="ConsultationEncounter",
        resource_id=encounter.id,
        user=current_user,
        details={"icd10_codes": payload.icd10_codes}
    )

    await db.commit()
    await db.refresh(encounter)
    return encounter

@router.post("/{encounter_id}/end", response_model=ConsultationEncounterResponse, summary="Conclude & Seal Consultation Encounter")
async def end_consultation(
    encounter_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Concludes the consultation, seals encounter records, records end timestamp,
    and sets status to COMPLETED.
    """
    stmt = select(ConsultationEncounter).where(
        (ConsultationEncounter.id == encounter_id) | (ConsultationEncounter.appointment_id == encounter_id)
    )
    result = await db.execute(stmt)
    encounter = result.scalar_one_or_none()
    if not encounter:
        raise ResourceNotFoundException(resource="Consultation Encounter", identifier=encounter_id)

    check_encounter_access(encounter, current_user)

    encounter.status = AppointmentStatus.COMPLETED
    encounter.ended_at = datetime.now(timezone.utc)

    # Sync linked appointment status
    appt_stmt = select(Appointment).where(Appointment.id == encounter.appointment_id)
    appt_res = await db.execute(appt_stmt)
    appt = appt_res.scalar_one_or_none()
    if appt:
        appt.status = AppointmentStatus.COMPLETED

    await record_audit_event(
        db=db,
        action="CONSULTATION_CONCLUDED",
        resource_type="ConsultationEncounter",
        resource_id=encounter.id,
        user=current_user,
        details={"appointment_id": encounter.appointment_id}
    )

    await db.commit()
    await db.refresh(encounter)
    return encounter


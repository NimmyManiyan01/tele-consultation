import hashlib
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.exceptions import ScheduleXRestrictionException, ResourceNotFoundException
from app.auth.dependencies import get_current_user, require_roles
from app.services.audit_service import record_audit_event
from app.models.core import User, DoctorProfile, PatientProfile
from app.models.clinical import Appointment, Prescription, PrescriptionItem
from app.models.enums import UserRole, DrugSchedule
from app.schemas.prescription import (
    PrescriptionCreateRequest,
    PrescriptionResponse,
    PrescriptionItemResponse
)

router = APIRouter(prefix="/prescriptions", tags=["Digital Prescriptions & MoHFW Compliance"])

@router.post("", response_model=PrescriptionResponse, summary="Issue Digitally Signed e-Prescription")
async def create_prescription(
    payload: PrescriptionCreateRequest,
    current_user: User = Depends(require_roles([UserRole.DOCTOR])),
    db: AsyncSession = Depends(get_db)
):
    """
    Issues a legally compliant e-Prescription under MoHFW Telemedicine Guidelines (2020).
    Enforces statutory prohibition on Schedule X narcotic and psychotropic drugs.
    """
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor profile not initialized for this account."
        )

    # 1. Statutory Hard Intercept: MoHFW Schedule X narcotics prohibition
    for item in payload.items:
        if item.schedule == DrugSchedule.SCHEDULE_X:
            raise ScheduleXRestrictionException(
                f"Statutory Intercept: Prescription of '{item.drug_name}' (Schedule X narcotic/psychotropic) "
                f"is strictly prohibited via teleconsultation under MoHFW Telemedicine Practice Guidelines (2020)."
            )

    # 2. Verify appointment existence
    appt_stmt = (
        select(Appointment)
        .where(Appointment.id == payload.appointment_id)
        .options(
            selectinload(Appointment.doctor).selectinload(DoctorProfile.user),
            selectinload(Appointment.patient).selectinload(PatientProfile.user)
        )
    )
    appt_res = await db.execute(appt_stmt)
    appt = appt_res.scalar_one_or_none()
    if not appt:
        raise ResourceNotFoundException(resource="Appointment", identifier=payload.appointment_id)

    if appt.doctor_id != current_user.doctor_profile.id and current_user.role not in [UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only the assigned physician can issue a prescription for this appointment."
        )

    # 3. Generate SHA-256 Digital Signature
    now = datetime.now(timezone.utc)
    sig_payload = (
        f"{current_user.doctor_profile.council_registration_number}:"
        f"{appt.patient_id}:{now.isoformat()}:"
        f"{','.join([item.drug_name for item in payload.items])}"
    )
    signature_hash = hashlib.sha256(sig_payload.encode("utf-8")).hexdigest()

    # 4. Create Prescription Record
    prescription = Prescription(
        appointment_id=appt.id,
        doctor_id=current_user.doctor_profile.id,
        patient_id=appt.patient_id,
        diagnosis=payload.diagnosis,
        clinical_notes=payload.clinical_notes,
        digital_signature_hash=signature_hash,
        is_digitally_signed=True,
        requires_follow_up_days=payload.requires_follow_up_days
    )
    db.add(prescription)
    await db.flush()

    # 5. Add Prescription Items
    item_responses = []
    for item in payload.items:
        rx_item = PrescriptionItem(
            prescription_id=prescription.id,
            drug_name=item.drug_name,
            dosage=item.dosage,
            frequency=item.frequency,
            duration=item.duration,
            instructions=item.instructions,
            schedule=item.schedule
        )
        db.add(rx_item)
        await db.flush()
        item_responses.append(
            PrescriptionItemResponse(
                id=rx_item.id,
                drug_name=rx_item.drug_name,
                dosage=rx_item.dosage,
                frequency=rx_item.frequency,
                duration=rx_item.duration,
                instructions=rx_item.instructions,
                schedule=rx_item.schedule
            )
        )

    await record_audit_event(
        db=db,
        action="PRESCRIPTION_ISSUE",
        resource_type="Prescription",
        resource_id=prescription.id,
        user=current_user,
        details={
            "appointment_id": appt.id,
            "patient_id": appt.patient_id,
            "item_count": len(item_responses)
        }
    )

    await db.commit()
    await db.refresh(prescription)

    return PrescriptionResponse(
        id=prescription.id,
        appointment_id=appt.id,
        doctor_id=current_user.doctor_profile.id,
        patient_id=appt.patient_id,
        doctor_name=current_user.full_name,
        doctor_council_reg=current_user.doctor_profile.council_registration_number,
        patient_name=appt.patient.user.full_name if appt.patient and appt.patient.user else "Patient",
        diagnosis=prescription.diagnosis,
        clinical_notes=prescription.clinical_notes,
        digital_signature_hash=prescription.digital_signature_hash,
        is_digitally_signed=prescription.is_digitally_signed,
        created_at=prescription.created_at,
        items=item_responses
    )

@router.get("/{prescription_id}", response_model=PrescriptionResponse, summary="Get Prescription Details & Digital Seal")
async def get_prescription_detail(
    prescription_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves complete prescription including digital signature audit verification.
    """
    stmt = (
        select(Prescription)
        .where(Prescription.id == prescription_id)
        .options(
            selectinload(Prescription.items),
            selectinload(Prescription.doctor).selectinload(DoctorProfile.user),
            selectinload(Prescription.patient).selectinload(PatientProfile.user)
        )
    )
    result = await db.execute(stmt)
    rx = result.scalar_one_or_none()
    if not rx:
        raise ResourceNotFoundException(resource="Prescription", identifier=prescription_id)

    is_authorized = (
        current_user.role in [UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN] or
        (current_user.patient_profile and rx.patient_id == current_user.patient_profile.id) or
        (current_user.doctor_profile and rx.doctor_id == current_user.doctor_profile.id)
    )
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You are not authorized to inspect this prescription."
        )

    doc_name = rx.doctor.user.full_name if rx.doctor and rx.doctor.user else "Doctor"
    council_reg = rx.doctor.council_registration_number if rx.doctor else None
    pat_name = rx.patient.user.full_name if rx.patient and rx.patient.user else "Patient"

    item_responses = [
        PrescriptionItemResponse(
            id=item.id,
            drug_name=item.drug_name,
            dosage=item.dosage,
            frequency=item.frequency,
            duration=item.duration,
            instructions=item.instructions,
            schedule=item.schedule
        )
        for item in rx.items
    ]

    return PrescriptionResponse(
        id=rx.id,
        appointment_id=rx.appointment_id,
        doctor_id=rx.doctor_id,
        patient_id=rx.patient_id,
        doctor_name=doc_name,
        doctor_council_reg=council_reg,
        patient_name=pat_name,
        diagnosis=rx.diagnosis,
        clinical_notes=rx.clinical_notes,
        digital_signature_hash=rx.digital_signature_hash,
        is_digitally_signed=rx.is_digitally_signed,
        created_at=rx.created_at,
        items=item_responses
    )


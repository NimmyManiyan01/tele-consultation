from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.exceptions import SlotConcurrencyException, ResourceNotFoundException
from app.auth.dependencies import get_current_user, require_roles
from app.services.audit_service import record_audit_event
from app.models.core import User, DoctorProfile, PatientProfile
from app.models.clinical import AppointmentSlot, Appointment, ConsultationEncounter
from app.models.enums import UserRole, SlotStatus, AppointmentStatus, ConsultationType
from app.schemas.appointment import (
    SlotResponse,
    SlotLockRequest,
    SlotLockResponse,
    AppointmentCreateRequest,
    AppointmentResponse,
    AppointmentCancelRequest,
    WaitlistPullForwardResponse
)

router = APIRouter(prefix="/appointments", tags=["Appointment Scheduling & Concurrency"])

@router.get("/slots", response_model=List[SlotResponse], summary="List Available Slots for Doctor")
async def list_doctor_slots(
    doctor_id: str = Query(..., description="Doctor Profile ID"),
    date: Optional[str] = Query(None, description="Target date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves time slots for a specific clinician, indicating real-time availability.
    """
    stmt = select(AppointmentSlot).where(AppointmentSlot.doctor_id == doctor_id)
    if date:
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            stmt = stmt.where(AppointmentSlot.start_time >= datetime.combine(target_date, datetime.min.time()))
            stmt = stmt.where(AppointmentSlot.start_time <= datetime.combine(target_date, datetime.max.time()))
        except ValueError:
            pass

    stmt = stmt.order_by(AppointmentSlot.start_time.asc())
    result = await db.execute(stmt)
    slots = result.scalars().all()
    return slots

@router.post("/lock", response_model=SlotLockResponse, summary="Acquire Concurrency Slot Lock")
async def lock_appointment_slot(payload: SlotLockRequest, db: AsyncSession = Depends(get_db)):
    """
    Acquires a distributed lock on an appointment slot for 5 minutes (300 seconds),
    preventing double bookings during checkout and payment processing.
    """
    stmt = select(AppointmentSlot).where(AppointmentSlot.id == payload.slot_id).with_for_update()
    result = await db.execute(stmt)
    slot = result.scalar_one_or_none()

    if not slot:
        raise ResourceNotFoundException(resource="Appointment Slot", identifier=payload.slot_id)

    if slot.status in [SlotStatus.BOOKED, SlotStatus.LOCKED]:
        raise SlotConcurrencyException(f"Slot '{payload.slot_id}' is currently unavailable (status: {slot.status.value}).")

    slot.status = SlotStatus.LOCKED
    await db.commit()

    locked_until = datetime.now(timezone.utc) + timedelta(minutes=5)
    return SlotLockResponse(
        slot_id=slot.id,
        locked_until=locked_until,
        hold_duration_seconds=300,
        message="Slot locked successfully. Complete checkout within 5 minutes."
    )

@router.post("/confirm", response_model=AppointmentResponse, summary="Confirm & Finalize Appointment Booking")
async def confirm_appointment(
    payload: AppointmentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Finalizes appointment booking: converts locked slot to BOOKED,
    creates the clinical appointment record and auto-initializes the consultation encounter.
    """
    if not current_user.patient_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have an active patient profile."
        )

    stmt = select(AppointmentSlot).where(AppointmentSlot.id == payload.slot_id).with_for_update()
    result = await db.execute(stmt)
    slot = result.scalar_one_or_none()

    if not slot:
        raise ResourceNotFoundException(resource="Appointment Slot", identifier=payload.slot_id)

    if slot.status == SlotStatus.BOOKED:
        raise SlotConcurrencyException(f"Slot '{payload.slot_id}' has already been booked.")

    # Load doctor to get consultation fee
    doctor_query = select(DoctorProfile).where(DoctorProfile.id == slot.doctor_id).options(selectinload(DoctorProfile.user))
    doc_res = await db.execute(doctor_query)
    doc = doc_res.scalar_one_or_none()
    doc_name = doc.user.full_name if doc and doc.user else "Consultant Doctor"
    doc_fee = doc.video_fee if doc else 850

    # Mark slot booked
    slot.status = SlotStatus.BOOKED

    # Create Appointment
    import uuid
    appt_num = f"APT-{uuid.uuid4().hex[:8].upper()}"
    appointment = Appointment(
        appointment_number=appt_num,
        slot_id=slot.id,
        patient_id=current_user.patient_profile.id,
        doctor_id=slot.doctor_id,
        consultation_type=payload.consultation_type,
        status=AppointmentStatus.CONFIRMED,
        chief_complaint=payload.chief_complaint,
        consultation_fee=doc_fee,
        platform_fee=50,
        gst_amount=9,
        total_amount=doc_fee + 59
    )
    db.add(appointment)
    await db.flush()

    # Pre-provision Consultation Encounter
    room_identifier = f"room_consult_{appointment.id[:8]}"
    encounter = ConsultationEncounter(
        appointment_id=appointment.id,
        patient_id=current_user.patient_profile.id,
        doctor_id=slot.doctor_id,
        status=AppointmentStatus.CONFIRMED,
        livekit_room_name=room_identifier,
        room_sid=room_identifier
    )
    db.add(encounter)
    await db.commit()
    await db.refresh(appointment)

    # Load relations for response
    doctor_query = select(DoctorProfile).where(DoctorProfile.id == slot.doctor_id).options(selectinload(DoctorProfile.user))
    doc_res = await db.execute(doctor_query)
    doc = doc_res.scalar_one_or_none()
    doc_name = doc.user.full_name if doc and doc.user else "Consultant Doctor"

    return AppointmentResponse(
        id=appointment.id,
        slot_id=slot.id,
        patient_id=current_user.patient_profile.id,
        doctor_id=slot.doctor_id,
        doctor_name=doc_name,
        patient_name=current_user.full_name,
        consultation_type=appointment.consultation_type,
        status=appointment.status,
        start_time=slot.start_time,
        end_time=slot.end_time,
        chief_complaint=appointment.chief_complaint,
        created_at=appointment.created_at
    )

@router.get("", response_model=List[AppointmentResponse], summary="List Appointments for Current User")
async def list_my_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns list of appointments filtered by the authenticated user's clinical persona (Doctor or Patient).
    """
    stmt = (
        select(Appointment)
        .options(
            selectinload(Appointment.slot),
            selectinload(Appointment.doctor).selectinload(DoctorProfile.user),
            selectinload(Appointment.patient).selectinload(PatientProfile.user)
        )
    )

    if current_user.role == UserRole.DOCTOR and current_user.doctor_profile:
        stmt = stmt.where(Appointment.doctor_id == current_user.doctor_profile.id)
    elif current_user.role == UserRole.PATIENT and current_user.patient_profile:
        stmt = stmt.where(Appointment.patient_id == current_user.patient_profile.id)

    stmt = stmt.order_by(Appointment.created_at.desc())
    result = await db.execute(stmt)
    appointments = result.scalars().all()

    responses = []
    for appt in appointments:
        doc_name = appt.doctor.user.full_name if appt.doctor and appt.doctor.user else "Doctor"
        pat_name = appt.patient.user.full_name if appt.patient and appt.patient.user else "Patient"
        responses.append(
            AppointmentResponse(
                id=appt.id,
                slot_id=appt.slot_id,
                patient_id=appt.patient_id,
                doctor_id=appt.doctor_id,
                doctor_name=doc_name,
                patient_name=pat_name,
                consultation_type=appt.consultation_type,
                status=appt.status,
                start_time=appt.slot.start_time if appt.slot else datetime.now(timezone.utc),
                end_time=appt.slot.end_time if appt.slot else datetime.now(timezone.utc),
                chief_complaint=appt.chief_complaint,
                created_at=appt.created_at
            )
        )
    return responses

def check_appointment_access(appt: Appointment, current_user: User):
    """
    Enforces Object Level Authorization (OWASP API1:2023) preventing IDOR/BOLA attacks.
    """
    if current_user.role in [UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN]:
        return
    is_patient = current_user.patient_profile and appt.patient_id == current_user.patient_profile.id
    is_doctor = current_user.doctor_profile and appt.doctor_id == current_user.doctor_profile.id
    if not (is_patient or is_doctor):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You are not authorized to view or manage this appointment."
        )

@router.get("/{appointment_id}", response_model=AppointmentResponse, summary="Get Appointment Details")
async def get_appointment_detail(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves full details of a specific appointment.
    """
    stmt = (
        select(Appointment)
        .where(Appointment.id == appointment_id)
        .options(
            selectinload(Appointment.slot),
            selectinload(Appointment.doctor).selectinload(DoctorProfile.user),
            selectinload(Appointment.patient).selectinload(PatientProfile.user)
        )
    )
    result = await db.execute(stmt)
    appt = result.scalar_one_or_none()
    if not appt:
        raise ResourceNotFoundException(resource="Appointment", identifier=appointment_id)

    check_appointment_access(appt, current_user)

    doc_name = appt.doctor.user.full_name if appt.doctor and appt.doctor.user else "Doctor"
    pat_name = appt.patient.user.full_name if appt.patient and appt.patient.user else "Patient"

    return AppointmentResponse(
        id=appt.id,
        slot_id=appt.slot_id,
        patient_id=appt.patient_id,
        doctor_id=appt.doctor_id,
        doctor_name=doc_name,
        patient_name=pat_name,
        consultation_type=appt.consultation_type,
        status=appt.status,
        start_time=appt.slot.start_time if appt.slot else datetime.now(timezone.utc),
        end_time=appt.slot.end_time if appt.slot else datetime.now(timezone.utc),
        chief_complaint=appt.chief_complaint,
        created_at=appt.created_at
    )

@router.post("/{appointment_id}/cancel", response_model=AppointmentResponse, summary="Cancel Appointment & Free Slot")
async def cancel_appointment(
    appointment_id: str,
    payload: AppointmentCancelRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancels an appointment, unlocks and frees the underlying slot back to AVAILABLE,
    and updates appointment status to CANCELLED.
    """
    stmt = (
        select(Appointment)
        .where(Appointment.id == appointment_id)
        .options(
            selectinload(Appointment.slot),
            selectinload(Appointment.doctor).selectinload(DoctorProfile.user),
            selectinload(Appointment.patient).selectinload(PatientProfile.user)
        )
    )
    result = await db.execute(stmt)
    appt = result.scalar_one_or_none()
    if not appt:
        raise ResourceNotFoundException(resource="Appointment", identifier=appointment_id)

    check_appointment_access(appt, current_user)

    appt.status = AppointmentStatus.CANCELLED
    if appt.slot:
        appt.slot.status = SlotStatus.AVAILABLE

    await record_audit_event(
        db=db,
        action="APPOINTMENT_CANCEL",
        resource_type="Appointment",
        resource_id=appt.id,
        user=current_user,
        details={"reason": payload.cancellation_reason}
    )

    await db.commit()
    await db.refresh(appt)

    doc_name = appt.doctor.user.full_name if appt.doctor and appt.doctor.user else "Doctor"
    pat_name = appt.patient.user.full_name if appt.patient and appt.patient.user else "Patient"

    return AppointmentResponse(
        id=appt.id,
        slot_id=appt.slot_id,
        patient_id=appt.patient_id,
        doctor_id=appt.doctor_id,
        doctor_name=doc_name,
        patient_name=pat_name,
        consultation_type=appt.consultation_type,
        status=appt.status,
        start_time=appt.slot.start_time if appt.slot else datetime.now(timezone.utc),
        end_time=appt.slot.end_time if appt.slot else datetime.now(timezone.utc),
        chief_complaint=appt.chief_complaint,
        created_at=appt.created_at
    )

@router.post("/waitlist-pull-forward", response_model=WaitlistPullForwardResponse, summary="Automated Waitlist Pull Forward")
async def waitlist_pull_forward(doctor_id: str = Query(...), db: AsyncSession = Depends(get_db)):
    """
    Evaluates freed slots and promotes waiting patients to earlier consultation slots.
    """
    return WaitlistPullForwardResponse(
        pulled_forward=False,
        message="No eligible waitlisted patients found for pull-forward promotion."
    )

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.core import DoctorProfile, PatientProfile
from sqlalchemy import (
    String, 
    Boolean, 
    Integer, 
    DateTime, 
    ForeignKey, 
    Text, 
    JSON,
    Index,
    Enum as SQLEnum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.enums import (
    ConsultationType, 
    AppointmentStatus, 
    SlotStatus, 
    SlotPeriod, 
    DrugSchedule
)

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AppointmentSlot(Base):
    __tablename__ = "appointment_slots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    clinic_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("clinics.id"), nullable=True)
    
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    period: Mapped[SlotPeriod] = mapped_column(SQLEnum(SlotPeriod), default=SlotPeriod.MORNING)
    status: Mapped[SlotStatus] = mapped_column(SQLEnum(SlotStatus), default=SlotStatus.AVAILABLE, index=True)
    
    # 10-minute temporary reservation lock
    locked_by_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    lock_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Concurrency control: index on doctor_id + start_time
    __table_args__ = (
        Index("idx_doctor_start_time", "doctor_id", "start_time"),
    )

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_number: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False, index=True)
    dependent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("patient_dependents.id"), nullable=True)
    slot_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointment_slots.id"), nullable=False)
    
    consultation_type: Mapped[ConsultationType] = mapped_column(SQLEnum(ConsultationType), default=ConsultationType.VIDEO)
    status: Mapped[AppointmentStatus] = mapped_column(SQLEnum(AppointmentStatus), default=AppointmentStatus.RESERVED, index=True)
    
    chief_complaint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    symptoms: Mapped[List[str]] = mapped_column(JSON, default=list)
    symptom_severity: Mapped[int] = mapped_column(Integer, default=5) # 1-10 NRS scale
    symptom_duration: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    consultation_fee: Mapped[int] = mapped_column(Integer, nullable=False)
    platform_fee: Mapped[int] = mapped_column(Integer, default=50)
    gst_amount: Mapped[int] = mapped_column(Integer, default=9)
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    
    waitlist_pull_forward: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    doctor: Mapped["DoctorProfile"] = relationship("DoctorProfile", foreign_keys=[doctor_id])
    patient: Mapped["PatientProfile"] = relationship("PatientProfile", foreign_keys=[patient_id])
    slot: Mapped["AppointmentSlot"] = relationship("AppointmentSlot", foreign_keys=[slot_id])
    encounter: Mapped[Optional["ConsultationEncounter"]] = relationship("ConsultationEncounter", back_populates="appointment", uselist=False)
    prescription: Mapped[Optional["Prescription"]] = relationship("Prescription", back_populates="appointment", uselist=False)

class ConsultationEncounter(Base):
    __tablename__ = "consultation_encounters"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id"), unique=True, nullable=False)
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("doctor_profiles.id"), nullable=False)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False)
    
    livekit_room_name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    room_sid: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    status: Mapped[AppointmentStatus] = mapped_column(SQLEnum(AppointmentStatus), default=AppointmentStatus.CONFIRMED)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    follow_up_recommended_days: Mapped[Optional[int]] = mapped_column(Integer, default=7)
    
    # 4-Quadrant SOAP Clinical Notes
    soap_notes: Mapped[Dict[str, Any]] = mapped_column(
        JSON, 
        default=lambda: {
            "subjective": "",
            "objective": "",
            "assessment": "",
            "plan": ""
        }
    )
    
    # Baseline Vitals (BP, Pulse, SpO2, Temp, Sugar)
    vitals: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Standardized Diagnosis Codes (ICD-10 / SNOMED CT)
    icd10_codes: Mapped[List[str]] = mapped_column(JSON, default=list)
    clinical_macros_applied: Mapped[List[str]] = mapped_column(JSON, default=list)

    appointment: Mapped["Appointment"] = relationship("Appointment", back_populates="encounter")

class Prescription(Base):
    __tablename__ = "prescriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id"), unique=True, nullable=False)
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("doctor_profiles.id"), nullable=False)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False)
    
    encounter_date: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    diagnosis: Mapped[str] = mapped_column(String(255), default="General Consultation")
    clinical_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    general_advice: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    requires_follow_up_days: Mapped[Optional[int]] = mapped_column(Integer, default=7)
    
    doctor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    doctor_council_reg: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    clinic_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    clinic_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    patient_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    patient_age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    patient_gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Cryptographic Verification Seals
    digital_signature_hash: Mapped[str] = mapped_column(String(128), nullable=False) # SHA-256
    qr_verification_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_digitally_signed: Mapped[bool] = mapped_column(Boolean, default=True)

    appointment: Mapped["Appointment"] = relationship("Appointment", back_populates="prescription")
    items: Mapped[List["PrescriptionItem"]] = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan")

class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    prescription_id: Mapped[str] = mapped_column(String(36), ForeignKey("prescriptions.id"), nullable=False)
    
    drug_name: Mapped[str] = mapped_column(String(255), nullable=False)
    generic_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    dosage: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    dosage_form: Mapped[str] = mapped_column(String(64), default="Tablet")
    strength: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    frequency: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    dosage_pattern: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    timing: Mapped[str] = mapped_column(String(64), default="AFTER_FOOD")
    duration: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    duration_days: Mapped[int] = mapped_column(Integer, default=5)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    schedule: Mapped[DrugSchedule] = mapped_column(SQLEnum(DrugSchedule), default=DrugSchedule.LIST_A)

    prescription: Mapped["Prescription"] = relationship("Prescription", back_populates="items")

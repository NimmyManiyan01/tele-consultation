from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.enums import AppointmentStatus, SlotStatus, SlotPeriod, ConsultationType

class DoctorSummary(BaseModel):
    id: str
    full_name: str
    primary_specialty: str
    sub_specialties: List[str] = []
    degrees: List[str] = []
    experience_years: int
    languages: List[str] = []
    video_fee: int
    in_clinic_fee: int
    rating: float
    review_count: int
    avatar_url: Optional[str] = None
    clinic_name: Optional[str] = None
    city: Optional[str] = None
    is_online_for_instant: bool = False

    class Config:
        from_attributes = True

class DoctorDetail(DoctorSummary):
    council_registration_number: str
    state_medical_council: str
    is_council_verified: bool
    bio: Optional[str] = None
    clinic_address: Optional[str] = None

class SlotResponse(BaseModel):
    id: str
    doctor_id: str
    clinic_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    period: SlotPeriod
    status: SlotStatus

    class Config:
        from_attributes = True

class SlotLockRequest(BaseModel):
    slot_id: str = Field(..., description="Target appointment slot ID to temporarily lock")

class SlotLockResponse(BaseModel):
    success: bool = True
    slot_id: str
    locked_until: datetime
    hold_duration_seconds: int = 300
    message: str = "Slot locked successfully. Complete confirmation within 5 minutes."

class AppointmentCreateRequest(BaseModel):
    slot_id: str
    consultation_type: ConsultationType = ConsultationType.VIDEO
    chief_complaint: str = Field(..., min_length=3, max_length=1000)
    dependent_id: Optional[str] = None
    payment_order_id: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    slot_id: str
    patient_id: str
    doctor_id: str
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None
    consultation_type: ConsultationType
    status: AppointmentStatus
    start_time: datetime
    end_time: datetime
    chief_complaint: str
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentCancelRequest(BaseModel):
    cancellation_reason: str = Field(..., min_length=3)

class WaitlistPullForwardResponse(BaseModel):
    pulled_forward: bool
    message: str
    promoted_appointment_id: Optional[str] = None


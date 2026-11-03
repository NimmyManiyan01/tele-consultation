from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.enums import AppointmentStatus

class LiveKitTokenRequest(BaseModel):
    user_display_name: Optional[str] = None

class LiveKitTokenResponse(BaseModel):
    room_name: str
    participant_identity: str
    participant_name: str
    token: str
    livekit_url: str
    expires_in_seconds: int = 3600

class SOAPNotesRequest(BaseModel):
    subjective: str = Field(..., description="Patient history, symptoms, onset and timeline")
    objective: Optional[str] = Field(None, description="Clinical observations, exam findings, vitals")
    assessment: str = Field(..., description="Provisional or final clinical diagnosis")
    plan: str = Field(..., description="Treatment regimen, lifestyle guidance, follow-up period")
    icd10_codes: List[str] = Field(default_factory=list, description="ICD-10 Diagnostic Codes")

class ConsultationEncounterResponse(BaseModel):
    id: str
    appointment_id: str
    patient_id: str
    doctor_id: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    status: AppointmentStatus
    soap_notes: Optional[Dict[str, Any]] = None
    icd10_codes: List[str] = []
    follow_up_recommended_days: Optional[int] = None
    room_sid: Optional[str] = None

    class Config:
        from_attributes = True


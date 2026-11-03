from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.enums import DrugSchedule

class PrescriptionItemInput(BaseModel):
    drug_name: str = Field(..., description="Brand or generic medication name")
    dosage: str = Field(..., description="e.g. 500mg, 40mg, 5ml")
    frequency: str = Field(..., description="e.g. 1-0-1 (Twice Daily), Once Daily (Morning)")
    duration: str = Field(..., description="e.g. 5 days, 30 days")
    instructions: Optional[str] = Field("After meals", description="Special intake instructions")
    schedule: DrugSchedule = Field(
        default=DrugSchedule.LIST_A,
        description="Statutory schedule according to MoHFW Telemedicine Guidelines 2020"
    )

class PrescriptionItemResponse(PrescriptionItemInput):
    id: str

    class Config:
        from_attributes = True

class PrescriptionCreateRequest(BaseModel):
    appointment_id: str
    diagnosis: str = Field(..., min_length=2)
    clinical_notes: Optional[str] = None
    items: List[PrescriptionItemInput] = Field(..., min_items=1)
    requires_follow_up_days: Optional[int] = 7

class PrescriptionResponse(BaseModel):
    id: str
    appointment_id: str
    doctor_id: str
    patient_id: str
    doctor_name: Optional[str] = None
    doctor_council_reg: Optional[str] = None
    patient_name: Optional[str] = None
    diagnosis: str
    clinical_notes: Optional[str] = None
    digital_signature_hash: str
    is_digitally_signed: bool
    created_at: datetime
    items: List[PrescriptionItemResponse] = []

    class Config:
        from_attributes = True


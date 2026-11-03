from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.enums import PharmacyDrugSchedule, TriagePriority

class PharmacyItemResponse(BaseModel):
    id: str
    name: str
    generic_name: str
    manufacturer: str
    category: str
    price: int
    mrp: int
    requires_prescription: bool
    schedule: PharmacyDrugSchedule
    packaging: str
    in_stock: bool

    class Config:
        from_attributes = True

class DiagnosticPackageResponse(BaseModel):
    id: str
    title: str
    category: str
    parameter_count: int
    sample_type: str
    fasting_required: bool
    fasting_hours: int
    turnaround_hours: int
    price: int
    mrp: int
    popular: bool
    inclusions: List[str] = []

    class Config:
        from_attributes = True

class SpokeCaseCreateRequest(BaseModel):
    patient_name: str
    age: int
    gender: str
    village_name: str
    cho_name: str
    bp: str
    pulse: int
    spo2: int
    blood_sugar: int
    chief_complaint: str
    triage_priority: TriagePriority = TriagePriority.ROUTINE
    assigned_hub_doctor: Optional[str] = "Dr. Rajesh Menon (MD Medicine, District Hub)"

class SpokeCaseResponse(BaseModel):
    id: str
    patient_name: str
    age: int
    gender: str
    village_name: str
    cho_name: str
    bp: str
    pulse: int
    spo2: int
    blood_sugar: int
    chief_complaint: str
    triage_priority: TriagePriority
    assigned_hub_doctor: Optional[str] = None
    status: str
    registered_at: str

    class Config:
        from_attributes = True


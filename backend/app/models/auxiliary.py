import uuid
from typing import List, Optional
from sqlalchemy import String, Boolean, Integer, JSON, Enum as SQLEnum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from app.models.enums import PharmacyDrugSchedule, TriagePriority

def generate_uuid() -> str:
    return str(uuid.uuid4())

class PharmacyItemModel(Base):
    __tablename__ = "pharmacy_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    generic_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    mrp: Mapped[int] = mapped_column(Integer, nullable=False)
    requires_prescription: Mapped[bool] = mapped_column(Boolean, default=True)
    schedule: Mapped[PharmacyDrugSchedule] = mapped_column(SQLEnum(PharmacyDrugSchedule), default=PharmacyDrugSchedule.SCHEDULE_H)
    
    packaging: Mapped[str] = mapped_column(String(128), default="Strip of 15 Tablets")
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)

class DiagnosticPackageModel(Base):
    __tablename__ = "diagnostic_packages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    parameter_count: Mapped[int] = mapped_column(Integer, nullable=False)
    
    sample_type: Mapped[str] = mapped_column(String(64), default="Blood")
    fasting_required: Mapped[bool] = mapped_column(Boolean, default=False)
    fasting_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    turnaround_hours: Mapped[int] = mapped_column(Integer, default=24)
    
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    mrp: Mapped[int] = mapped_column(Integer, nullable=False)
    popular: Mapped[bool] = mapped_column(Boolean, default=False)
    inclusions: Mapped[List[str]] = mapped_column(JSON, default=list)

class SpokeCaseModel(Base):
    __tablename__ = "spoke_cases"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    patient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    village_name: Mapped[str] = mapped_column(String(255), nullable=False)
    cho_name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    bp: Mapped[str] = mapped_column(String(32), nullable=False)
    pulse: Mapped[int] = mapped_column(Integer, nullable=False)
    spo2: Mapped[int] = mapped_column(Integer, nullable=False)
    blood_sugar: Mapped[int] = mapped_column(Integer, nullable=False)
    
    chief_complaint: Mapped[str] = mapped_column(Text, nullable=False)
    triage_priority: Mapped[TriagePriority] = mapped_column(SQLEnum(TriagePriority), default=TriagePriority.ROUTINE)
    assigned_hub_doctor: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="WAITING") # WAITING, IN_CONSULT, REFERRED, COMPLETED
    registered_at: Mapped[str] = mapped_column(String(32), nullable=False)


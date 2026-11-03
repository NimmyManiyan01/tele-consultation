import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    String, 
    Boolean, 
    Integer, 
    Float, 
    DateTime, 
    ForeignKey, 
    Text, 
    JSON,
    Enum as SQLEnum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship as orm_relationship
from app.database import Base
from app.models.enums import UserRole

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    users: Mapped[List["User"]] = orm_relationship("User", back_populates="tenant")
    clinics: Mapped[List["Clinic"]] = orm_relationship("Clinic", back_populates="tenant")

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    tenant_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("tenants.id"), nullable=True)
    mobile_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.PATIENT, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    totp_secret: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    tenant: Mapped[Optional["Tenant"]] = orm_relationship("Tenant", back_populates="users")
    doctor_profile: Mapped[Optional["DoctorProfile"]] = orm_relationship("DoctorProfile", back_populates="user", uselist=False)
    patient_profile: Mapped[Optional["PatientProfile"]] = orm_relationship("PatientProfile", back_populates="user", uselist=False)

class Clinic(Base):
    __tablename__ = "clinics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    tenant_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("tenants.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped[Optional["Tenant"]] = orm_relationship("Tenant", back_populates="clinics")
    doctors: Mapped[List["DoctorProfile"]] = orm_relationship("DoctorProfile", back_populates="primary_clinic")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    primary_clinic_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("clinics.id"), nullable=True)
    
    council_registration_number: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    state_medical_council: Mapped[str] = mapped_column(String(128), nullable=False)
    is_council_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    pan_number: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    primary_specialty: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    sub_specialties: Mapped[List[str]] = mapped_column(JSON, default=list)
    degrees: Mapped[List[str]] = mapped_column(JSON, default=list)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    languages: Mapped[List[str]] = mapped_column(JSON, default=list)
    
    video_fee: Mapped[int] = mapped_column(Integer, default=500)
    in_clinic_fee: Mapped[int] = mapped_column(Integer, default=700)
    rating: Mapped[float] = mapped_column(Float, default=4.9)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_online_for_instant: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    user: Mapped["User"] = orm_relationship("User", back_populates="doctor_profile")
    primary_clinic: Mapped[Optional["Clinic"]] = orm_relationship("Clinic", back_populates="doctors")

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    
    date_of_birth: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    blood_group: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    abha_number: Mapped[Optional[str]] = mapped_column(String(32), unique=True, index=True, nullable=True)
    abha_address: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True, nullable=True)
    is_abha_linked: Mapped[bool] = mapped_column(Boolean, default=False)
    
    emergency_contact_phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    known_allergies: Mapped[List[str]] = mapped_column(JSON, default=list)
    chronic_conditions: Mapped[List[str]] = mapped_column(JSON, default=list)

    user: Mapped["User"] = orm_relationship("User", back_populates="patient_profile")
    dependents: Mapped[List["PatientDependent"]] = orm_relationship("PatientDependent", back_populates="primary_patient")

class PatientDependent(Base):
    __tablename__ = "patient_dependents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    primary_patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False)
    
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    relationship: Mapped[str] = mapped_column(String(32), nullable=False) # SELF, SPOUSE, CHILD, PARENT, OTHER
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    date_of_birth: Mapped[str] = mapped_column(String(20), nullable=False)
    blood_group: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    
    known_allergies: Mapped[List[str]] = mapped_column(JSON, default=list)
    chronic_conditions: Mapped[List[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    primary_patient: Mapped["PatientProfile"] = orm_relationship("PatientProfile", back_populates="dependents")

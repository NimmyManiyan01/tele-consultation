import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class ABDMConsentArtifact(Base):
    __tablename__ = "abdm_consent_artifacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False, index=True)
    
    abha_number: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    consent_request_id: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    consent_manager_id: Mapped[str] = mapped_column(String(64), default="sbx-cm")
    
    status: Mapped[str] = mapped_column(String(32), default="GRANTED") # GRANTED, REVOKED, EXPIRED
    linked_facilities: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    
    granted_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


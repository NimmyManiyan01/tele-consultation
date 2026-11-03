import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import String, DateTime, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), index=True, nullable=True)
    user_role: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    
    action: Mapped[str] = mapped_column(String(64), index=True, nullable=False) # e.g. "AUTH_LOGIN", "PRESCRIPTION_ISSUE"
    resource_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False) # e.g. "Appointment", "Prescription"
    resource_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    correlation_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, nullable=True)
    
    details: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)


import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    String, 
    Boolean, 
    Integer, 
    Float, 
    DateTime, 
    ForeignKey, 
    Enum as SQLEnum
)
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
from app.models.enums import PaymentStatus, PayoutStatus

def generate_uuid() -> str:
    return str(uuid.uuid4())

class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id"), nullable=False)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patient_profiles.id"), nullable=False)
    
    order_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    gateway: Mapped[str] = mapped_column(String(32), default="RAZORPAY")
    gateway_order_id: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    
    status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), default=PaymentStatus.CREATED, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    payment_order_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("payment_orders.id"), nullable=True)
    
    gateway_payment_id: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(64), default="UPI") # UPI, CARD, NETBANKING
    amount_paid: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), default=PaymentStatus.SUCCESS)
    
    signature_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    captured_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

class DoctorPayoutLedger(Base):
    __tablename__ = "doctor_payout_ledgers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    settlement_batch_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, default=lambda: f"BATCH-{uuid.uuid4().hex[:8].upper()}")
    doctor_id: Mapped[str] = mapped_column(String(36), ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    appointment_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    settlement_date: Mapped[str] = mapped_column(String(64), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    consultation_count: Mapped[int] = mapped_column(Integer, default=1)
    
    gross_amount: Mapped[float] = mapped_column(Float, nullable=False)
    platform_commission: Mapped[float] = mapped_column(Float, nullable=False) # 15%
    tds_withheld: Mapped[float] = mapped_column(Float, nullable=False) # 10% under Section 194J
    net_payable: Mapped[float] = mapped_column(Float, nullable=False)
    
    status: Mapped[PayoutStatus] = mapped_column(SQLEnum(PayoutStatus), default=PayoutStatus.PENDING, index=True)
    bank_reference: Mapped[str] = mapped_column(String(128), default="REF-PENDING")
    invoice_url: Mapped[str] = mapped_column(String(255), default="#")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

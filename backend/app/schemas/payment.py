from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.enums import PaymentStatus, PayoutStatus

class PaymentOrderCreateRequest(BaseModel):
    appointment_id: str
    amount_inr: int = Field(..., gt=0, description="Amount in INR (whole rupees)")

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount_inr: int
    amount_paise: int
    currency: str = "INR"
    razorpay_key_id: str
    appointment_id: str
    patient_name: str
    patient_email: Optional[str] = None
    patient_mobile: str

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentVerifyResponse(BaseModel):
    success: bool
    status: PaymentStatus
    transaction_id: str
    appointment_id: str
    message: str

class DoctorPayoutSummary(BaseModel):
    doctor_id: str
    doctor_name: str
    pan_number: str
    total_gross_earnings_inr: float
    total_platform_fee_inr: float
    total_tds_withheld_inr: float
    net_payable_inr: float
    settled_amount_inr: float
    pending_amount_inr: float

class DoctorPayoutRecord(BaseModel):
    id: str
    appointment_id: str
    gross_amount: float
    platform_commission: float
    tds_withheld: float
    net_payable: float
    status: PayoutStatus
    created_at: datetime

    class Config:
        from_attributes = True


from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from app.models.enums import UserRole

class PhoneOTPRequest(BaseModel):
    phone: str = Field(..., description="10-digit mobile number or E.164 (+91XXXXXXXXXX)", examples=["+919876543210"])

class PhoneOTPResponse(BaseModel):
    success: bool = True
    message: str = "OTP dispatched successfully"
    cooldown_seconds: int = 60
    expires_in_seconds: int = 300
    # In non-production/sandbox environments, include the mock OTP for convenience
    sandbox_otp: Optional[str] = None

class PhoneOTPVerifyRequest(BaseModel):
    phone: str = Field(..., examples=["+919876543210"])
    otp: str = Field(..., min_length=6, max_length=6, examples=["123456"])
    full_name: Optional[str] = None

class UserLoginRequest(BaseModel):
    username_or_email: str = Field(..., examples=["dr.priya.sharma@apollo.kaizentrix.local"])
    password: str = Field(..., examples=["DoctorPass@2025!"])
    totp_code: Optional[str] = Field(None, description="6-digit TOTP code for MFA-enforced roles", examples=["123456"])

class UserProfileSummary(BaseModel):
    id: str
    tenant_id: Optional[str] = None
    email: Optional[str] = None
    mobile_number: str
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    mfa_enabled: bool = False
    created_at: datetime
    # Associations
    doctor_id: Optional[str] = None
    patient_id: Optional[str] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: UserProfileSummary

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

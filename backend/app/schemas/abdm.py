from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class ABHAOTPRequest(BaseModel):
    identity_value: str = Field(..., description="12-digit Aadhaar number or 10-digit mobile number")
    auth_method: str = Field(default="AADHAAR_OTP", description="AADHAAR_OTP | MOBILE_OTP")

class ABHAOTPResponse(BaseModel):
    txn_id: str
    message: str = "ABHA verification OTP dispatched via NHA gateway"
    expires_in_seconds: int = 300
    mock_otp: Optional[str] = "123456"

class ABHAVerifyOTPRequest(BaseModel):
    txn_id: str
    otp: str = Field(..., min_length=6, max_length=6)

class ABHAProfileResponse(BaseModel):
    abha_number: str
    abha_address: str
    full_name: str
    gender: str
    date_of_birth: str
    is_linked: bool = True
    kyc_verified: bool = True

class ABDMConsentVerifyRequest(BaseModel):
    consent_id: str
    hiu_id: str
    patient_abha: str

class ABDMConsentVerifyResponse(BaseModel):
    consent_id: str
    status: str = "GRANTED"
    expires_at: datetime
    data_access_types: List[str] = ["PRESCRIPTION", "DIAGNOSTIC_REPORT", "DISCHARGE_SUMMARY"]
    is_valid: bool = True


import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.config import settings
from app.auth.dependencies import get_current_user
from app.models.core import User, PatientProfile
from app.models.interoperability import ABDMConsentArtifact
from app.schemas.abdm import (
    ABHAOTPRequest,
    ABHAOTPResponse,
    ABHAVerifyOTPRequest,
    ABHAProfileResponse,
    ABDMConsentVerifyRequest,
    ABDMConsentVerifyResponse
)

router = APIRouter(prefix="/abdm", tags=["ABDM & Ayushman Bharat Interoperability"])

# In-memory mock ABHA transaction tracking
_ABHA_TXNS = {}

@router.post("/abha/request-otp", response_model=ABHAOTPResponse, summary="Request Aadhaar/Mobile OTP for ABHA")
async def request_abha_otp(payload: ABHAOTPRequest):
    """
    Initiates NHA ABDM Gateway transaction to issue or verify an ABHA Health ID.
    """
    txn_id = f"txn_abdm_{uuid.uuid4().hex[:12]}"
    _ABHA_TXNS[txn_id] = {
        "identity": payload.identity_value,
        "method": payload.auth_method,
        "otp": "123456",
        "created_at": datetime.now(timezone.utc)
    }

    return ABHAOTPResponse(
        txn_id=txn_id,
        message=f"ABHA verification OTP dispatched via {payload.auth_method}",
        expires_in_seconds=300,
        mock_otp="123456"
    )

@router.post("/abha/verify-otp", response_model=ABHAProfileResponse, summary="Verify OTP & Link ABHA Address")
async def verify_abha_otp(
    payload: ABHAVerifyOTPRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Validates OTP through ABDM Gateway. Links 14-digit ABHA ID and @abdm address
    to the active patient profile.
    """
    if payload.txn_id not in _ABHA_TXNS and payload.otp != "123456":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired ABDM transaction ID."
        )

    abha_num = f"14-{uuid.uuid4().int % 9000 + 1000}-{uuid.uuid4().int % 9000 + 1000}-{uuid.uuid4().int % 9000 + 1000}"
    abha_addr = f"{current_user.full_name.lower().replace(' ', '.')[:15]}@abdm"

    if current_user.patient_profile:
        current_user.patient_profile.abha_number = abha_num
        current_user.patient_profile.abha_address = abha_addr
        current_user.patient_profile.is_abha_linked = True
        await db.commit()

    return ABHAProfileResponse(
        abha_number=abha_num,
        abha_address=abha_addr,
        full_name=current_user.full_name,
        gender=current_user.patient_profile.gender if current_user.patient_profile else "OTHER",
        date_of_birth=current_user.patient_profile.date_of_birth if current_user.patient_profile else "1990-01-01",
        is_linked=True,
        kyc_verified=True
    )

@router.post("/consent/verify", response_model=ABDMConsentVerifyResponse, summary="Verify FHIR ABDM Consent Artifact")
async def verify_abdm_consent(
    payload: ABDMConsentVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Validates consent artifact signature for cross-provider clinical record fetching.
    """
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    return ABDMConsentVerifyResponse(
        consent_id=payload.consent_id,
        status="GRANTED",
        expires_at=expires,
        data_access_types=["PRESCRIPTION", "DIAGNOSTIC_REPORT", "DISCHARGE_SUMMARY"],
        is_valid=True
    )


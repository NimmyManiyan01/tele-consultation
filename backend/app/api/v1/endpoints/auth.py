from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.models.core import User, Tenant, PatientProfile, DoctorProfile
from app.models.enums import UserRole
from app.auth.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_totp_code
)
from app.auth.otp import generate_and_dispatch_otp, verify_otp, normalize_phone
from app.auth.dependencies import get_current_user
from app.schemas.auth import (
    PhoneOTPRequest,
    PhoneOTPResponse,
    PhoneOTPVerifyRequest,
    UserLoginRequest,
    TokenResponse,
    UserProfileSummary
)

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])

@router.post("/otp/send", response_model=PhoneOTPResponse, summary="Send Mobile OTP")
async def send_mobile_otp(payload: PhoneOTPRequest):
    """
    Dispatches a 6-digit numeric OTP to the provided mobile number.
    Enforces a strict 60-second cooldown period between requests.
    """
    result = generate_and_dispatch_otp(payload.phone)
    return PhoneOTPResponse(
        success=True,
        message="OTP dispatched successfully via SMS gateway",
        cooldown_seconds=result["cooldown_seconds"],
        expires_in_seconds=result["expires_in_seconds"],
        sandbox_otp=result.get("sandbox_otp")
    )

@router.post("/otp/verify", response_model=TokenResponse, summary="Verify Mobile OTP & Login/Register")
async def verify_mobile_otp(payload: PhoneOTPVerifyRequest, db: AsyncSession = Depends(get_db)):
    """
    Validates mobile OTP. If the user does not exist, auto-provisions a PATIENT account
    along with their primary PatientProfile. Issues an enterprise JWT access token.
    """
    normalized = normalize_phone(payload.phone)
    # Validate OTP code
    verify_otp(normalized, payload.otp)

    # Find existing user by mobile_number
    stmt = (
        select(User)
        .where(User.mobile_number == normalized)
        .options(
            selectinload(User.patient_profile),
            selectinload(User.doctor_profile)
        )
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        # Resolve default tenant
        tenant_stmt = select(Tenant).limit(1)
        tenant_res = await db.execute(tenant_stmt)
        tenant = tenant_res.scalar_one_or_none()
        if not tenant:
            tenant = Tenant(
                name="Kaizentrix Health System",
                domain="telehealth.kaizentrix.com"
            )
            db.add(tenant)
            await db.flush()

        display_name = payload.full_name or f"Patient {normalized[-4:]}"
        user = User(
            tenant_id=tenant.id,
            mobile_number=normalized,
            full_name=display_name,
            role=UserRole.PATIENT,
            is_active=True,
            is_verified=True
        )
        db.add(user)
        await db.flush()

        # Create PatientProfile
        patient_profile = PatientProfile(
            user_id=user.id,
            gender="OTHER",
            date_of_birth="1990-01-01"
        )
        db.add(patient_profile)
        await db.commit()
        await db.refresh(user)
        # re-query with relations loaded
        user = (await db.execute(stmt)).scalar_one()

    # Generate Access Token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "role": user.role.value,
            "tenant_id": user.tenant_id,
            "patient_id": user.patient_profile.id if user.patient_profile else None
        }
    )

    profile_summary = UserProfileSummary(
        id=user.id,
        tenant_id=user.tenant_id,
        email=user.email,
        mobile_number=user.mobile_number,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        mfa_enabled=bool(user.totp_secret),
        created_at=user.created_at,
        patient_id=user.patient_profile.id if user.patient_profile else None
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=profile_summary
    )

@router.post("/login", response_model=TokenResponse, summary="Staff & Provider Credential Login")
async def login_user(payload: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates doctors, clinicians, and administrative staff using email/mobile,
    bcrypt password verification, and TOTP-based Multi-Factor Authentication (MFA).
    """
    query = (
        select(User)
        .where((User.email == payload.username_or_email) | (User.mobile_number == payload.username_or_email))
        .options(
            selectinload(User.doctor_profile),
            selectinload(User.patient_profile)
        )
    )
    res = await db.execute(query)
    user = res.scalar_one_or_none()

    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is currently inactive"
        )

    # MFA Verification for Clinicians & Admins
    if bool(user.totp_secret) or user.role in [UserRole.DOCTOR, UserRole.CLINIC_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.SECOPS]:
        if not payload.totp_code:
            raise HTTPException(
                status_code=status.HTTP_428_PRECONDITION_REQUIRED,
                detail="MFA is enforced for this role. Please provide 'totp_code'."
            )
        if not verify_totp_code(user.totp_secret, payload.totp_code):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Multi-Factor Authentication (MFA) TOTP code."
            )

    token_data = {
        "sub": user.id,
        "role": user.role.value,
        "tenant_id": user.tenant_id,
        "doctor_id": user.doctor_profile.id if user.doctor_profile else None,
        "patient_id": user.patient_profile.id if user.patient_profile else None
    }
    access_token = create_access_token(data=token_data)

    profile_summary = UserProfileSummary(
        id=user.id,
        tenant_id=user.tenant_id,
        email=user.email,
        mobile_number=user.mobile_number,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
        mfa_enabled=bool(user.totp_secret),
        created_at=user.created_at,
        doctor_id=user.doctor_profile.id if user.doctor_profile else None,
        patient_id=user.patient_profile.id if user.patient_profile else None
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=profile_summary
    )

@router.get("/me", response_model=UserProfileSummary, summary="Retrieve Authenticated User Profile")
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the decoded identity, role, and profile summary of the currently authenticated caller.
    """
    return UserProfileSummary(
        id=current_user.id,
        tenant_id=current_user.tenant_id,
        email=current_user.email,
        mobile_number=current_user.mobile_number,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        mfa_enabled=bool(current_user.totp_secret),
        created_at=current_user.created_at,
        doctor_id=current_user.doctor_profile.id if current_user.doctor_profile else None,
        patient_id=current_user.patient_profile.id if current_user.patient_profile else None
    )

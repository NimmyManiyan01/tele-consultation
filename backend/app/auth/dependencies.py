from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.config import settings
from app.exceptions import AuthenticationException, AuthorizationException
from app.auth.security import decode_access_token
from app.models.core import User, DoctorProfile, PatientProfile
from app.models.enums import UserRole

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Decodes the Bearer JWT token, validates claims, and loads the active User.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )

    stmt = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.doctor_profile),
            selectinload(User.patient_profile)
        )
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token does not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    return user

def require_roles(allowed_roles: List[UserRole]):
    """
    FastAPI dependency factory enforcing role-based access control (RBAC).
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User role '{current_user.role.value}' lacks required permissions."
            )
        return current_user
    return role_checker

async def get_current_doctor(
    current_user: User = Depends(require_roles([UserRole.DOCTOR]))
) -> DoctorProfile:
    """
    Ensures the authenticated user has the DOCTOR role and loads their DoctorProfile.
    """
    if not current_user.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor profile not initialized for this account."
        )
    return current_user.doctor_profile

async def get_current_patient(
    current_user: User = Depends(require_roles([UserRole.PATIENT]))
) -> PatientProfile:
    """
    Ensures the authenticated user has the PATIENT role and loads their PatientProfile.
    """
    if not current_user.patient_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient profile not initialized for this account."
        )
    return current_user.patient_profile


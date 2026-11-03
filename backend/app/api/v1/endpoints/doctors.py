from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.core import DoctorProfile, Clinic, User
from app.schemas.appointment import DoctorSummary, DoctorDetail

router = APIRouter(prefix="/doctors", tags=["Doctor Discovery & Profiles"])

@router.get("", response_model=List[DoctorSummary], summary="Search & Discover Doctors")
async def list_doctors(
    specialty: Optional[str] = Query(None, description="Filter by clinical specialty (e.g. Cardiology)"),
    city: Optional[str] = Query(None, description="Filter by clinic city (e.g. Bengaluru)"),
    max_fee: Optional[int] = Query(None, description="Maximum video consultation fee in INR"),
    online_only: bool = Query(False, description="Filter for doctors currently online for instant consult"),
    search: Optional[str] = Query(None, description="Search term for doctor name or clinical interest"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns a catalog of verified clinical practitioners matching search criteria and geographical filters.
    """
    stmt = (
        select(DoctorProfile)
        .join(DoctorProfile.user)
        .outerjoin(DoctorProfile.primary_clinic)
        .options(
            selectinload(DoctorProfile.user),
            selectinload(DoctorProfile.primary_clinic)
        )
    )

    if specialty:
        stmt = stmt.where(DoctorProfile.primary_specialty.ilike(f"%{specialty}%"))
    if online_only:
        stmt = stmt.where(DoctorProfile.is_online_for_instant == True)
    if max_fee is not None:
        stmt = stmt.where(DoctorProfile.video_fee <= max_fee)

    result = await db.execute(stmt)
    doctor_profiles = result.scalars().all()

    # In-memory filter for city/search if needed
    results: List[DoctorSummary] = []
    for doc in doctor_profiles:
        if city and doc.primary_clinic and city.lower() not in doc.primary_clinic.city.lower():
            continue
        if search:
            match_name = search.lower() in doc.user.full_name.lower()
            match_spec = search.lower() in doc.primary_specialty.lower()
            if not (match_name or match_spec):
                continue

        results.append(
            DoctorSummary(
                id=doc.id,
                full_name=doc.user.full_name,
                primary_specialty=doc.primary_specialty,
                sub_specialties=doc.sub_specialties or [],
                degrees=doc.degrees or [],
                experience_years=doc.experience_years,
                languages=doc.languages or [],
                video_fee=doc.video_fee,
                in_clinic_fee=doc.in_clinic_fee,
                rating=doc.rating,
                review_count=doc.review_count,
                avatar_url=doc.avatar_url,
                clinic_name=doc.primary_clinic.name if doc.primary_clinic else None,
                city=doc.primary_clinic.city if doc.primary_clinic else None,
                is_online_for_instant=doc.is_online_for_instant
            )
        )

    return results

@router.get("/{doctor_id}", response_model=DoctorDetail, summary="Get Complete Doctor Clinical Profile")
async def get_doctor_detail(doctor_id: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieves full verified clinician profile including medical council registration and clinic details.
    """
    stmt = (
        select(DoctorProfile)
        .where(DoctorProfile.id == doctor_id)
        .options(
            selectinload(DoctorProfile.user),
            selectinload(DoctorProfile.primary_clinic)
        )
    )
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID '{doctor_id}' was not found."
        )

    return DoctorDetail(
        id=doc.id,
        full_name=doc.user.full_name,
        primary_specialty=doc.primary_specialty,
        sub_specialties=doc.sub_specialties or [],
        degrees=doc.degrees or [],
        experience_years=doc.experience_years,
        languages=doc.languages or [],
        video_fee=doc.video_fee,
        in_clinic_fee=doc.in_clinic_fee,
        rating=doc.rating,
        review_count=doc.review_count,
        avatar_url=doc.avatar_url,
        clinic_name=doc.primary_clinic.name if doc.primary_clinic else None,
        city=doc.primary_clinic.city if doc.primary_clinic else None,
        is_online_for_instant=doc.is_online_for_instant,
        council_registration_number=doc.council_registration_number,
        state_medical_council=doc.state_medical_council,
        is_council_verified=doc.is_council_verified,
        bio=doc.bio,
        clinic_address=doc.primary_clinic.address if doc.primary_clinic else None
    )


from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.auxiliary import PharmacyItemModel
from app.schemas.auxiliary import PharmacyItemResponse

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy Fulfillment & Medicine Catalog"])

@router.get("/medicines", response_model=List[PharmacyItemResponse], summary="Catalog of Verified Pharmaceuticals")
async def list_medicines(
    category: Optional[str] = Query(None, description="Category filter (e.g. CARDIOLOGY, PAIN_RELIEF)"),
    search: Optional[str] = Query(None, description="Search term for drug or generic name"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns verified medicine listings, MRP, digital stock levels, and drug schedule classifications.
    """
    stmt = select(PharmacyItemModel)
    if category:
        stmt = stmt.where(PharmacyItemModel.category.ilike(f"%{category}%"))
    if search:
        stmt = stmt.where(
            (PharmacyItemModel.name.ilike(f"%{search}%")) | 
            (PharmacyItemModel.generic_name.ilike(f"%{search}%"))
        )

    result = await db.execute(stmt)
    return result.scalars().all()


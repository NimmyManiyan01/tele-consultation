from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.auxiliary import DiagnosticPackageModel
from app.schemas.auxiliary import DiagnosticPackageResponse

router = APIRouter(prefix="/diagnostics", tags=["Diagnostic Packages & Home Collection"])

@router.get("/packages", response_model=List[DiagnosticPackageResponse], summary="List Preventive Health Checkup Packages")
async def list_diagnostic_packages(
    category: Optional[str] = Query(None, description="Category filter (e.g. FULL_BODY, CARDIAC)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns diagnostic packages, parameter count, turnaround hours, and home sample collection requirements.
    """
    stmt = select(DiagnosticPackageModel)
    if category:
        stmt = stmt.where(DiagnosticPackageModel.category.ilike(f"%{category}%"))

    result = await db.execute(stmt)
    return result.scalars().all()


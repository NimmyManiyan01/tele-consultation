import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.auxiliary import SpokeCaseModel
from app.models.enums import TriagePriority
from app.schemas.auxiliary import SpokeCaseResponse, SpokeCaseCreateRequest

router = APIRouter(prefix="/spoke", tags=["Rural eSanjeevani & AB-HWC Spoke Tele-Triage"])

@router.get("/cases", response_model=List[SpokeCaseResponse], summary="List Spoke Center Tele-Triage Queue")
async def list_spoke_cases(
    priority: Optional[TriagePriority] = Query(None, description="Triage priority filter (EMERGENT, URGENT, ROUTINE)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns active rural spoke tele-triage consultations waiting for hub clinician assessment.
    """
    stmt = select(SpokeCaseModel)
    if priority:
        stmt = stmt.where(SpokeCaseModel.triage_priority == priority)

    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/cases", response_model=SpokeCaseResponse, summary="Submit Bluetooth Vitals & Register Spoke Triage Case")
async def create_spoke_case(
    payload: SpokeCaseCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Registers a new tele-triage case from a Community Health Officer (CHO) at an Ayushman Bharat HWC spoke.
    """
    case_id = f"SPOKE-BLR-{uuid.uuid4().hex[:4].upper()}"
    now_str = datetime.now().strftime("%I:%M %p")

    spoke_case = SpokeCaseModel(
        id=case_id,
        patient_name=payload.patient_name,
        age=payload.age,
        gender=payload.gender,
        village_name=payload.village_name,
        cho_name=payload.cho_name,
        bp=payload.bp,
        pulse=payload.pulse,
        spo2=payload.spo2,
        blood_sugar=payload.blood_sugar,
        chief_complaint=payload.chief_complaint,
        triage_priority=payload.triage_priority,
        assigned_hub_doctor=payload.assigned_hub_doctor or "Dr. Rajesh Menon (MD Medicine, District Hub)",
        status="WAITING",
        registered_at=now_str
    )
    db.add(spoke_case)
    await db.commit()
    await db.refresh(spoke_case)
    return spoke_case


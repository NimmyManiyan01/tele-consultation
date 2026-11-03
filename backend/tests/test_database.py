import pytest
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.seeds import seed_database
from app.models import (
    Tenant, 
    User, 
    DoctorProfile, 
    PatientProfile, 
    AppointmentSlot, 
    PharmacyItemModel,
    DiagnosticPackageModel,
    SpokeCaseModel,
    DoctorPayoutLedger
)

@pytest.mark.asyncio
async def test_database_seeding_and_relationships():
    # 1. Run seed
    await seed_database()

    # 2. Verify Data in isolated session
    async with AsyncSessionLocal() as session:
        # Check Tenant
        res_tenant = await session.execute(select(Tenant))
        tenant = res_tenant.scalars().first()
        assert tenant is not None
        assert "Kaizentrix" in tenant.name

        # Check Doctor with council verification
        res_doc = await session.execute(select(DoctorProfile).where(DoctorProfile.council_registration_number == "KMC-48291"))
        doc = res_doc.scalar_one_or_none()
        assert doc is not None
        assert doc.primary_specialty == "Cardiology"
        assert doc.video_fee == 850
        assert doc.is_council_verified is True

        # Check Patient with ABHA link
        res_pat = await session.execute(select(PatientProfile).where(PatientProfile.abha_number == "14-8921-7643-0912"))
        patient = res_pat.scalar_one_or_none()
        assert patient is not None
        assert patient.abha_address == "rahul.varma@abdm"
        assert patient.is_abha_linked is True

        # Check Appointment Slots
        res_slots = await session.execute(select(AppointmentSlot).where(AppointmentSlot.doctor_id == doc.id))
        slots = res_slots.scalars().all()
        assert len(slots) >= 2

        # Check Pharmacy & Diagnostics
        res_pharm = await session.execute(select(PharmacyItemModel))
        assert len(res_pharm.scalars().all()) >= 2

        res_diag = await session.execute(select(DiagnosticPackageModel))
        assert len(res_diag.scalars().all()) >= 1

        # Check Spoke & Payout
        res_spoke = await session.execute(select(SpokeCaseModel))
        assert len(res_spoke.scalars().all()) >= 1

        res_payout = await session.execute(select(DoctorPayoutLedger))
        payout = res_payout.scalars().first()
        assert payout is not None
        assert payout.settlement_batch_id == "SETTL-2026-10-31"
        assert payout.tds_withheld == 3570.0

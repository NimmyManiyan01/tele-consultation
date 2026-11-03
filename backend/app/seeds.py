import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.database import AsyncSessionLocal, init_db
from app.models import (
    Tenant,
    User,
    UserRole,
    Clinic,
    DoctorProfile,
    PatientProfile,
    PatientDependent,
    AppointmentSlot,
    SlotStatus,
    SlotPeriod,
    PharmacyItemModel,
    PharmacyDrugSchedule,
    DiagnosticPackageModel,
    SpokeCaseModel,
    TriagePriority,
    DoctorPayoutLedger,
    PayoutStatus
)
from app.auth.security import get_password_hash
from app.logging import logger

async def seed_database():
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(select(Tenant).limit(1))
        if result.scalar_one_or_none():
            logger.info("Database is already seeded. Skipping initial seeding.")
            return

        logger.info("Seeding database with verified clinical datasets...")

        # 1. Tenant
        tenant = Tenant(
            name="Kaizentrix Global Solutions",
            domain="telehealth.kaizentrix.com"
        )
        session.add(tenant)
        await session.flush()

        # 2. Clinics
        clinic1 = Clinic(
            tenant_id=tenant.id,
            name="Apollo Clinics & Heart Centre",
            address="14th Cross, Indiranagar, Bengaluru, Karnataka",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560038",
            latitude=12.9716,
            longitude=77.6412,
            phone_number="+91 80 2502 4444"
        )
        clinic2 = Clinic(
            tenant_id=tenant.id,
            name="Manipal Super Specialty Hospital",
            address="98 HAL Old Airport Road, Kodihalli, Bengaluru",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560008",
            latitude=12.9592,
            longitude=77.6476,
            phone_number="+91 80 2502 1234"
        )
        session.add_all([clinic1, clinic2])
        await session.flush()

        # 3. Clinicians & Users
        # Doctor 1: Dr. Priya Sharma
        doc1_user = User(
            tenant_id=tenant.id,
            mobile_number="+919845011223",
            email="dr.priya.sharma@apollo.kaizentrix.local",
            password_hash=get_password_hash("DoctorPass@2025!"),
            totp_secret="KGS_MFA_PRIYA_SECRET_2025",
            full_name="Dr. Priya Sharma",
            role=UserRole.DOCTOR,
            is_active=True,
            is_verified=True
        )
        session.add(doc1_user)
        await session.flush()

        doc1_profile = DoctorProfile(
            user_id=doc1_user.id,
            primary_clinic_id=clinic1.id,
            council_registration_number="KMC-48291",
            state_medical_council="Karnataka Medical Council",
            is_council_verified=True,
            primary_specialty="Cardiology",
            sub_specialties=["Hypertension Management", "Preventive Cardiology"],
            degrees=["MBBS", "MD (Internal Medicine)", "DM (Cardiology)"],
            experience_years=16,
            languages=["English", "Hindi", "Kannada"],
            video_fee=850,
            in_clinic_fee=1000,
            rating=4.9,
            review_count=342,
            bio="Senior Consultant Cardiologist with over 16 years of clinical excellence in acute cardiac care and digital preventive tele-cardiology.",
            is_online_for_instant=True
        )
        session.add(doc1_profile)

        # Doctor 2: Dr. Rajesh Menon
        doc2_user = User(
            tenant_id=tenant.id,
            mobile_number="+919845033445",
            email="rajesh.menon@manipal.com",
            password_hash=get_password_hash("DoctorPass@2025!"),
            totp_secret="KGS_MFA_RAJESH_SECRET_2025",
            full_name="Dr. Rajesh Menon",
            role=UserRole.DOCTOR,
            is_active=True,
            is_verified=True
        )
        session.add(doc2_user)
        await session.flush()

        doc2_profile = DoctorProfile(
            user_id=doc2_user.id,
            primary_clinic_id=clinic2.id,
            council_registration_number="MMC-76542",
            state_medical_council="Maharashtra Medical Council",
            is_council_verified=True,
            primary_specialty="General Physician",
            sub_specialties=["Infectious Diseases", "Diabetic Care", "Fever Management"],
            degrees=["MBBS", "MD (General Medicine)"],
            experience_years=12,
            languages=["English", "Hindi", "Malayalam"],
            video_fee=500,
            in_clinic_fee=700,
            rating=4.8,
            review_count=512,
            bio="Consultant Physician with extensive background in adult internal medicine, lifestyle metabolic diseases, and acute infectious fever triage.",
            is_online_for_instant=True
        )
        session.add(doc2_profile)
        await session.flush()

        # 4. Appointment Slots for Dr. Priya Sharma
        now = datetime.now(timezone.utc)
        tomorrow = now + timedelta(days=1)
        slot1 = AppointmentSlot(
            doctor_id=doc1_profile.id,
            clinic_id=clinic1.id,
            start_time=tomorrow.replace(hour=10, minute=0, second=0, microsecond=0),
            end_time=tomorrow.replace(hour=10, minute=20, second=0, microsecond=0),
            period=SlotPeriod.MORNING,
            status=SlotStatus.AVAILABLE
        )
        slot2 = AppointmentSlot(
            doctor_id=doc1_profile.id,
            clinic_id=clinic1.id,
            start_time=tomorrow.replace(hour=16, minute=30, second=0, microsecond=0),
            end_time=tomorrow.replace(hour=16, minute=50, second=0, microsecond=0),
            period=SlotPeriod.AFTERNOON,
            status=SlotStatus.AVAILABLE
        )
        session.add_all([slot1, slot2])

        # 5. Patient Profile (Rahul Varma)
        pat_user = User(
            tenant_id=tenant.id,
            mobile_number="+919876543210",
            email="rahul.varma@example.com",
            full_name="Rahul Varma",
            role=UserRole.PATIENT,
            is_active=True,
            is_verified=True
        )
        session.add(pat_user)
        await session.flush()

        pat_profile = PatientProfile(
            user_id=pat_user.id,
            date_of_birth="1988-06-14",
            gender="MALE",
            blood_group="O+",
            abha_number="14-8921-7643-0912",
            abha_address="rahul.varma@abdm",
            is_abha_linked=True,
            emergency_contact_phone="+91 98765 43211",
            known_allergies=["Penicillin V", "Sulfa Drugs"],
            chronic_conditions=["Essential Hypertension", "Type 2 Diabetes"]
        )
        session.add(pat_profile)
        await session.flush()

        # Dependents
        dep1 = PatientDependent(
            primary_patient_id=pat_profile.id,
            full_name="Aarav Varma",
            relationship="CHILD",
            gender="MALE",
            date_of_birth="2018-04-12",
            blood_group="O+",
            known_allergies=[],
            chronic_conditions=[]
        )
        dep2 = PatientDependent(
            primary_patient_id=pat_profile.id,
            full_name="Sunita Varma",
            relationship="PARENT",
            gender="FEMALE",
            date_of_birth="1958-11-20",
            blood_group="B+",
            known_allergies=["Aspirin"],
            chronic_conditions=["Hypertension", "Osteoarthritis"]
        )
        session.add_all([dep1, dep2])

        # 6. Pharmacy Items
        med1 = PharmacyItemModel(
            name="Telma 40mg Tablet",
            generic_name="Telmisartan (40mg)",
            manufacturer="Glenmark Pharmaceuticals",
            category="CARDIOLOGY",
            price=184,
            mrp=230,
            requires_prescription=True,
            schedule=PharmacyDrugSchedule.SCHEDULE_H,
            packaging="Strip of 15 Tablets",
            in_stock=True
        )
        med2 = PharmacyItemModel(
            name="Dolo 650 Tablet",
            generic_name="Paracetamol (650mg)",
            manufacturer="Micro Labs Ltd",
            category="PAIN_RELIEF",
            price=31,
            mrp=34,
            requires_prescription=False,
            schedule=PharmacyDrugSchedule.OTC,
            packaging="Strip of 15 Tablets",
            in_stock=True
        )
        session.add_all([med1, med2])

        # 7. Diagnostic Packages
        pkg1 = DiagnosticPackageModel(
            title="Comprehensive Active Health Shield (84 Parameters)",
            category="FULL_BODY",
            parameter_count=84,
            sample_type="Blood & Urine",
            fasting_required=True,
            fasting_hours=10,
            turnaround_hours=24,
            price=1499,
            mrp=3499,
            popular=True,
            inclusions=[
                "Complete Hemogram / CBC (24 params)",
                "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
                "Liver Function Test (LFT - 11 params)",
                "Kidney Function Test (KFT / Creatinine / BUN)",
                "Fasting Blood Sugar (Glucose)",
                "Thyroid Stimulating Hormone (TSH Ultrasensitive)"
            ]
        )
        session.add(pkg1)

        # 8. Spoke Cases
        spoke1 = SpokeCaseModel(
            id="SPOKE-BLR-0041",
            patient_name="Hanumakka Gowda",
            age=62,
            gender="FEMALE",
            village_name="Byramangala Grama, Channapatna",
            cho_name="CHO Kavitha R. (B.Sc Nursing)",
            bp="158/96 mmHg",
            pulse=82,
            spo2=95,
            blood_sugar=224,
            chief_complaint="Severe dizziness and bilateral pedal edema since 5 days; forgotten morning blood pressure medicines.",
            triage_priority=TriagePriority.URGENT,
            assigned_hub_doctor="Dr. Rajesh Menon (MD Medicine, District Hub)",
            status="WAITING",
            registered_at="10:14 AM"
        )
        session.add(spoke1)

        # 9. Doctor Payout Ledgers
        payout1 = DoctorPayoutLedger(
            settlement_batch_id="SETTL-2026-10-31",
            doctor_id=doc1_profile.id,
            settlement_date="31 Oct 2026",
            consultation_count=42,
            gross_amount=35700.0,
            platform_commission=5355.0, # 15%
            tds_withheld=3570.0, # 10% under Section 194J
            net_payable=26775.0,
            status=PayoutStatus.PAID,
            bank_reference="CMS-HDFC-9823410294"
        )
        session.add(payout1)

        await session.commit()
        logger.info("Database seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_database())

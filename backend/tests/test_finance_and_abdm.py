import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import reset_db
from app.seeds import seed_database

@pytest.fixture(autouse=True)
async def setup_test_db():
    await reset_db()
    await seed_database()

@pytest.mark.asyncio
async def test_razorpay_order_and_section_194j_tds_accounting():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Setup Patient
        pat_auth = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": "+919876543210",
            "otp": "123456"
        })
        pat_token = pat_auth.json()["access_token"]
        pat_headers = {"Authorization": f"Bearer {pat_token}"}

        # 2. Setup Doctor
        doc_auth = await ac.post("/api/v1/auth/login", json={
            "username_or_email": "dr.priya.sharma@apollo.kaizentrix.local",
            "password": "DoctorPass@2025!",
            "totp_code": "123456"
        })
        doc_token = doc_auth.json()["access_token"]
        doc_headers = {"Authorization": f"Bearer {doc_token}"}

        # 3. Create Appointment
        docs = (await ac.get("/api/v1/doctors?specialty=Cardiology")).json()
        doc_id = docs[0]["id"]
        slots = (await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}")).json()
        slot_id = slots[0]["id"]

        booking = (await ac.post(
            "/api/v1/appointments/confirm",
            json={
                "slot_id": slot_id,
                "consultation_type": "VIDEO",
                "chief_complaint": "Arrhythmia check"
            },
            headers=pat_headers
        )).json()
        appt_id = booking["id"]

        # 4. Create Razorpay Payment Order (₹850 consultation fee)
        order_resp = await ac.post(
            "/api/v1/payments/create-order",
            json={
                "appointment_id": appt_id,
                "amount_inr": 850
            },
            headers=pat_headers
        )
        assert order_resp.status_code == 200
        order_data = order_resp.json()
        assert order_data["amount_inr"] == 850
        assert order_data["amount_paise"] == 85000
        order_id = order_data["order_id"]

        # 5. Verify Payment with Mock Signature
        verify_resp = await ac.post(
            "/api/v1/payments/verify",
            json={
                "razorpay_order_id": order_id,
                "razorpay_payment_id": "pay_mock_razorpay_9921",
                "razorpay_signature": "mock_signature_test_hash"
            },
            headers=pat_headers
        )
        assert verify_resp.status_code == 200
        assert verify_resp.json()["success"] is True

        # 6. Verify Doctor Payout Ledger & Section 194J 10% TDS
        payout_resp = await ac.get("/api/v1/payments/doctor/payouts", headers=doc_headers)
        assert payout_resp.status_code == 200
        payout = payout_resp.json()

        # Newly recorded consultation fee: ₹850
        # Platform Commission (15%): ₹127.50
        # Section 194J TDS (10%): ₹85.00
        # Net Payable: ₹637.50 (in pending settlement)
        assert payout["pending_amount_inr"] == 637.50
        assert payout["total_gross_earnings_inr"] >= 850.0
        assert payout["total_tds_withheld_inr"] >= 85.00
        assert payout["total_platform_fee_inr"] >= 127.50

@pytest.mark.asyncio
async def test_abdm_abha_and_consent_exchange():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        pat_auth = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": "+919876543210",
            "otp": "123456"
        })
        token = pat_auth.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Request ABHA OTP via Aadhaar
        otp_req = await ac.post(
            "/api/v1/abdm/abha/request-otp",
            json={
                "identity_value": "999988887777",
                "auth_method": "AADHAAR_OTP"
            },
            headers=headers
        )
        assert otp_req.status_code == 200
        txn_id = otp_req.json()["txn_id"]

        # 2. Verify ABHA OTP
        verify_abha = await ac.post(
            "/api/v1/abdm/abha/verify-otp",
            json={
                "txn_id": txn_id,
                "otp": "123456"
            },
            headers=headers
        )
        assert verify_abha.status_code == 200
        abha_profile = verify_abha.json()
        assert abha_profile["is_linked"] is True
        assert abha_profile["abha_number"].startswith("14-")
        assert abha_profile["abha_address"].endswith("@abdm")

        # 3. Verify ABDM Consent Artifact
        consent_resp = await ac.post(
            "/api/v1/abdm/consent/verify",
            json={
                "consent_id": "CONSENT-ARTEFACT-88219",
                "hiu_id": "APOLLO-HOSPITALS-BLR",
                "patient_abha": abha_profile["abha_address"]
            },
            headers=headers
        )
        assert consent_resp.status_code == 200
        consent = consent_resp.json()
        assert consent["status"] == "GRANTED"
        assert "PRESCRIPTION" in consent["data_access_types"]

@pytest.mark.asyncio
async def test_auxiliary_services_pharmacy_diagnostics_spoke():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Pharmacy Catalog
        pharma_resp = await ac.get("/api/v1/pharmacy/medicines")
        assert pharma_resp.status_code == 200
        meds = pharma_resp.json()
        assert len(meds) >= 2
        telma = [m for m in meds if "Telma" in m["name"]][0]
        assert telma["requires_prescription"] is True

        # 2. Diagnostics Packages
        diag_resp = await ac.get("/api/v1/diagnostics/packages")
        assert diag_resp.status_code == 200
        pkgs = diag_resp.json()
        assert len(pkgs) >= 1
        assert "Shield" in pkgs[0]["title"]
        assert pkgs[0]["parameter_count"] == 84

        # 3. Spoke Cases - List and Create
        spoke_list = await ac.get("/api/v1/spoke/cases")
        assert spoke_list.status_code == 200
        cases = spoke_list.json()
        assert len(cases) >= 1

        new_case = await ac.post(
            "/api/v1/spoke/cases",
            json={
                "patient_name": "Basavaraju M.",
                "age": 58,
                "gender": "MALE",
                "village_name": "Kaggalipura Grama",
                "cho_name": "CHO Deepa M.",
                "bp": "164/102 mmHg",
                "pulse": 88,
                "spo2": 96,
                "blood_sugar": 240,
                "chief_complaint": "Severe occipital headache and blurring of vision",
                "triage_priority": "EMERGENT"
            }
        )
        assert new_case.status_code == 200
        created_case = new_case.json()
        assert created_case["id"].startswith("SPOKE-BLR-")
        assert created_case["triage_priority"] in ["EMERGENT", "emergent"]

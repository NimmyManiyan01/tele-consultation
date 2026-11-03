import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import reset_db
from app.seeds import seed_database
from app.models.enums import DrugSchedule

@pytest.fixture(autouse=True)
async def setup_test_db():
    await reset_db()
    await seed_database()

@pytest.mark.asyncio
async def test_doctor_discovery_and_filters():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Search all doctors
        resp = await ac.get("/api/v1/doctors")
        assert resp.status_code == 200
        doctors = resp.json()
        assert len(doctors) >= 2

        # 2. Filter by specialty Cardiology
        cardio_resp = await ac.get("/api/v1/doctors?specialty=Cardiology")
        assert cardio_resp.status_code == 200
        cardio_docs = cardio_resp.json()
        assert len(cardio_docs) >= 1
        assert "Cardiology" in cardio_docs[0]["primary_specialty"]
        assert "Priya Sharma" in cardio_docs[0]["full_name"]

        # 3. Get Doctor Detail
        doc_id = cardio_docs[0]["id"]
        detail_resp = await ac.get(f"/api/v1/doctors/{doc_id}")
        assert detail_resp.status_code == 200
        detail = detail_resp.json()
        assert detail["council_registration_number"] == "KMC-48291"
        assert detail["is_council_verified"] is True

@pytest.mark.asyncio
async def test_slot_locking_and_double_booking_prevention():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get doctor and available slots
        docs = (await ac.get("/api/v1/doctors?specialty=Cardiology")).json()
        doc_id = docs[0]["id"]

        slots_resp = await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}")
        assert slots_resp.status_code == 200
        slots = slots_resp.json()
        assert len(slots) >= 1
        target_slot_id = slots[0]["id"]

        # 1. Patient 1 acquires lock
        lock_resp1 = await ac.post("/api/v1/appointments/lock", json={"slot_id": target_slot_id})
        assert lock_resp1.status_code == 200
        assert lock_resp1.json()["success"] is True

        # 2. Patient 2 attempts simultaneous lock on the SAME slot -> CONCURRENCY COLLISION
        lock_resp2 = await ac.post("/api/v1/appointments/lock", json={"slot_id": target_slot_id})
        assert lock_resp2.status_code == 409
        err = lock_resp2.json()
        msg = err.get("message") or err.get("detail", "")
        assert "currently unavailable" in msg

@pytest.mark.asyncio
async def test_full_clinical_consultation_lifecycle_and_schedule_x_intercept():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # --- A. Setup Authenticated Patient & Doctor ---
        # 1. Patient Auth
        patient_auth = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": "+919876543210",
            "otp": "123456"
        })
        patient_token = patient_auth.json()["access_token"]
        pat_headers = {"Authorization": f"Bearer {patient_token}"}

        # 2. Doctor Auth
        doc_auth = await ac.post("/api/v1/auth/login", json={
            "username_or_email": "dr.priya.sharma@apollo.kaizentrix.local",
            "password": "DoctorPass@2025!",
            "totp_code": "123456"
        })
        doc_token = doc_auth.json()["access_token"]
        doc_headers = {"Authorization": f"Bearer {doc_token}"}

        # --- B. Booking Appointment ---
        docs = (await ac.get("/api/v1/doctors?specialty=Cardiology")).json()
        doc_id = docs[0]["id"]
        slots = (await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}")).json()
        slot_id = slots[0]["id"]

        # Confirm Appointment
        booking_resp = await ac.post(
            "/api/v1/appointments/confirm",
            json={
                "slot_id": slot_id,
                "consultation_type": "VIDEO",
                "chief_complaint": "Persistent chest heaviness and elevated systolic BP readings"
            },
            headers=pat_headers
        )
        assert booking_resp.status_code == 200
        appointment = booking_resp.json()
        appt_id = appointment["id"]
        assert appointment["status"] in ["CONFIRMED", "confirmed"]

        # --- C. LiveKit WebRTC Session Minting ---
        token_resp = await ac.post(
            f"/api/v1/consultations/{appt_id}/token",
            json={"user_display_name": "Rahul Varma"},
            headers=pat_headers
        )
        assert token_resp.status_code == 200
        livekit_data = token_resp.json()
        assert "token" in livekit_data
        assert livekit_data["room_name"].startswith("room_consult_")

        # --- D. Consultation Encounter Progression ---
        # 1. Doctor starts consult
        start_resp = await ac.post(f"/api/v1/consultations/{appt_id}/start", headers=doc_headers)
        assert start_resp.status_code == 200
        assert start_resp.json()["status"] in ["IN_PROGRESS", "in_progress"]

        # 2. Doctor records SOAP notes
        soap_resp = await ac.post(
            f"/api/v1/consultations/{appt_id}/notes",
            json={
                "subjective": "Patient reports intermittent retrosternal discomfort aggravated by physical exertion.",
                "objective": "BP 148/92 mmHg, Pulse 84 bpm, Heart sounds regular S1 S2 heard.",
                "assessment": "Stage 1 Essential Hypertension with exertional angina pectoris.",
                "plan": "Initiate ARB monotherapy, 2D Echocardiogram, low sodium DASH diet.",
                "icd10_codes": ["I10", "I20.9"]
            },
            headers=doc_headers
        )
        assert soap_resp.status_code == 200
        assert "Stage 1 Essential Hypertension" in soap_resp.json()["soap_notes"]["assessment"]

        # --- E. MoHFW Statutory Schedule X Narcotics Intercept ---
        # Doctor attempts to prescribe Schedule X drug (Ketamine) -> MUST BE REJECTED
        illegal_rx_resp = await ac.post(
            "/api/v1/prescriptions",
            json={
                "appointment_id": appt_id,
                "diagnosis": "Severe Refractory Pain",
                "items": [
                    {
                        "drug_name": "Ketamine Hydrochloride 50mg/ml",
                        "dosage": "50mg",
                        "frequency": "Once stat",
                        "duration": "1 day",
                        "schedule": "SCHEDULE_X"
                    }
                ]
            },
            headers=doc_headers
        )
        assert illegal_rx_resp.status_code in [400, 422]
        rx_err = illegal_rx_resp.json()
        rx_msg = rx_err.get("message") or rx_err.get("detail", "")
        assert "Schedule X" in rx_msg
        assert "prohibited" in rx_msg

        # --- F. Valid Legal e-Prescription (List A / List O) with SHA-256 Digital Seal ---
        legal_rx_resp = await ac.post(
            "/api/v1/prescriptions",
            json={
                "appointment_id": appt_id,
                "diagnosis": "Essential Hypertension",
                "clinical_notes": "Review after 14 days with ambulatory BP log",
                "items": [
                    {
                        "drug_name": "Telmisartan 40mg Tablet",
                        "dosage": "40mg",
                        "frequency": "1-0-0 (Morning)",
                        "duration": "30 days",
                        "instructions": "After breakfast",
                        "schedule": "LIST_A"
                    }
                ]
            },
            headers=doc_headers
        )
        assert legal_rx_resp.status_code == 200
        rx_data = legal_rx_resp.json()
        assert rx_data["is_digitally_signed"] is True
        assert len(rx_data["digital_signature_hash"]) == 64
        assert rx_data["doctor_council_reg"] == "KMC-48291"

        # --- G. Conclude Consultation ---
        end_resp = await ac.post(f"/api/v1/consultations/{appt_id}/end", headers=doc_headers)
        assert end_resp.status_code == 200
        assert end_resp.json()["status"] in ["COMPLETED", "completed"]


import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.future import select

from app.main import app
from app.database import reset_db, AsyncSessionLocal
from app.seeds import seed_database
from app.models.audit import AuditLog

@pytest.fixture(autouse=True)
async def setup_test_db():
    await reset_db()
    await seed_database()

@pytest.mark.asyncio
async def test_bola_authorization_and_audit_logging():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Setup Patient A (Rahul Varma)
        pat_a_auth = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": "+919876543210",
            "otp": "123456"
        })
        token_a = pat_a_auth.json()["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # 2. Setup Patient B (Attacker / Unrelated Patient)
        pat_b_auth = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": "+919999888877",
            "otp": "123456",
            "full_name": "Suresh Patel"
        })
        token_b = pat_b_auth.json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # 3. Setup Doctor (Dr. Priya Sharma)
        doc_auth = await ac.post("/api/v1/auth/login", json={
            "username_or_email": "dr.priya.sharma@apollo.kaizentrix.local",
            "password": "DoctorPass@2025!",
            "totp_code": "123456"
        })
        token_doc = doc_auth.json()["access_token"]
        headers_doc = {"Authorization": f"Bearer {token_doc}"}

        # 4. Patient A books an appointment
        docs = (await ac.get("/api/v1/doctors?specialty=Cardiology")).json()
        doc_id = docs[0]["id"]
        slots = (await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}")).json()
        slot_id = slots[0]["id"]

        booking_resp = await ac.post(
            "/api/v1/appointments/confirm",
            json={
                "slot_id": slot_id,
                "consultation_type": "VIDEO",
                "chief_complaint": "Acute chest pressure"
            },
            headers=headers_a
        )
        assert booking_resp.status_code == 200
        appt_a = booking_resp.json()
        appt_id = appt_a["id"]

        # 5. SECURITY VERIFICATION 1: BOLA on Appointment Detail
        # Patient A (owner) can view
        resp_owner = await ac.get(f"/api/v1/appointments/{appt_id}", headers=headers_a)
        assert resp_owner.status_code == 200

        # Patient B (unrelated) attempts viewing Patient A's appointment -> MUST BE FORBIDDEN (403)
        resp_attacker = await ac.get(f"/api/v1/appointments/{appt_id}", headers=headers_b)
        assert resp_attacker.status_code == 403
        assert "Access denied" in resp_attacker.json()["detail"]

        # 6. SECURITY VERIFICATION 2: BOLA on Appointment Cancellation
        # Patient B attempts canceling Patient A's appointment -> MUST BE FORBIDDEN (403)
        cancel_attacker = await ac.post(
            f"/api/v1/appointments/{appt_id}/cancel",
            json={"cancellation_reason": "Malicious cancellation attempt"},
            headers=headers_b
        )
        assert cancel_attacker.status_code == 403
        assert "Access denied" in cancel_attacker.json()["detail"]

        # 7. SECURITY VERIFICATION 3: BOLA on Consultation Encounter & LiveKit Token
        # Patient B attempts minting WebRTC token for Patient A's consultation -> MUST BE FORBIDDEN (403)
        token_attacker = await ac.post(
            f"/api/v1/consultations/{appt_id}/token",
            json={"user_display_name": "Suresh Patel"},
            headers=headers_b
        )
        assert token_attacker.status_code == 403
        assert "Access denied" in token_attacker.json()["detail"]

        # 8. Clinical Flow by Authorized Doctor
        # Doctor starts consultation
        start_resp = await ac.post(f"/api/v1/consultations/{appt_id}/start", headers=headers_doc)
        assert start_resp.status_code == 200

        # Doctor concludes consultation
        end_resp = await ac.post(f"/api/v1/consultations/{appt_id}/end", headers=headers_doc)
        assert end_resp.status_code == 200

        # 9. SECURITY VERIFICATION 4: DPDP Act 2023 Statutory Audit Logging
        # Verify that immutable audit entries exist in database for the completed actions
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(AuditLog))
            logs = result.scalars().all()
            assert len(logs) >= 2
            actions = [l.action for l in logs]
            assert "CONSULTATION_START" in actions
            assert "CONSULTATION_CONCLUDED" in actions

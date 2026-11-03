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
async def test_otp_flow_and_patient_registration():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        test_phone = "+919999988888"

        # 1. Request OTP
        send_resp = await ac.post("/api/v1/auth/otp/send", json={"phone": test_phone})
        assert send_resp.status_code == 200
        send_data = send_resp.json()
        assert send_data["success"] is True
        assert send_data["cooldown_seconds"] == 60

        # 2. Cooldown check - rapid second request should fail
        cooldown_resp = await ac.post("/api/v1/auth/otp/send", json={"phone": test_phone})
        assert cooldown_resp.status_code in [400, 401]
        err_json = cooldown_resp.json()
        err_msg = err_json.get("detail") or err_json.get("message") or err_json.get("error", {}).get("message", "")
        assert "Please wait" in err_msg

        # 3. Verify OTP and auto-provision patient
        verify_resp = await ac.post("/api/v1/auth/otp/verify", json={
            "phone": test_phone,
            "otp": "123456",
            "full_name": "Test Patient User"
        })
        assert verify_resp.status_code == 200
        verify_data = verify_resp.json()
        assert "access_token" in verify_data
        token = verify_data["access_token"]
        assert verify_data["user"]["mobile_number"] == test_phone
        assert verify_data["user"]["role"] in ["PATIENT", "patient"]
        assert verify_data["user"]["patient_id"] is not None

        # 4. Access /me endpoint with Bearer Token
        headers = {"Authorization": f"Bearer {token}"}
        me_resp = await ac.get("/api/v1/auth/me", headers=headers)
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["mobile_number"] == test_phone
        assert me_data["role"] in ["PATIENT", "patient"]

@pytest.mark.asyncio
async def test_doctor_login_with_mfa():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Attempt login without TOTP (should prompt for MFA precondition)
        login_no_mfa = await ac.post("/api/v1/auth/login", json={
            "username_or_email": "dr.priya.sharma@apollo.kaizentrix.local",
            "password": "DoctorPass@2025!"
        })
        assert login_no_mfa.status_code == 428

        # 2. Successful Doctor Login with MFA
        login_resp = await ac.post("/api/v1/auth/login", json={
            "username_or_email": "dr.priya.sharma@apollo.kaizentrix.local",
            "password": "DoctorPass@2025!",
            "totp_code": "123456"
        })
        assert login_resp.status_code == 200
        data = login_resp.json()
        assert "access_token" in data
        assert data["user"]["role"] in ["DOCTOR", "doctor"]
        assert data["user"]["doctor_id"] is not None

        token = data["access_token"]
        me_resp = await ac.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_resp.status_code == 200
        assert "Dr. Priya Sharma" in me_resp.json()["full_name"]

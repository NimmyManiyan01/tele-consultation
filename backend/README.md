# KGS Teleconsultation Platform — Backend API Service

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0_Async-red)](https://docs.sqlalchemy.org)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-blue)](https://alembic.sqlalchemy.org)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2.9-E92063)](https://docs.pydantic.dev)

The high-performance asynchronous API engine powering the Kaizentrix Global Solutions (KGS) healthcare teleconsultation ecosystem.

---

## 🏛️ Architecture & Tech Stack

- **Python Runtime:** Python 3.12+
- **Framework:** FastAPI 0.115.0 with Uvicorn ASGI server
- **Persistence:** SQLAlchemy 2.0.36 Async ORM with Declarative mapping
- **Database Drivers:** `aiosqlite` (local development / testing) and `asyncpg` (production PostgreSQL 16)
- **Migrations:** Alembic 1.20+ with asynchronous engine support
- **Data Validation:** Pydantic v2.9 with Pydantic Settings
- **Security:** OAuth2 password bearer tokens, Bcrypt password hashing (12 rounds), PyOTP for TOTP MFA, constant-time JWT signature verification
- **WebRTC Engine:** LiveKit server integration with signed participant VideoGrant JWTs

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── api/v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py              # Phone OTP, login, MFA, and user profile
│   │   │   ├── doctors.py           # Doctor discovery, multi-filter search, credentials
│   │   │   ├── appointments.py      # Slot locking, booking confirmation, cancellation
│   │   │   ├── consultations.py     # LiveKit room token minting, SOAP notes, encounter end
│   │   │   ├── prescriptions.py     # Digital prescription issuance, Schedule X intercept, QR URL
│   │   │   ├── payments.py          # Razorpay order generation, verification, Section 194J payouts
│   │   │   ├── abdm.py              # ABHA OTP request/verify, consent exchange
│   │   │   ├── pharmacy.py          # E-pharmacy catalog and Schedule H verification
│   │   │   ├── diagnostics.py       # Diagnostic lab packages and home phlebotomy
│   │   │   ├── spoke.py             # Rural CHO hub-and-spoke triage cases
│   │   │   └── health.py            # Liveness, readiness, and database health probes
│   │   └── router.py                # Aggregated API v1 router
│   ├── auth/                        # Security dependencies, OTP rate limiting, password hashing
│   ├── models/                      # 19 SQLAlchemy 2.0 ORM models across core, clinical, finance
│   ├── schemas/                     # Pydantic v2 request/response schemas
│   ├── services/                    # Audit logging service
│   ├── config.py                    # Pydantic Settings reading from .env
│   ├── database.py                  # Async engine, sessionmaker, and get_db dependency
│   ├── logging.py                   # Structured JSON logging and correlation tracking
│   ├── main.py                      # FastAPI application entry point with CORS & middlewares
│   └── seeds.py                     # Deterministic demo database seeder
├── migrations/                      # Alembic migration revisions
│   ├── versions/                    # Versioned schema migration scripts
│   └── env.py                       # Async migration runner connected to Base.metadata
├── tests/                           # 14 Pytest async integration and security test suites
├── alembic.ini                      # Alembic configuration
├── Dockerfile                       # Multi-stage non-root container definition
├── docker-compose.yml               # Local stack (FastAPI + PostgreSQL + Redis)
├── pytest.ini                       # Test configuration with asyncio auto mode
└── requirements.txt                 # Dependency manifest
```

---

## 🚀 Local Installation & Execution

### 1. Configure Virtual Environment & Dependencies
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Key settings in `.env`:
- `DATABASE_URL`: `sqlite+aiosqlite:///./kaizentrix.db` (or PostgreSQL connection string)
- `SECRET_KEY`: Cryptographic signing secret
- `CORS_ORIGINS`: Allowed frontend origins

### 3. Launch Development Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`

---

## 🗄️ Database Operations & Alembic Migrations

### Check Migration Status:
```bash
alembic current
alembic check
```

### Apply Migrations (Upgrade to Head):
```bash
alembic upgrade head
```

### Re-seed Synthetic Demo Database:
```bash
python -c "import asyncio; from app.seeds import seed_database; asyncio.run(seed_database())"
```

---

## 🧪 Automated Testing

The backend includes a comprehensive suite of 14 async integration and security tests covering authentication, clinical workflows, slot concurrency locks, BOLA authorization, financial calculations, and ABDM exchanges.

```bash
# Run full suite:
pytest tests -v

# Run security controls specifically:
pytest tests/test_security_controls.py -v
```
**Current Test Status: 14/14 Passed (100% pass rate in ~15 seconds).**


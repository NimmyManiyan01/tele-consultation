# Kaizentrix Global Solutions (KGS) — Enterprise Teleconsultation Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0_Async-red)](https://docs.sqlalchemy.org)
[![Alembic](https://img.shields.io/badge/Alembic-Migrations-blue)](https://alembic.sqlalchemy.org)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16_Staging_Ready-336791?logo=postgresql)](docker-compose.staging.yml)
[![Playwright E2E](https://img.shields.io/badge/Playwright-13%2F13_Passed-success)](web/e2e/)
[![MoHFW 2020](https://img.shields.io/badge/Compliance-MoHFW_2020-blue)](https://www.mohfw.gov.in)
[![ABDM Ready](https://img.shields.io/badge/ABDM-M1--M3_Ready-green)](https://abdm.gov.in)
[![Backend Tests](https://img.shields.io/badge/Pytest-14%2F14_Passed-success)](backend/tests/)
[![Feature Parity](https://img.shields.io/badge/Parity-84.3%20%2F%20100-brightgreen)](replica/parity.md)

An enterprise-grade, high-concurrency teleconsultation and health operations platform engineered for Indian statutory compliance (MoHFW Telemedicine Practice Guidelines 2020, DPDP Act 2023, Ayushman Bharat Digital Mission) with international multi-tenant readiness.

---

## 🏛️ System Architecture & Directory Map

```
c:\Users\Admin\Desktop\tele-consultation market analysis\
├── backend/                       # FastAPI Asynchronous RESTful Engine (Python 3.12+)
│   ├── app/                       # Endpoints (36 routes), Models (19 tables), Schemas, Auth
│   ├── migrations/                # Alembic async database migration revisions
│   ├── tests/                     # 14/14 passing async integration & security tests
│   ├── Dockerfile                 # Multi-stage Python 3.12 container
│   ├── docker-compose.yml         # Local orchestration (API + PostgreSQL + Redis)
│   └── requirements.txt           # Python dependency manifest
│
├── web/                           # Next.js 15 App Router Frontend (React 19 + Tailwind CSS)
│   ├── src/app/                   # 27 responsive healthcare routes (Patient, Doctor, Clinic, CHO)
│   ├── src/components/            # UI components and layout shells
│   ├── src/data/mock-store.ts     # Resilient local fallback mock store
│   ├── src/lib/api-client.ts      # Unified typed API client with JWT bearer interceptors
│   ├── e2e/                       # Playwright end-to-end verification suites
│   └── package.json               # Next.js dependencies and build scripts
│
├── design-system/                 # Clinical Trust Design System
│   ├── tokens.json                # Canonical design token dictionary
│   ├── globals.css                # CSS custom properties with WCAG AA compliance
│   ├── tailwind.config.ts         # Tailwind color and typography preset
│   └── kaizentrix_design_system.md# Full design system specification
│
├── brand/                         # Official Corporate Brand Assets
│   └── KGS_Company_LOGO.jpg       # Master Kaizentrix Global Solutions corporate logo
│
├── replica/                       # Source-of-Truth Replica Governance
│   ├── features.csv               # 49-feature canonical tracking matrix
│   ├── parity.md                  # Reconciled feature parity score: 84.3 / 100
│   ├── bugs.md                    # Defect tracking log (13 found, 13 resolved)
│   ├── build-log.md               # Chronological development log
│   ├── frontend-blueprint.md      # Screen-by-screen UX specifications
│   ├── recon.md                   # Competitive intelligence research
│   └── test-plan.md               # Master verification plan
│
├── .gitignore                     # Production Git ignore rules
└── .env.example                   # Master environment template
```

---

## 🚀 5-Minute Local Quickstart

### Prerequisites
- **Node.js 20+** and `npm`
- **Python 3.12+** and `pip`
- Docker & Docker Compose (optional for local PostgreSQL/Redis)

### 1. Configure Environment Files
```bash
# Copy sanitized templates
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local
```

### 2. Start Backend API Server
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger API documentation will be available at: **`http://localhost:8000/docs`**

### 3. Start Frontend Web Portal
```bash
cd web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to access the live teleconsultation portal.

### 4. Full Staging Orchestration (Docker Compose)
To launch the complete staging environment with PostgreSQL 16, Redis 7, FastAPI Backend, and Next.js Web:
```bash
docker-compose -f docker-compose.staging.yml up -d
```

---

## 🧪 Verified Automated Testing Commands

### Backend Test Suite (14 of 14 Passed):
```bash
# From repository root:
$env:PYTHONPATH="backend"; pytest backend/tests -v

# Or from inside backend directory:
cd backend
pytest tests -v
```

### Playwright End-to-End Headless Browser Suite (13 of 13 Passed):
```bash
cd web
npx playwright test --reporter=list
```

### Live Concurrent Integration Engine (FastAPI + Next.js + Playwright + 12 API Flows):
```bash
python scratch/run_live_e2e_integration.py
```

### Frontend Production Build (27 of 27 Routes Clean):
```bash
cd web
npm run build
```

### Frontend Production Route Probe Runner (27 Routes, 0 Failures):
```bash
cd web
node e2e/runner.js
```

### Feature Parity Verification:
```bash
python -c "
import csv
with open('replica/features.csv', 'r') as f:
    rows = list(csv.DictReader(f))
must = [r for r in rows if r['priority'].strip().lower() == 'must']
must_done = [r for r in must if r['clone'].strip().lower() == 'yes']
print(f'Must-Haves Completed: {len(must_done)} of {len(must)} ({len(must_done)/len(must)*100:.1f}%)')
"
```

---

## 📜 Regulatory & Clinical Compliance
- **MoHFW Telemedicine Guidelines 2020:** RMP Medical Council validation, Prohibited Schedule X drug intercepts, SHA-256 digital signature hashes on e-prescriptions with verification QR links.
- **DPDP Act 2023:** Explicit patient consent collection, purpose specification, family dependent access control, tamper-evident audit logging.
- **Income Tax Act Section 194J:** Automated 10% TDS withholding and 15% platform commission settlement ledger for consulting physicians.
- **ABDM Milestones 1–3 Ready:** ABHA number generation, FHIR R4 clinical bundles, and Consent Manager (`sbx-cm`) integration.

---

## 📄 License & Proprietary Rights
Copyright © 2024–2026 Kaizentrix Global Solutions (KGS). All rights reserved. Commercial enterprise healthcare proprietary software.


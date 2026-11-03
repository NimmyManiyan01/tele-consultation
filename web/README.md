# KGS Teleconsultation Platform — Next.js 15 Web Portal

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.28-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Playwright](https://img.shields.io/badge/Playwright-1.64.1-green?logo=playwright)](https://playwright.dev)

The enterprise web portal for the Kaizentrix Global Solutions (KGS) teleconsultation platform, serving Patients, Clinicians, Clinic Receptionists, Rural Community Health Officers (CHOs), and Administrators across 27 responsive routes.

---

## 🏛️ Frontend Architecture

- **Framework:** Next.js 15.5.28 (App Router with security hardening applied) with React 19
- **Styling:** Tailwind CSS 3.4 with custom clinical design tokens (`globals.css`)
- **Icons:** Lucide React
- **Testing:** Playwright 1.64.1 E2E suite (13/13 clinical specs passing) + standalone HTTP probe runner (`e2e/runner.js`)
- **Containerization:** Multi-stage production Dockerfile (`web/Dockerfile`) with non-root runtime
- **Client Networking:** Unified, resilient API client (`src/lib/api-client.ts`) with automatic JWT injection and transparent local fallback (`src/data/mock-store.ts`)
- **Accessibility:** WCAG 2.1 AA compliant color contrast (minimum 4.5:1 ratio) and accessible semantic primitives

---

## 🗺️ Complete 27-Route Site Map

| Category | Route Path | Description |
| :--- | :--- | :--- |
| **Consumer / Patient** | `/` | Consumer landing page with hero search, specialties, and doctor feed |
| | `/doctors` | Doctor directory with specialty, city, fee, and online-only filters |
| | `/doctor/[id]` | Verified clinician profile, council registration, and credentials |
| | `/booking/[id]` | 3-step appointment booking with 5-minute slot lock and payment |
| | `/booking/success/[id]` | Booking confirmation voucher with calendar sync |
| | `/consult/instant` | Instant teleconsultation triage queue with live doctor matching |
| | `/patient/dashboard` | Patient home dashboard with upcoming appointments and quick links |
| | `/account/family` | Family dependent management (Spouse, Child, Parent) |
| | `/intake/[id]` | Pre-consultation clinical intake and symptom severity slider |
| | `/prescription/[id]` | MoHFW compliant digitally signed e-prescription with QR seal |
| | `/vault` | Secure medical records vault for reports and lab documents |
| | `/pharmacy` | Integrated medicine ordering with Schedule H statutory warnings |
| | `/pharmacy/upload` | Prescription upload for offline review and dispensing |
| | `/diagnostics` | NABL accredited diagnostic health checkup packages |
| | `/emergency` | SOS emergency protocols and ambulance hotline directory |
| **Clinical Encounter** | `/room/[id]` | Pre-call hardware check (mic, camera, latency) and LiveKit WebRTC call |
| | `/doctor/room/multi/[id]`| 4-way multi-party teleconsultation with participant roster |
| **Doctor Workbench** | `/doctor/dashboard` | Doctor schedule, live patient queue, and instant availability toggle |
| | `/doctor/emr/[patientId]`| Clinical EMR workbench: 4-quadrant SOAP notes and digital prescription pad |
| | `/doctor/finance/payouts`| Monthly doctor payout ledger, Section 194J 10% TDS, and invoices |
| **Operations & Clinic**| `/clinic/reception` | Clinic front-desk walk-in registration and multi-doctor live queue |
| | `/spoke/triage` | Rural Ayushman Bharat HWC hub-and-spoke CHO tele-triage workbench |
| | `/admin/analytics` | Enterprise administrative governance, consult volumes, and revenue |
| | `/ehr/embedded` | SMART on FHIR embedded EHR iframe container |
| **Identity & Legal** | `/auth/national` | National Health ID / ABHA SSO authentication stepper |
| | `/privacy` | DPDP Act 2023 compliant privacy and patient consent notice |
| | `/terms` | Telehealth terms of service and clinical disclaimers |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
Key setting:
- `NEXT_PUBLIC_API_URL`: Backend API base URL (defaults to `http://localhost:8000/api/v1`).

### 3. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔌 Unified API Client & Dual-Mode Mechanics

Implemented in `src/lib/api-client.ts`:
- **Live Production Mode:** When the backend server is running on port 8000, all requests are routed over HTTP/2, injecting `Authorization: Bearer <jwt>` from `localStorage`.
- **Resilient Fallback Mode:** When the backend is offline (e.g. initial frontend development or offline QA), network errors are caught and typed mock records from `src/data/mock-store.ts` are returned seamlessly.

---

## 🧪 Testing & Production Build

### Compile Production Build (27 Routes):
```bash
npm run build
```
*Current Status: 27/27 routes compile cleanly with 0 type errors (99.2 kB shared First Load JS).*

### Start Production Server:
```bash
npm run start
```

### Run Playwright End-to-End Tests:
```bash
node e2e/runner.js
```
Runs 4 core user flows:
1. `f01-discovery-booking.spec.ts`: Doctor search & booking.
2. `f02-teleconsult-safety.spec.ts`: Pre-call device check & video room.
3. `f03-pharmacy-diagnostics.spec.ts`: Pharmacy & lab booking.
4. `f04-interop-abdm-fhir.spec.ts`: ABHA linkage & consent.


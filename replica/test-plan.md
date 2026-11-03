# Test Plan: Kaizentrix Global Solutions (KGS) — Enterprise Teleconsultation Platform

**Build:** Next.js 15.0.0 (Production Verified Baseline)  
**Date:** 2026-11-01  
**Environment:** Local Dev / Seed Data (`web/src/data/mock-store.ts`)  
**Scope:** 28 Production Routes, 9 Core International & Indian Clinical Flows, Statutory Safety Rule Engines (Schedule X, Emergency Intercept, DPDP Act 2023, MoHFW 2020)

---

## 1. Flow Matrix & Test Case Inventory

| Case ID | Flow | Type | Steps | Expected Result | Mode | Result |
|:---:|---|:---:|---|---|:---:|:---:|
| **F01-H1** | Doctor Discovery & Profile | Happy | Open `/doctors`, search "Priya", select "Cardiology", click Dr. Priya Sharma profile | `/doctor/doc-01` opens; shows qualifications, KMC-48291 council badge, reviews tab, and booking button | Automated | **PASS** |
| **F01-H2** | Slot Selection & Confirmation | Happy | Open `/booking/doc-01`, pick tomorrow 4:30 PM slot, select "Self", submit booking | Redirects to `/booking/success/doc-01` with check-in QR code pass and .ics calendar sync button | Automated | **PASS** |
| **F01-E1** | Waitlist Slot Pull-Forward | Edge | In `/booking/doc-01`, toggle "Pull-forward if earlier slot cancels (Avancer RDV)" | Toggle activates state, stores waitlist preference, and provides clear user notification | Automated | **PASS** |
| **F01-E2** | Dependent Profile Booking | Edge | In `/booking/doc-01`, switch patient to "Mother (Sunita Varma, 62y)" | Price and clinical intake context update to dependent with age-appropriate flags | Automated | **PASS** |
| **F01-N1** | Emergency Keyword Intercept | Negative | In search bar on `/`, type "Severe crushing chest pain" | Triggers `EmergencyTakeoverModal`, locks search submit, directs patient to 112 hotline | Automated | **PASS** |
| **F02-H1** | Instant Acute Care Matching | Happy | Open `/consult/instant`, enter fever symptoms, select adult, start match | Matching pulse displays; <15m SLA counter activates; doctor assigned card appears | Automated | **PASS** |
| **F02-N1** | Acute Symptom Hard Abort | Negative | In `/consult/instant`, select "Sudden loss of speech / numbness" | Hard abort modal intercepts workflow; redirects to `/emergency` with ER hotline | Automated | **PASS** |
| **F03-H1** | Scheduled WebRTC Room Call | Happy | Open `/room/tele-demo-01`, complete pre-flight mic/cam check, enter video room | 16:9 remote video renders, local PiP renders, floating control bar active, audio status green | Automated | **PASS** |
| **F03-E1** | In-Call Hardware Mute & Video Off | Edge | In `/room/tele-demo-01`, click Mic Mute and Video Off buttons | Audio indicator switches to muted red, camera turns off, video status badge updates | Automated | **PASS** |
| **F03-E2** | Slide-out Clinical Chat | Edge | In `/room/tele-demo-01`, click chat button, type "Blood pressure reading 130/85", send | In-call chat drawer opens; message appears in encrypted stream without video stutter | Automated | **PASS** |
| **F04-H1** | Multi-Party Call & Interpreter | Happy | Open `/doctor/room/multi/tele-demo-01`, select "Hindi <-> English" language pair | 4-way grid displays (Doctor, Patient, Family, Interpreter); simultaneous audio routing active | Automated | **PASS** |
| **F04-E1** | Guest Family Link Generation | Edge | In `/doctor/room/multi/tele-demo-01`, click "Invite Family Link" | Cryptographic tokenized guest pass URL copied to clipboard; badge confirms "Link Copied!" | Automated | **PASS** |
| **F05-H1** | EMR SOAP Charting & Prescription | Happy | Open `/doctor/emr/pat-01`, apply "Hypertension" macro, enter 4-digit PIN, sign Rx | SOAP quadrants populate; ICD-10 I10 code attaches; digital signature SHA-256 seal issued | Automated | **PASS** |
| **F05-N1** | MoHFW Schedule X Intercept | Negative | In `/doctor/emr/pat-01`, type "Morphine" or "Clonazepam" into medicine search | ScheduleXModal intercepts with statutory warning; blocks banned narcotic drug addition | Automated | **PASS** |
| **F06-H1** | Digital Prescription Verification | Happy | Open `/prescription/rx-2026-001`, verify clinic letterhead and doctor seal | QR code links to tamper-proof verification URL; formatted print view ready | Automated | **PASS** |
| **F07-H1** | ABDM National Health ID (ABHA) | Happy | Open `/auth/national`, enter 14-digit ABHA ID, enter 6-digit Aadhaar OTP | Verifies with NHA gateway; displays ABDM verified badge, ABHA address, and HIP links | Automated | **PASS** |
| **F07-E1** | Health Facility Consent Toggle | Edge | In `/auth/national`, toggle "AIIMS New Delhi Digital OPD" consent switch | Consent switch state updates from "Paused" to "Linked" with real-time feedback | Automated | **PASS** |
| **F08-H1** | E-Pharmacy Catalog & Cart | Happy | Open `/pharmacy`, search "Telma 40", add 2 strips to cart, open cart drawer | Cart drawer slides out, subtotal calculates (₹368), Schedule H prescription notice displayed | Automated | **PASS** |
| **F08-H2** | Prescription Verification Gate | Happy | Open `/pharmacy/upload`, select vault prescription `doc-vault-01`, choose UPI, submit | OCR extracts Dr. Priya Sharma credentials; Pharmacist Review SLA initiates; order placed | Automated | **PASS** |
| **F09-H1** | At-Home Diagnostics Scheduling | Happy | Open `/diagnostics`, select "Comprehensive Active Health Shield", book home visit | Booking modal opens; fasting hours (10h) confirmed; morning slot selected; vault sync linked | Automated | **PASS** |
| **F10-H1** | Rural Assisted Spoke Telemedicine | Happy | Open `/spoke/triage`, click "Sync Bluetooth Sensors", click "Dispensary Voucher" | Simulated Bluetooth BP/Glucometer populates vitals; free NHM essential drug slip generated | Automated | **PASS** |
| **F11-H1** | SMART-on-FHIR Embedded Hospital | Happy | Open `/ehr/embedded`, verify CDS Hooks card, click "Commit SOAP Note to EHR" | Epic/Cerner container loads; FHIR patient ribbon verified; FHIR R4 Bundle commit confirmed | Automated | **PASS** |
| **F12-H1** | Provider Earnings & TDS Withholding | Happy | Open `/doctor/finance/payouts`, inspect settlement batch `SETTL-2026-10-31` | Gross consult fees (₹35,700), Sec 194J 10% TDS (-₹3,570), Net (₹26,775) matches ledger | Automated | **PASS** |
| **F13-H1** | Statutory Legal & Emergency Triad | Happy | Open `/emergency`, click 112 card; open `/privacy`, verify DPDP Central India residency | Direct telephone dialer triggers; sovereign data residency disclosures conform to law | Automated | **PASS** |

---

## 2. Automated E2E Execution Strategy

- **Test Suite Location:** [`web/e2e/`](file:///c:/Users/Admin/Desktop/tele-consultation%20market%20analysis/web/e2e/)
- **Core Automation Suites:**
  1. `e2e/f01-discovery-booking.spec.ts`: Doctor search, filter by specialty, slot locking, and confirmation.
  2. `e2e/f02-teleconsult-safety.spec.ts`: Pre-flight diagnostics, WebRTC room controls, Schedule X narcotic modal intercept, and Emergency 112 hard abort.
  3. `e2e/f03-pharmacy-diagnostics.spec.ts`: E-Pharmacy cart with Schedule H check, prescription OCR verification, and diagnostic home collection booking.
  4. `e2e/f04-interop-abdm-fhir.spec.ts`: ABHA M1 Aadhaar OTP federation, SMART-on-FHIR embedded launch, and rural spoke Bluetooth triage.

---

## 3. Accessibility & Security Scan Rules (WCAG 2.2 AA)

- Zero console errors tolerated during test runs.
- Touch target minimum $\ge 44\text{px} \times 44\text{px}$.
- Color contrast ratio $\ge 4.5:1$ for regular text and $\ge 3:1$ for interactive icons/borders.
- Visible focus rings (`ring-2 ring-primary`) on all interactive buttons and inputs.
- Clean ARIA dialog roles (`role="dialog"`, `aria-modal="true"`) for emergency, vitals, and Schedule X modal overlays.


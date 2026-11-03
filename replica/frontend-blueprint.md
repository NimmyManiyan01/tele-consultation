# Kaizentrix Enterprise Teleconsultation Platform
# Master Frontend UI, Screen & Interaction Specification (Implementation-Ready Blueprint)

**Document Reference:** KGS-ETP-FRONTEND-SPEC-V1.0  
**Status:** IMPLEMENTATION-READY (Audit Complete — Awaiting Final Phase 3 Authorization)  
**Governing Standard:** WCAG 2.2 Level AA • Next.js 15 App Router • Tailwind CSS • Shadcn UI • DTCG Tokens  
**Date:** October 2026 Baseline  

---

## 1. Source-of-Truth Reconciliation & Requirements Classification

Every capability identified across the BRD, India Replica Recon, International Recon, Architecture Blueprint, and Design System has been audited and classified into seven mutually exclusive governance buckets:

| Requirement / Capability ID | Domain / Scope | Source Document | Governance Classification | MVP Inclusion Status |
|---|---|---|---|:---:|
| **TRM-REQ-001** | Phone SMS OTP Login & OIDC | BRD Sec 3.1 & Blueprint Sec 18 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-002** | Mandatory Workforce TOTP MFA | BRD Sec 8 & Blueprint Sec 19 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-003** | Versioned Legal Consent Capture | BRD Sec 9 & Blueprint Sec 19 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-004** | Provider Discovery & Multi-Filter | BRD Sec 3.1 & Blueprint Sec 18 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-005** | Real-Time Slot Locking (10m) | BRD Sec 3.1 & Blueprint Sec 17 | Approved architecture requirement | **India MVP (Must)** |
| **TRM-REQ-006** | Appointment Rescheduling & Cancel | BRD Sec 3.1 & Blueprint Sec 16 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-007** | Managed WebRTC Video (LiveKit SFU) | BRD Sec 3.1 & Blueprint Sec 14 | Approved architecture requirement | **India MVP (Must)** |
| **TRM-REQ-008** | Virtual Waiting Room & Device Test | BRD Sec 3.1 & Blueprint Sec 16 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-009** | Low-Bandwidth Adaptive Audio Fallback| BRD Sec 3.1 & Blueprint Sec 16 | Approved architecture requirement | **India MVP (Must)** |
| **TRM-REQ-010** | Pre-Consult Intake Questionnaire | BRD Sec 3.1 & Blueprint Sec 16 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-011** | Structured SOAP Notes & Summary | BRD Sec 3.1 & Blueprint Sec 16 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-012** | Legally Signed e-Prescription PDF | BRD Sec 3.1 & Blueprint Sec 19 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-013** | Encrypted Document Vault & Scan | BRD Sec 3.1 & Blueprint Sec 8 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-014** | Multi-Channel Notifications (No PHI)| BRD Sec 3.1 & Blueprint Sec 16 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-015** | Tokenized Payment & Auto-Refund | BRD Sec 3.1 & Blueprint Sec 18 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-016** | Clinic Admin Provider & Roster Tool | BRD Sec 3.1 & Blueprint Sec 13 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-017** | Contextual Relationship-Based Access | BRD Sec 8 & Blueprint Sec 19 | Approved architecture requirement | **India MVP (Must)** |
| **TRM-REQ-018** | Immutable Tamper-Resistant Audit Log| BRD Sec 8 & Blueprint Sec 19 | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-REQ-019** | Disaster Recovery RTO < 1h / RPO < 5m| BRD Sec 12 & Blueprint Sec 20 | Approved architecture requirement | **India MVP (Must)** |
| **TRM-REQ-020** | Full WCAG 2.2 Level AA Compliance | BRD Sec 11 & Design System | Explicitly required by the BRD | **India MVP (Must)** |
| **TRM-GAP-001** | Family & Dependent Profile Manager | Recon (Practo/Apollo) & Blueprint| Identified in approved Replica Recon | **India MVP (Critical)** |
| **TRM-GAP-002** | MoHFW Schedule X Drug Restriction | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (Critical)** |
| **TRM-GAP-003** | RMP Council Badging & Verification | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (Critical)** |
| **TRM-GAP-004** | Emergency Red Alert Hard Abort | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (Critical)** |
| **TRM-GAP-005** | WhatsApp Business API Notifications | Recon & Blueprint Sec 11 | Recommended industry enhancement | **India MVP (Critical)** |
| **TRM-GAP-006** | DPDP Act 2023 Consent Manager | Recon & Blueprint Sec 11 | Approved architecture requirement | **India MVP (Critical)** |
| **TRM-GAP-007** | In-Call Text Chat, Files & Camera Flip| Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-008** | ICD-10 & SNOMED CT Auto-Suggest | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-009** | 7-Day Free Post-Consult Follow-Up | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-010** | Front Desk / Triage Nurse Console | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-011** | Clinical Macros & Order Set Templates| Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-012** | Doctor Payout Ledger & TDS/GST | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India MVP (High)** |
| **TRM-GAP-013** | ABDM Milestone 1 (ABHA ID Link) | Recon & Blueprint Sec 11 | Approved architecture requirement | **India Post-MVP (Medium)** |
| **TRM-GAP-014** | PostGIS Radius Search & Maps | Recon & Blueprint Sec 11 | Recommended industry enhancement | **India Post-MVP (Medium)** |
| **TRM-GAP-015** | Verified Patient Review Pad & Stars | Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India Post-MVP (Medium)** |
| **TRM-GAP-016** | Instant Acute Teleconsult Pool (<15m)| Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India Post-MVP (Medium)** |
| **TRM-GAP-017** | Standardized Diagnostic Lab Order Slip| Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India Post-MVP (Medium)** |
| **TRM-GAP-018** | Indic Regional Multilingual (Hindi) | Recon & Blueprint Sec 11 | Approved architecture requirement | **India Post-MVP (Medium)** |
| **TRM-GAP-019** | eSanjeevani Rural Hub-and-Spoke Kiosk| Recon & Blueprint Sec 11 | Identified in approved Replica Recon | **India Post-MVP (Low)** |
| **TRM-GAP-020** | Open Webhook Bus for Pharmacy/Lab | Recon & Blueprint Sec 11 | Approved architecture requirement | **India Post-MVP (Low)** |
| **TRM-GAP-021** | Corporate Care Pass / Subscription | Recon & Blueprint Sec 11 | Recommended industry enhancement | **India Post-MVP (Low)** |
| **TRM-INT-001** | Dynamic Cancellation Slot Pull-Forward| Recon (Doctolib) & Blueprint Sec 12| Identified in approved Replica Recon | **India MVP (Backported)** |
| **TRM-INT-002** | Multi-Party Video Room (Caregiver/Guest)| Recon (Amwell) & Blueprint Sec 12 | Identified in approved Replica Recon | **India MVP (Backported)** |
| **TRM-INT-003** | Pre-Call High-Res Photo Triage | Recon (Livi) & Blueprint Sec 12 | Identified in approved Replica Recon | **India MVP (Backported)** |
| **TRM-INT-004** | Corporate Wellness Quota Deduction | Recon (Teladoc) & Blueprint Sec 12| Identified in approved Replica Recon | **India MVP (Backported)** |
| **TRM-INT-005** | SMART on FHIR Embedded EHR Iframe | Recon (Amwell) & Blueprint Sec 12 | Future international capability | **US / Global Expansion** |
| **TRM-INT-006** | ANSI ASC X12 EDI 270/271 Payer Check | Recon (Teladoc) & Blueprint Sec 12| Future international capability | **US Expansion** |
| **TRM-INT-007** | Surescripts / NCPDP SCRIPT e-Rx | Recon (Teladoc) & Blueprint Sec 12| Future international capability | **US Expansion** |
| **TRM-INT-008** | UK NHS GP Connect API Write-Back | Recon (Livi) & Blueprint Sec 12 | Future international capability | **UK Expansion** |
| **TRM-INT-009** | German Gematik e-Rezept & HBA Sign | Recon (Doctolib DE) & Blueprint 12| Future international capability | **EU (Germany) Expansion** |
| **TRM-INT-010** | Multi-State Licensure Geo-Fence | Recon (Teladoc) & Blueprint Sec 12| Future international capability | **US Expansion** |
| **TRM-INT-011** | Regional Cloud Sovereign Isolation | Blueprint Sec 12 & 20 | Approved architecture requirement | **Global Infrastructure** |
| **TRM-INT-012** | On-Demand Medical Interpreter Bridge | Recon (Amwell) & Blueprint Sec 12 | Future international capability | **US / UK Expansion** |
| **TRM-INT-013** | French Mon Espace Santé (DMP) Sync | Recon (Doctolib FR) & Blueprint 12| Future international capability | **EU (France) Expansion** |
| **TRM-INT-014** | Universal Multi-Lexicon Drug Mapper | Blueprint Sec 12 | Approved architecture requirement | **Global Architecture** |
| **TRM-INT-015** | Full RTL & Unicode i18n Engine | Design System & Blueprint Sec 12 | Future international capability | **Global Expansion** |

---

## 2. Complete Page & Internal Page Inventory (42 Pages)

The platform is decomposed into 42 explicit pages across 8 functional modules:

### Module 1: Public, Discovery & Patient Entry
* **PAGE-PUB-01: Global Landing & Discovery (`/`)**
  * *Role:* Public / Anonymous Patient.
  * *Purpose:* Value proposition, primary search entry, instant acute care CTA, ABHA account link banner.
  * *Sections:* (1) Global Top Navigation Bar, (2) Hero Search & Location Bar, (3) Clinical Specialty Grid (12 top categories), (4) Instant Consult Promo Banner, (5) Featured Verified Clinicians Carousel, (6) Patient Assurance & Trust Badges, (7) Corporate Footer.
  * *Components:* `SearchBar`, `LocationPicker`, `SpecialtyCard`, `DoctorCard`, `EmergencyNoticeStrip`, `TrustBadgeGroup`.
  * *Actions:* Search by keyword/specialty, select clinic location, click doctor card, launch instant consultation modal.
  * *APIs:* `GET /api/v1/doctors/featured`, `GET /api/v1/specialties`.
  * *States:* Initial, Geolocation requesting, Geolocation denied, Empty search prompt, Loading skeletons.
  * *A11y:* Search input with accessible label; keyboard tab navigation through specialty tiles; `aria-expanded` on location dropdown.

* **PAGE-PUB-02: Clinician Directory & Multi-Filter Search (`/doctors`)**
  * *Role:* Public / Patient.
  * *Purpose:* Filter clinicians by medical specialty, experience, consultation fee, gender, spoken language, hospital affiliation, and next available slot.
  * *Sections:* (1) Search Header & Breadcrumbs, (2) Filter Sidebar, (3) Sort & View Switcher (List vs Map), (4) Clinician Results Feed, (5) Pagination / Infinite Scroll Trigger.
  * *Components:* `FilterSidebar`, `DoctorListItem`, `Badge` (Verified, Next Available), `RatingStars`, `SlotQuickPicker`, `PaginationControls`.
  * *Actions:* Toggle filters, clear all filters, sort by price/rating, click "Book Clinic Visit", click "Book Video Consult".
  * *APIs:* `GET /api/v1/doctors/search`.
  * *States:* Loading skeleton list, 0 results empty state with reset suggestion, Filter applied state, Network retry banner.

* **PAGE-PUB-03: Clinician Public Profile & Credentials (`/doctor/[id]`)**
  * *Role:* Public / Patient.
  * *Purpose:* Transparent display of doctor credentials, council registration number, degrees, clinical bio, fee schedule, accepted clinic locations, patient stories.
  * *Sections:* (1) Doctor Hero Header (Photo, Name, Verified Badge, Council Reg ID, Overall Rating), (2) Clinical Experience & Education, (3) Clinic Locations & Working Hours, (4) In-Clinic vs Video Consultation Pricing Cards, (5) Patient Reviews & Feedback, (6) Mobile Sticky Booking Action Bar.
  * *Components:* `DoctorHeroCard`, `CouncilBadge`, `CredentialList`, `ReviewCard`, `ReviewRatingDistribution`, `StickyActionBar`.
  * *Actions:* Select consultation mode (Video vs Clinic), open review modal, click "Book Slot".
  * *APIs:* `GET /api/v1/doctors/{id}`, `GET /api/v1/reviews/{id}`.
  * *States:* Profile loading skeleton, Doctor not found (404), Unverified doctor warning banner.

* **PAGE-PUB-04: Static Legal: Privacy Policy & DPDP Notice (`/privacy`)**
  * *Role:* Public.
  * *Purpose:* Statutory transparency under India DPDP Act 2023, data fiduciary obligations, grievance officer contact, consent withdrawal workflow.

* **PAGE-PUB-05: Static Legal: Telemedicine Consent & Terms (`/terms`)**
  * *Role:* Public.
  * *Purpose:* MoHFW Telemedicine Practice Guidelines (2020) consent definitions, clinical boundaries, prescription liability, cancellation/refund terms.

* **PAGE-PUB-06: Emergency Care Redirection & Hospital Finder (`/emergency`)**
  * *Role:* Public / Emergency Patient.
  * *Purpose:* Dedicated clinical emergency redirection page displaying national emergency hotlines (112, 108, 102), nearest physical ER facilities with Google Maps bridge.

---

### Module 2: Authentication & Onboarding
* **PAGE-AUTH-01: Patient Mobile SMS/WhatsApp OTP Sign-In (`/auth/login`)**
  * *Role:* Unauthenticated Patient / Caregiver.
  * *Purpose:* Frictionless phone-based passwordless authentication with 6-digit OTP and WhatsApp fallback.
  * *Sections:* (1) Brand Header, (2) Phone Input Card with +91 Prefix, (3) 6-Digit OTP Keypad with 60s Resend Timer, (4) DPDP Privacy Consent Checkbox, (5) Alternative Login Options (ABHA / Email).
  * *Components:* `PhoneInput`, `OtpKeypad`, `CountdownTimer`, `Checkbox` (Consent), `Button` (Verify).
  * *Actions:* Input phone, submit for OTP, enter 6-digit code, request WhatsApp OTP fallback, submit consent.
  * *APIs:* `POST /api/v1/auth/otp/send`, `POST /api/v1/auth/otp/verify`.
  * *States:* Phone entry, OTP dispatched, Verification loading, Invalid OTP error shake, Rate limit locked (10m).

* **PAGE-AUTH-02: National Health ID (ABHA) Login & Link Gateway (`/auth/national`)**
  * *Role:* Patient.
  * *Purpose:* Authenticate using Ayushman Bharat Health Account (ABHA) 14-digit number or ABHA address via NHA gateway.
  * *Sections:* (1) ABHA Info Banner, (2) ABHA Number / Address Input, (3) Aadhaar OTP Verification Card, (4) Consent Grant Accordion.
  * *APIs:* `POST /api/v1/auth/abha/otp`, `POST /api/v1/auth/abha/verify`.

* **PAGE-AUTH-03: Workforce (Doctor/Staff/Admin) Entra CIAM Sign-In (`/auth/workforce`)**
  * *Role:* Clinician, Front Desk, Clinic Admin, SecOps.
  * *Purpose:* Enterprise corporate authentication with email/password and mandatory TOTP MFA.
  * *Sections:* (1) KGS Enterprise Login Card, (2) Corporate Email & Password Fields, (3) TOTP Authenticator Keypad, (4) Account Recovery Bridge.
  * *APIs:* `POST /api/v1/auth/workforce/login`, `POST /api/v1/auth/workforce/mfa`.

* **PAGE-AUTH-04: Patient Onboarding & Profile Setup (`/auth/onboarding`)**
  * *Role:* Newly registered Patient.
  * *Purpose:* Collect legal name, date of birth, gender, blood group, emergency contact, and communication preferences.

---

### Module 3: Patient Booking & Consultation Lifecycle
* **PAGE-PAT-01: Patient Master Dashboard (`/patient/dashboard`)**
  * *Role:* Patient / Caregiver.
  * *Purpose:* Central cockpit displaying upcoming appointments, active prescription reminders, health vault shortcuts, and family profiles.
  * *Sections:* (1) Greeting & Dependent Switcher, (2) Upcoming Consultation Action Card (Join Pre-Call button when within 15 mins), (3) Past Encounters Carousel, (4) Recent Prescriptions & Lab Slips, (5) Quick Action Pills.
  * *Components:* `AppointmentCard`, `PrescriptionMiniCard`, `DependentSelectorDropdown`, `StatusBadge`.
  * *APIs:* `GET /api/v1/patient/overview`.
  * *States:* Active appointment banner, No appointments empty state, Prescription expiring alert.

* **PAGE-PAT-02: Appointment Slot Booking (`/booking/[doctorId]`)**
  * *Role:* Patient.
  * *Purpose:* Select date, available time slot, consultation type (Video vs In-Clinic), and target patient (self vs family member).
  * *Sections:* (1) Selected Clinician Summary Card, (2) Dependent Picker (Who is this consultation for?), (3) 7-Day Date Carousel, (4) Slot Time Grid (Morning / Afternoon / Evening chips), (5) Dynamic Slot Pull-Forward Waitlist Opt-In Toggle, (6) Price Breakdown Card.
  * *Components:* `DoctorMiniSummary`, `DependentRadioGroup`, `DateCarouselRibbon`, `SlotChip`, `Switch` (Waitlist Opt-In), `PriceBreakdown`.
  * *Actions:* Select dependent, click date, click slot chip, acquire 10-minute hold, navigate to checkout.
  * *APIs:* `GET /api/v1/doctors/{id}/slots`, `POST /api/v1/appointments/lock-slot`.
  * *States:* Slot loading, Slot already booked error, Hold timer active (9:59 countdown), Session expired.

* **PAGE-PAT-03: Payment Checkout & Benefit Redemption (`/checkout/[appointmentId]`)**
  * *Role:* Patient.
  * *Purpose:* Pay consultation fee, apply corporate health plan / coupon, select payment method (UPI, Card, NetBanking).
  * *Sections:* (1) Appointment Summary & 10-Min Hold Countdown, (2) Corporate Wellness Benefit Code Input, (3) Bill Details (Base fee, Platform fee, GST, Total), (4) Razorpay/Stripe Hosted Element Container, (5) Refund Policy Disclaimer.
  * *APIs:* `POST /api/v1/payments/create-order`, `POST /api/v1/payments/verify`.

* **PAGE-PAT-04: Booking Confirmation Voucher (`/booking/success/[appointmentId]`)**
  * *Role:* Patient.
  * *Purpose:* Verified appointment voucher, appointment ID, calendar add (.ics), pre-call instructions, WhatsApp reminder opt-in.
  * *Sections:* (1) Animated Success Badge, (2) Appointment Details Voucher, (3) Clinician Instructions, (4) Action Group (Add to Google Calendar, Complete Intake Questionnaire, Return to Dashboard).
  * *APIs:* `GET /api/v1/appointments/{id}`.

* **PAGE-PAT-05: Pre-Consultation Clinical Intake Questionnaire (`/intake/[appointmentId]`)**
  * *Role:* Patient / Caregiver.
  * *Purpose:* Capture chief complaint, symptom onset, current medications, drug allergies, and upload past reports/photos.
  * *Sections:* (1) Emergency Warning Disclaimer, (2) Chief Complaint & Symptoms (with Red-Flag clinical keyword evaluator), (3) Current Medications (tokens), (4) Known Drug Allergies, (5) High-Res Photo/Report Attachment Dropzone (with EXIF stripping).
  * *Components:* `RedFlagAlert`, `MultiStepStepper`, `ChipInput`, `DropzoneUpload`, `FileScanProgressBar`.
  * *Actions:* Input symptoms (if "chest pain" or "stroke" detected, triggers `OVERLAY-08: Emergency Takeover Modal`), upload lab PDF/photo, submit intake.
  * *APIs:* `POST /api/v1/appointments/{id}/intake`, `POST /api/v1/documents/upload`.

* **PAGE-PAT-06: Pre-Call Virtual Waiting Room & Device Check (`/room/waiting/[appointmentId]`)**
  * *Role:* Patient.
  * *Purpose:* Test camera, microphone, and speaker; verify network latency; inform patient of queue position while awaiting clinician admittance.
  * *Sections:* (1) Camera Self-View & Audio Volume Meter, (2) Hardware Selectors (Camera/Mic/Speaker dropdowns), (3) Connection Quality Indicator (Ping, Bandwidth), (4) Clinician Admittance Waiting Status ("Dr. Sharma has been notified and will admit you shortly"), (5) Fallback Phone Number Instructions.
  * *Components:* `VideoSelfView`, `AudioLevelMeter`, `DeviceSelectDropdown`, `QueueWaitingCard`.
  * *APIs:* `GET /api/v1/teleconsult/{id}/token`, `WS /api/v1/teleconsult/{id}/waiting-status`.

* **PAGE-PAT-07: Patient Teleconsultation WebRTC Video Room (`/room/[appointmentId]`)**
  * *Role:* Patient.
  * *Purpose:* Live encrypted video encounter with attending clinician.
  * *Sections:* (1) Remote Doctor Video Viewport (Full/Split), (2) Local PiP Window, (3) Floating Bottom In-Call Control Bar, (4) In-Call Clinical Chat Drawer (Right), (5) In-Call Document Upload Tray.
  * *Components:* `LiveKitVideoViewport`, `InCallControlBar` (Mute Mic, Camera Off, Switch Front/Rear Cam, Toggle Chat, End Call), `NetworkQualityPill`, `InCallChatDrawer`.
  * *APIs:* `LiveKit WebRTC Signaling`, `POST /api/v1/teleconsult/{id}/chat`.
  * *States:* Connecting SFU, HD Video Active, Low-Bandwidth Audio-Only Downscale, Doctor Reconnecting, Call Ended.

* **PAGE-PAT-08: Instant Acute Care Teleconsultation Queue (`/consult/instant`)**
  * *Role:* Patient.
  * *Purpose:* Dynamic pooled allocation to next available general physician within 15 minutes.
  * *Sections:* (1) Triage Intake Step, (2) Pooled Doctor Allocation Spinner & Live Position Counter, (3) Estimated Wait SLA Timer, (4) Cancel & Refund CTA.
  * *APIs:* `POST /api/v1/consultations/instant`, `WS /api/v1/consultations/queue`.

* **PAGE-PAT-09: Patient Digital Health Vault / Records (`/vault`)**
  * *Role:* Patient.
  * *Purpose:* Encrypted longitudinal health locker holding past prescriptions, lab reports, discharge summaries, and ABDM sync records.
  * *Sections:* (1) Category Filter Tabs (All, Prescriptions, Lab Reports, Self-Uploaded, ABDM Records), (2) Document Grid / List, (3) Upload New Record Button, (4) Document Preview Modal Container.
  * *APIs:* `GET /api/v1/vault/documents`, `POST /api/v1/vault/documents`.

* **PAGE-PAT-10: Digital Prescription Viewer (`/prescription/[id]`)**
  * *Role:* Patient / Doctor / Pharmacist.
  * *Purpose:* View legally valid digital prescription with clinic letterhead, doctor council registration, digital signature stamp, QR verification code, and one-tap pharmacy routing.
  * *Sections:* (1) Prescription Header (Clinic Logo, Doctor Reg No, Patient Details, Date), (2) Vitals & Clinical Diagnosis (ICD-10/SNOMED CT), (3) Prescribed Medicines Table (Drug, Dose, Frequency, Duration, Instructions), (4) General Advice & Dietary Notes, (5) Doctor Cryptographic Signature Block, (6) QR Code & Verification Watermark, (7) Action Bar (Download PDF, Order Medicines, Share with Caregiver).
  * *APIs:* `GET /api/v1/prescriptions/{id}`.

* **PAGE-PAT-11: Electronic Rx Pharmacy Dispatch Tracker (`/prescription/route/[id]`)**
  * *Role:* Patient.
  * *Purpose:* Track digital prescription transmitted to partner pharmacy networks.

* **PAGE-PAT-12: Family & Dependent Profile Manager (`/account/family`)**
  * *Role:* Patient / Primary Caregiver.
  * *Purpose:* Add, edit, and delete family member profiles (children, elderly parents) to enable booking on their behalf.
  * *Sections:* (1) Family Member Cards Grid, (2) "Add Family Member" Button, (3) Dependent Card (Name, Relationship, DOB, Known Allergies, Pre-existing Conditions, Action Menu).
  * *APIs:* `GET /api/v1/users/dependents`, `POST /api/v1/users/dependents`, `DELETE /api/v1/users/dependents/{id}`.

* **PAGE-PAT-13: Asynchronous 7-Day Follow-Up Chat (`/messages/[encounterId]`)**
  * *Role:* Patient.
  * *Purpose:* Secure query thread with doctor active for 7 days post-encounter for medication questions.
  * *Sections:* (1) Encounter Context Banner with SLA Timer ("Follow-up window closes in 4 days 6 hours"), (2) Message History Stream, (3) Input Bar with Attachment Button, (4) Thread Closed Banner.
  * *APIs:* `GET /api/v1/messages/{id}`, `POST /api/v1/messages/{id}`.

* **PAGE-PAT-14: Patient Verified Review Pad (`/reviews/new/[encounterId]`)**
  * *Role:* Patient.
  * *Purpose:* Rate doctor bedside manner, consultation punctuality, and write qualitative review.

* **PAGE-PAT-15: Patient Account & Security Settings (`/account/settings`)**
  * *Role:* Patient.
  * *Purpose:* Manage phone number, notification preferences (SMS vs WhatsApp), DPDP consent withdrawal, active sessions.

* **PAGE-PAT-16: Patient Appointments History (`/appointments`)**
  * *Role:* Patient.
  * *Purpose:* Paginated list of Upcoming, Completed, and Cancelled appointments with quick rebook and invoice download.

---

### Module 4: Doctor (RMP) Clinical Practice Portal
* **PAGE-DOC-01: Doctor Practice Dashboard & Queue (`/doctor/dashboard`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Daily schedule, live clinic queue, instant consult toggle, today's consultation metrics.
  * *Sections:* (1) Clinician Header with Live Availability Toggle (Online / Offline), (2) Today's Queue Counter (Waiting, In-Consultation, Completed), (3) Live Patient Queue Table, (4) Patient Admittance Action Card, (5) Quick Stats Grid.
  * *Components:* `OnlineStatusToggle`, `QueueTable`, `PatientQueueRow`, `AdmitButton`, `MetricCard`.
  * *APIs:* `GET /api/v1/doctor/appointments/today`, `PUT /api/v1/doctor/status`.

* **PAGE-DOC-02: Doctor Schedule & Roster Configuration (`/doctor/schedule`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Define recurring weekly working hours, slot interval (15/20/30m), emergency leave blocks.
  * *Sections:* (1) Weekly Schedule Grid (Mon–Sun), (2) Shift Time Range Pickers, (3) Slot Duration Selector, (4) Vacation & Unavailability Block Calendar.
  * *APIs:* `GET /api/v1/doctor/schedule`, `PUT /api/v1/doctor/schedule`.

* **PAGE-DOC-03: Doctor Pre-Call Patient Context View (`/doctor/encounter/[id]/intake`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Review patient pre-call intake form, symptoms, reported allergies, and uploaded reports prior to admitting patient to video call.

* **PAGE-DOC-04: Doctor Teleconsultation WebRTC HUD (`/doctor/room/[id]`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Dual-panel teleconsultation interface: live patient video on the left, integrated EMR charting on the right.
  * *Sections:* (1) Video Panel (Patient Stream, Local Doctor PiP, Controls), (2) Patient Context Header (Name, Age, Gender, Known Allergies, Vitals), (3) In-Call Real-Time Charting Tab (SOAP Notes, Quick Prescribe), (4) Past Medical History Drawer.
  * *Components:* `DualPaneLayout`, `VideoViewport`, `InlineSOAPNotes`, `PrescriptionQuickBar`, `EndConsultationDialog`.
  * *APIs:* `LiveKit SFU`, `POST /api/v1/teleconsult/{id}/end`.

* **PAGE-DOC-05: Multi-Party Video Room (`/doctor/room/multi/[id]`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* 4-way consultation room connecting doctor, patient, remote family caregiver, and certified interpreter.
  * *Sections:* (1) 4-Way Video Grid, (2) Participant Management Drawer (Mute, Remove, Audio Channel Switcher), (3) Private Clinician-Specialist Whisper Chat.
  * *APIs:* `POST /api/v1/consultations/{id}/invite`.

* **PAGE-DOC-06: Clinical EMR Charting Console (`/doctor/emr/[patientId]`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Structured clinical encounter charting following SOAP standards: Subjective (History of Presenting Illness), Objective (Physical/Triage Vitals), Assessment (ICD-10/SNOMED CT Diagnosis), Plan (Orders, Advice).
  * *Sections:* (1) Patient Vitals Banner, (2) Subjective Complaint Text Area, (3) Objective Examination Findings, (4) ICD-10 Search Autocomplete Field, (5) Clinical Macros & Order Set Bar (e.g., "Acute URTI", "Type 2 Diabetes Routine"), (6) Save Draft / Commit Encounter Buttons.
  * *APIs:* `GET /api/v1/patients/{id}/emr`, `POST /api/v1/encounters`.

* **PAGE-DOC-07: Digital e-Prescription Authoring & Signing Pad (`/doctor/prescription/new/[encounterId]`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Prescribe medications with automated MoHFW Schedule X narcotics restriction checking, drug-allergy contraindication checks, and digital signature sealing.
  * *Sections:* (1) Patient Demographics & Allergy Warning Strip, (2) Drug Search Field (Generic & Brand names), (3) Dosage Form (Tablet, Syrup, Injection), Strength, Frequency (1-0-1), Duration, Meal Timing (Before/After food), (4) MoHFW Drug Schedule Warning Banner, (5) Non-Pharmacological Advice & Follow-up Date, (6) Digital Signature Authentication Modal (PIN / Certificate).
  * *Components:* `DrugAutocompleteInput`, `DosageMatrixSelect`, `ScheduleXAlert`, `ContraindicationToast`, `DigitalSignatureModal`.
  * *APIs:* `GET /api/v1/drugs/search`, `POST /api/v1/prescriptions/sign`.

* **PAGE-DOC-08: Diagnostic Lab Requisition Order Pad (`/doctor/orders/lab/[encounterId]`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Prescribe pathology/radiology investigations with clinical indications and fasting instructions.

* **PAGE-DOC-09: Doctor Earnings, Payouts & TDS Ledger (`/doctor/finance/payouts`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Monthly earnings breakdown, platform commission deductions, Section 194J TDS deductions, GST receipts, bank payout status.

* **PAGE-DOC-10: Doctor Profile, Council Credentials & Digital Signature (`/doctor/profile`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Upload State Medical Council certificate, set consultation fees, upload digital signature image/token.

* **PAGE-DOC-11: Doctor Asynchronous Messaging Console (`/doctor/messages`)**
  * *Role:* Clinician (RMP).
  * *Purpose:* Inbox of active 7-day post-consultation patient follow-up queries with quick response templates.

---

### Module 5: Clinic Front Desk & Triage Operations
* **PAGE-STAFF-01: Clinic Reception Desk & Live OPD Queue (`/clinic/reception`)**
  * *Role:* Front Desk Receptionist / Triage Nurse.
  * *Purpose:* Manage daily OPD physical and teleconsultation arrival queue, check in arriving patients, monitor waiting room times.
  * *Sections:* (1) Clinic Status Header (Doctors on Duty), (2) Queue Filter (All, Arrived, In-Triage, In-Consultation, Completed), (3) Live Queue Board, (4) "Register Walk-In" Button.
  * *APIs:* `GET /api/v1/clinic/queue`, `PUT /api/v1/clinic/queue/{id}/checkin`.

* **PAGE-STAFF-02: Walk-In Patient Registration (`/clinic/patients/register`)**
  * *Role:* Front Desk Receptionist.
  * *Purpose:* Rapid registration of walk-in patients, capturing phone number, demographic details, and assigning appointment slot.

* **PAGE-STAFF-03: Triage Vitals Capture Modal/Screen (`/clinic/triage/[patientId]`)**
  * *Role:* Triage Nurse.
  * *Purpose:* Record preliminary physical vitals before clinician consult: Blood Pressure (Systolic/Diastolic mmHg), Pulse (bpm), SpO2 (%), Temperature (°F), Random Blood Sugar (mg/dL), Body Weight (kg), Height (cm), BMI auto-calculation.
  * *Components:* `VitalsInputGrid`, `AbnormalVitalFlagBadge`, `SaveTriageButton`.
  * *APIs:* `POST /api/v1/clinic/triage`.

* **PAGE-STAFF-04: Cash Desk Billing & Offline Invoicing (`/clinic/billing`)**
  * *Role:* Front Desk Cashier.
  * *Purpose:* Collect offline cash or POS card payments for in-clinic visits, print thermal receipt with GST breakdown.

---

### Module 6: Rural Assisted Telehealth (eSanjeevani CHO / Spoke)
* **PAGE-HWC-01: Health & Wellness Centre Frontline Worker Console (`/hwc/dashboard`)**
  * *Role:* Community Health Officer (CHO) / Rural Health Worker.
  * *Purpose:* Frontline rural health screening at Ayushman Bharat Health & Wellness Centre (Spoke), managing citizen queue.
  * *Sections:* (1) Village Centre Header, (2) Citizen Screening Queue, (3) Low-Bandwidth Mode Indicator, (4) State Medical College Hub Selector.
  * *APIs:* `GET /api/v1/hwc/queue`.

* **PAGE-HWC-02: Rural Citizen Triage & Medical Hub Tele-Referral (`/hwc/referral/new`)**
  * *Role:* CHO.
  * *Purpose:* Record rural patient vitals, select clinical specialty, and initiate assisted video consultation bridge to Medical College Hub doctor.

---

### Module 7: Clinic Administrator Portal
* **PAGE-CADM-01: Clinic Operations & Provider Roster Overview (`/admin/clinic`)**
  * *Role:* Clinic Administrator.
  * *Purpose:* Monitor multi-doctor clinic schedules, consultation volumes, daily cancellation rates, room utilization.

* **PAGE-CADM-02: Clinician Onboarding & Credential Verification (`/admin/clinic/providers`)**
  * *Role:* Clinic Administrator.
  * *Purpose:* Onboard new clinicians to clinic roster, verify medical council registration, configure fee share.

* **PAGE-CADM-03: Clinic Operating Hours & Emergency Leave Rules (`/admin/clinic/schedule`)**
  * *Role:* Clinic Administrator.
  * *Purpose:* Set clinic-wide operating shifts, holiday closures, emergency clinician reassignments with automated patient rescheduling.

* **PAGE-CADM-04: Clinic Billing & Financial Reconciliation (`/admin/clinic/billing`)**
  * *Role:* Clinic Administrator.
  * *Purpose:* Clinic revenue reconciliation, payment gateway settlements, merchant fee reports.

---

### Module 8: Platform Administrator & SecOps Portal
* **PAGE-SADM-01: Platform Teleconsultation Surveillance & Analytics (`/admin/analytics`)**
  * *Role:* Platform Administrator.
  * *Purpose:* Real-time national/regional surveillance: active video rooms, drop-off funnels, doctor response times, WebRTC error rates (SLO tracking).
  * *Sections:* (1) Global KPI Grid (Active Calls, Booking Success Rate $\ge 95\%$, Video Join Rate $\ge 98\%$, 99.9% Availability), (2) Real-Time Call Quality Heatmap, (3) Specialty Volume Breakdown, (4) SLA Breach Alert Feed.
  * *APIs:* `GET /api/v1/admin/analytics/overview`.

* **PAGE-SADM-02: User & Workforce Account Governance (`/admin/users`)**
  * *Role:* Platform Administrator.
  * *Purpose:* Manage user accounts, role assignments (RBAC), workforce MFA resets, account lockouts.

* **PAGE-SADM-03: Clinician Medical Council Verification Queue (`/admin/credentialing`)**
  * *Role:* Platform Administrator / Medical Credentialing Officer.
  * *Purpose:* Review uploaded doctor registration certificates against State Medical Council registries before awarding Verified Doctor Badge.

* **PAGE-SADM-04: Patient Review Moderation Queue (`/admin/reviews`)**
  * *Role:* Platform Administrator.
  * *Purpose:* Moderate patient reviews, filter inappropriate language or clinical defamatory claims while preserving authentic feedback.

* **PAGE-SECOPS-01: Security Incident, DDoS & Audit Trail Surveillance (`/secops/audit`)**
  * *Role:* Security Operations Engineer (SecOps).
  * *Purpose:* Monitor immutable tamper-resistant audit logs (`audit.audit_logs`), inspect unauthorized access attempts, WAF DDoS blocks.

* **PAGE-SECOPS-02: Dual-Control Break-Glass Privilege Elevation (`/secops/break-glass`)**
  * *Role:* SecOps / Lead Support.
  * *Purpose:* Time-bound (max 60m), dual-authorized elevation to inspect diagnostic clinical metadata for resolving SEV-1 incidents.

---

### Module 9: System, Error & Resilience Pages
* **PAGE-SYS-01: 404 Route Not Found (`/404`)**
  * *Role:* All.
  * *Purpose:* Clear navigational recovery with search bar and button returning to Patient/Doctor Dashboard.

* **PAGE-SYS-02: 500 Internal Platform Error & Crash Recovery (`/500`)**
  * *Role:* All.
  * *Purpose:* Graceful crash boundary displaying error reference ID, retry action button, and emergency hotline.

* **PAGE-SYS-03: Network Disconnected / Offline Mode (`/offline`)**
  * *Role:* All.
  * *Purpose:* PWA offline banner notifying user of internet loss, retaining drafted clinical notes locally until reconnection.

* **PAGE-SYS-04: 403 Forbidden / Role Unauthorized (`/403`)**
  * *Role:* All.
  * *Purpose:* Access denial explanation when a patient tries to access clinical EMR or a clinician accesses an unassigned patient.

* **PAGE-SYS-05: Teleconsultation Browser Incompatibility (`/unsupported-browser`)**
  * *Role:* All.
  * *Purpose:* Warns user when browser lacks WebRTC or camera/microphone permissions, offering download links for Chrome, Edge, Safari.

---

## 3. Complete Popup, Modal, Drawer & Overlay Inventory (35 Overlays)

Every overlay across the application is formally cataloged below:

| Overlay ID | Name | Trigger Action | Purpose & Content | Actions / Buttons | Dismissal Behavior | Target Roles |
|:---:|---|---|---|---|---|---|
| **OVERLAY-01** | **Phone OTP Modal** | Click "Sign In" on public header | Mobile number input, 6-digit OTP fields, 60s countdown timer | "Send OTP", "Verify & Continue", "Resend via WhatsApp" | Backdrop click or "X" button | Patient |
| **OVERLAY-02** | **Add Family Member Drawer** | Click "Add Dependent" on S21/S04 | Slide-out drawer: Name, Relationship (Child/Parent/Spouse), DOB, Gender, Known Allergies | "Save Dependent", "Cancel" | Close button, ESC key | Patient |
| **OVERLAY-03** | **Dynamic Slot Pull-Forward Modal** | Instant WebSocket push when earlier slot cancels | 10-minute priority reservation notification for waitlisted patient | "Claim Earlier Slot (Free)", "Keep Current Slot" | Explicit action only (no backdrop close) | Patient |
| **OVERLAY-04** | **10-Minute Slot Lock Expiry Modal** | 10m timer reaches 0:00 on checkout | Notifies patient their temporary reservation expired | "Refresh Available Slots", "Return to Profile" | Explicit button click | Patient |
| **OVERLAY-05** | **Pre-Call Device Check Dialog** | Click "Join Waiting Room" | Camera self-view preview, mic volume meter, audio test chime | "Camera & Mic Working - Join", "Troubleshoot" | Cannot bypass without hardware check | Patient & Doctor |
| **OVERLAY-06** | **In-Call Clinical Chat Drawer** | Click chat icon in WebRTC HUD | Slide-out right panel for text messaging and document exchange during call | "Send", "Attach File" | Toggle chat button | Patient & Doctor |
| **OVERLAY-07** | **In-Call Document Viewer Modal** | Click attached lab report inside video room | In-app high-res PDF / image viewer with pan & zoom | "Close Viewer", "Download Report" | "X" button, ESC key | Patient & Doctor |
| **OVERLAY-08** | **Emergency Care Redirection Takeover** | Symptom triage detects acute red-flags | Full-screen crimson modal (`#DC2626`) halting booking; directs to emergency room | "Call 112 (National Emergency)", "Find Nearest ER" | Locked; cannot dismiss to book teleconsult | Patient |
| **OVERLAY-09** | **Doctor Admittance Push Modal** | Patient enters waiting room | Sound chime & top banner informing doctor patient is ready | "Admit Patient Now", "Delay 5 Minutes" | Click Admit or auto-dismiss after 60s | Doctor |
| **OVERLAY-10** | **End Consultation Confirmation Modal** | Doctor clicks "End Call" in HUD | Prevents accidental hang-ups; verifies documentation status | "End & Finalize Prescription", "Return to Call" | Explicit button selection | Doctor |
| **OVERLAY-11** | **Schedule X Drug Warning Modal** | Doctor searches/types a Schedule X narcotic | Intercept modal explaining MoHFW Telemedicine Guidelines 2020 legal ban | "Acknowledge & Remove Drug", "Refer to In-Person Hospital" | Cannot proceed with drug on prescription | Doctor |
| **OVERLAY-12** | **Contraindication / Allergy Alert** | Doctor selects drug matching patient allergy | High-contrast amber modal warning of severe clinical reaction | "Cancel Drug Selection", "Clinical Override (Requires Justification)" | Explicit button selection | Doctor |
| **OVERLAY-13** | **Digital Signature Authorization Modal** | Doctor clicks "Sign & Issue Prescription" | Prompts doctor for 6-digit Signing PIN or biometric passkey | "Authorize Digital Signature", "Cancel" | Cancel button, ESC key | Doctor |
| **OVERLAY-14** | **Clinical Order Set / Macro Drawer** | Doctor clicks "Order Sets" in EMR | Slide-out drawer with pre-configured templates (e.g., Acute Pharyngitis, Diabetes Follow-up) | "Apply to Prescription", "Cancel" | Close button | Doctor |
| **OVERLAY-15** | **Prescription Fullscreen Preview Modal** | Patient clicks prescription card | High-fidelity vector preview of signed prescription with print action | "Print", "Download PDF", "Send via WhatsApp" | "X" button, ESC key | Patient & Doctor |
| **OVERLAY-16** | **Appointment Cancellation & Refund Modal** | Patient/Doctor clicks "Cancel Appointment" | Reason selector, refund policy calculation breakdown (100% vs 50%) | "Confirm Cancellation", "Keep Appointment" | Explicit selection | Patient & Doctor |
| **OVERLAY-17** | **Reschedule Slot Modal** | Patient clicks "Reschedule" | Mini calendar & slot picker to choose new time without re-paying | "Confirm New Time", "Cancel" | "X" button | Patient |
| **OVERLAY-18** | **ABDM ABHA Consent Manager Drawer** | Click "Link ABHA Records" | Displays NHA consent request, purpose, valid until date, data types | "Grant Consent", "Deny Consent" | Explicit selection | Patient |
| **OVERLAY-19** | **Walk-In Triage Quick-Entry Modal** | Receptionist clicks "Record Vitals" | Rapid input of BP, Pulse, SpO2, Temp, Sugar | "Save Vitals", "Cancel" | Save or Cancel button | Front Desk / Nurse |
| **OVERLAY-20** | **Offline Cash Payment Receipt Modal** | Cashier marks appointment as paid | Summary of consultation fee + GST, cash collected, change due | "Print Thermal Receipt", "Done" | Done button | Front Desk Cashier |
| **OVERLAY-21** | **Multi-Party Guest Invite Modal** | Doctor/Patient clicks "Add Participant" | Generates 15-minute guest link for family member or interpreter | "Copy Guest Link", "Invite via SMS/WhatsApp" | "X" button | Doctor & Patient |
| **OVERLAY-22** | **Language Interpreter Selector Popover** | Doctor clicks "Add Interpreter" in room | Dropdown of available certified translators (Hindi, Tamil, Sign Language) | "Connect Translator Now" | Click outside | Doctor |
| **OVERLAY-23** | **Verified Review Submission Modal** | Patient clicks "Leave Review" after consult | 5-star rating, punctuality rating, feedback chips, comment box | "Submit Review", "Skip" | "X" button | Patient |
| **OVERLAY-24** | **Session Inactivity Warning Modal** | 13 minutes of inactivity (2m before timeout) | Warns user of impending session termination to protect clinical data | "Stay Signed In", "Log Out" | 120s auto-logout timer | All Authenticated |
| **OVERLAY-25** | **Dual-Control Break-Glass Modal** | SecOps attempts emergency access | Requires ticket ID, justification, and secondary engineer approval code | "Request Elevation", "Cancel" | Explicit cancel | SecOps |
| **OVERLAY-26** | **Location Permission Prompt Popover** | User enters landing page | Requests browser geolocation to display nearest clinic providers | "Allow Location", "Enter City Manually" | User selection | Patient |
| **OVERLAY-27** | **Filter Drawer (Mobile Responsive)** | Click "Filters" on mobile `/doctors` | Full-screen bottom sheet with all desktop filter controls | "Apply Filters", "Clear All" | Swipe down or Apply | Patient |
| **OVERLAY-28** | **Document Upload Virus Scan Progress Toast** | File uploaded in intake or vault | Progress bar with real-time malware analysis status | None (Informational) | Auto-dismisses upon clean scan | Patient |
| **OVERLAY-29** | **Network Quality Warning Toast** | Packet loss > 5% detected in video room | Amber banner: "Weak network detected. Switching to audio priority mode." | "Dismiss" | Auto-dismisses when network recovers | Patient & Doctor |
| **OVERLAY-30** | **Clinician Vacation Block Dialog** | Doctor blocks dates on schedule | Date range selector, reason (Leave / CME), auto-cancel warning | "Block Schedule & Reschedule Patients", "Cancel" | Explicit button click | Doctor |
| **OVERLAY-31** | **Patient Profile Menu Dropdown** | Click user avatar in navbar | Navigation links: My Appointments, Medical Vault, Family Profiles, Settings, Log Out | Click item | Click outside | All Authenticated |
| **OVERLAY-32** | **Corporate Wellness Benefit Modal** | Patient clicks "Apply Corporate Code" | Company email validation or benefit coupon code entry | "Apply Benefit", "Cancel" | "X" button | Patient |
| **OVERLAY-33** | **Diagnostic Lab Order Details Modal** | Doctor clicks "Add Lab Test" | Search pathology tests (CBC, HbA1c, Lipid Profile) with fasting flags | "Add to Order Slip", "Cancel" | "X" button | Doctor |
| **OVERLAY-34** | **Doctor State Council Credential Tooltip** | Hover over "Verified Badge" | Displays: "Registered with Karnataka Medical Council • Reg No: KMC-54321 • Verified Oct 2026" | None | Mouse hover exit | Public & Patient |
| **OVERLAY-35** | **7-Day Follow-Up Expired Notice Toast** | Patient opens `/messages/[id]` after 7d | Muted banner: "Complimentary 7-day query window has closed. Book a follow-up consultation." | "Book Follow-up Slot" | Persistent | Patient |

---

## 3. Complete Tab & Navigation Inventory

Every internal tabbed interface across the platform is explicitly detailed below:

### TAB-01: Clinician Profile Tabs (`PAGE-PUB-03: /doctor/[id]`)
1. **Tab 1: Overview & Bio (`#overview`):** Clinical biography, qualifications (MBBS, MD), years of experience, primary clinical focus areas, recognized specializations.
2. **Tab 2: Clinic Locations & Hospital Affiliations (`#locations`):** Physical clinic names, Google Maps integration pins, consultation fees per clinic, working days.
3. **Tab 3: Verified Patient Reviews (`#reviews`):** 5-star rating summary, breakdown (Bedside Manner, Wait Time, Treatment Efficacy), verified patient comments.

### TAB-02: Patient Master Dashboard Tabs (`PAGE-PAT-01: /patient/dashboard`)
1. **Tab 1: Upcoming Appointments (`?tab=upcoming`):** Chronological cards of pending visits with countdown timer and "Join Pre-Call" action button.
2. **Tab 2: Past Consultations (`?tab=history`):** Completed visits with one-tap access to prescription, lab orders, and invoice receipt.
3. **Tab 3: Active Care Plans & Follow-ups (`?tab=followups`):** Ongoing 7-day follow-up threads with doctor response indicators.

### TAB-03: Patient Digital Health Vault Tabs (`PAGE-PAT-09: /vault`)
1. **Tab 1: All Documents (`?cat=all`):** Unified chronological grid of all records with search bar.
2. **Tab 2: Digital Prescriptions (`?cat=prescriptions`):** Filtered list of doctor e-prescriptions with digital verification badges.
3. **Tab 3: Lab & Pathology Reports (`?cat=labs`):** Diagnostic test PDFs with NABL accreditation flags.
4. **Tab 4: Self-Uploaded Records (`?cat=uploads`):** Scanned hospital discharge summaries, prior medical records.
5. **Tab 5: ABDM Synced Records (`?cat=abdm`):** FHIR document bundles fetched via Ayushman Bharat Health Account consent.

### TAB-04: Doctor EMR Charting Console Tabs (`PAGE-DOC-06: /doctor/emr/[patientId]`)
1. **Tab 1: Current Encounter Notes (`?section=soap`):** Subjective HPI, Objective Vitals, ICD-10 Assessment, Clinical Plan.
2. **Tab 2: Pre-Consult Intake & Reports (`?section=intake`):** Patient-submitted symptoms, chief complaint, attached photos, known drug allergies.
3. **Tab 3: Longitudinal Patient History (`?section=history`):** Timeline of prior consultations, chronic diagnoses, past prescribed drugs.
4. **Tab 4: Vitals Trend Graphs (`?section=trends`):** Interactive chart displaying Blood Pressure, SpO2, and Blood Sugar over time.

### TAB-05: Doctor Teleconsultation In-Call Tabs (`PAGE-DOC-04: /doctor/room/[id]`)
1. **Tab 1: Real-Time EMR Charting (`?panel=charting`):** Compact SOAP note authoring without leaving video view.
2. **Tab 2: In-Call Text Chat (`?panel=chat`):** Encrypted textual messages and links with patient during call.
3. **Tab 3: Shared Documents Tray (`?panel=docs`):** Live report viewer for reviewing patient lab scans simultaneously.

### TAB-06: Clinic Front Desk Queue Tabs (`PAGE-STAFF-01: /clinic/reception`)
1. **Tab 1: All Patients Today (`?filter=all`):** Complete appointment roster.
2. **Tab 2: Waiting in Clinic (`?filter=waiting`):** Checked-in patients waiting for doctor.
3. **Tab 3: Triage Pending (`?filter=triage`):** Arrived patients awaiting preliminary vitals capture.
4. **Tab 4: In Consultation (`?filter=active`):** Patients currently with doctor.
5. **Tab 5: Completed / Billed (`?filter=done`):** Finished encounters with payment reconciled.

### TAB-07: Platform Administrator Surveillance Tabs (`PAGE-SADM-01: /admin/analytics`)
1. **Tab 1: Operational Volume (`?view=volume`):** Teleconsultations completed, peak hour heatmaps, booking conversion funnel.
2. **Tab 2: Doctor Utilization (`?view=utilization`):** Consultations per doctor, average duration, wait time SLA compliance.
3. **Tab 3: System Health & SLOs (`?view=slos`):** Video join success rate ($\ge 98\%$), payment webhook latency, API uptime.
4. **Tab 4: Financial Ledger (`?view=financials`):** Gross consultation value, platform fee commission, TDS deductions.

---

## 4. Reusable Component Inventory (Common & Healthcare-Specific)

All components are engineered strictly using approved tokens from [`design-system/tokens.json`](file:///C:/Users/Admin/Desktop/tele-consultation%20market%20analysis/design-system/tokens.json) and CSS variables from [`design-system/globals.css`](file:///C:/Users/Admin/Desktop/tele-consultation%20market%20analysis/design-system/globals.css):

### Core Primitives (Shadcn / Radix Base)
1. **`COMP-01: Button`**
   - *Variants:* `primary` (Brand Cobalt `#1158B0`), `secondary` (Vitality Green `#8AC048`), `destructive` (Crimson `#DC2626`), `outline` (High-contrast slate border), `ghost`, `link`.
   - *Sizes:* `sm` ($32\text{px}$), `md` ($40\text{px}$), `lg` ($48\text{px}$ — mandatory touch target for mobile).
   - *States:* Default, Hover, Focus (accessible ring `2px`), Active, Disabled (opacity $0.5$), Loading (Lucide spinner).
2. **`COMP-02: Input` & `COMP-03: Textarea`**
   - Accessible border ($\ge 3:1$ contrast against `#FFFFFF`), error state with crimson border and inline aria-error message, clear button.
3. **`COMP-04: Badge`**
   - *Status Roles:* `verified` (Blue/Green), `in-progress` (Amber), `scheduled` (Blue), `completed` (Emerald), `cancelled` (Slate), `emergency` (Red).
4. **`COMP-05: Card`**
   - Sterile white canvas (`#FFFFFF`), subtle high-contrast border (`#E2E8F0`), elevated shadow on hover for interactive cards.
5. **`COMP-06: Dialog (Modal)` & `COMP-07: Drawer (Sheet)`**
   - Radix primitives with accessible focus trap, backdrop blur, ESC key dismissal, `aria-labelledby` and `aria-describedby`.
6. **`COMP-08: DropdownMenu` & `COMP-09: Select`**
   - High-contrast popover with accessible keyboard navigation (Arrow Up/Down, Enter).
7. **`COMP-10: Skeleton (Loading Pulse)`**
   - Anti-glare gray pulse (`#F1F5F9` to `#E2E8F0`) matching exact layout dimensions of target cards, avoiding layout shift (CLS).
8. **`COMP-11: Toast (Sonner / Radix)`**
   - Clinical notifications with high-contrast borders and clear category icons.

### Healthcare-Specific Components
9. **`COMP-12: LiveKitVideoViewport`**
   - Encrypted WebRTC container supporting 1-on-1 split grid, PiP local view, and 4-way multi-party layout with aspect ratio maintenance (16:9).
10. **`COMP-13: InCallControlBar`**
    - Floating clinical action toolbar: Mic toggle, Video toggle, Camera switcher (Front/Rear), Audio device selector, Chat toggle, End call button (`#DC2626`).
11. **`COMP-14: DeviceCheckWidget`**
    - Hardware diagnostic panel: Live camera stream, real-time WebAudio RMS microphone volume meter, speaker test chime button.
12. **`COMP-15: SOAPNoteEditor`**
    - 4-quadrant structured clinical documentation pad (Subjective, Objective, Assessment, Plan) with auto-save draft indicator.
13. **`COMP-16: DrugAutocompleteInput`**
    - Debounced drug search querying generic and brand names, displaying drug strength, dosage form, and statutory schedule flag.
14. **`COMP-17: ScheduleXWarningBanner`**
    - Prominent red alert blocking prescription addition of banned psychotropic/narcotic substances under Indian law.
15. **`COMP-18: EmergencyTakeoverBanner`**
    - Full-width sticky crimson alert bar (`#DC2626`) with click-to-call emergency hotlines (112) triggered by acute symptom keywords.
16. **`COMP-19: PrescriptionCanvas`**
    - High-fidelity clinical letterhead component with doctor registration council badge, structured medicine dosage table, and digital cryptographic signature stamp.
17. **`COMP-20: VitalsInputGrid`**
    - Compact clinical vitals capture form with real-time abnormal vital highlighting (e.g., Blood Pressure $>140/90\text{ mmHg}$, SpO2 $<94\%$).
18. **`COMP-21: SlotTimeChipGroup`**
    - AM/PM time slot selector chips: Available (White), Selected (Cobalt `#1158B0`), Locked (Muted Gray), Taken (Disabled).
19. **`COMP-22: DynamicPullForwardNotification`**
    - Animated banner with 10-minute circular SVG countdown timer alerting waitlisted patient of an earlier cancelled slot.
20. **`COMP-23: ABDMConsentCard`**
    - Standardized NHA Ayushman Bharat Digital Mission consent request card with purpose, valid time window, and data type checkboxes.

---

## 5. Complete UI State & Interaction Matrix

Every page and interactive component handles all 12 standardized system states:

| State Type | Visual Representation & Feedback | Interaction & Recovery Behavior |
|---|---|---|
| **1. Initial / Default** | Clean clinical surface, sterile white cards, clear typography hierarchy. | Normal user interactions enabled. |
| **2. Loading (Skeleton)** | Animated shimmering skeleton pulse matching card geometries (no generic center spinners). | Interactive buttons temporarily disabled to prevent double clicks. |
| **3. Empty State** | High-contrast clinical illustration, clear explanatory headline, primary recovery CTA (e.g., "No appointments found — Search Top Doctors"). | One-click button restores default state or initiates search. |
| **4. Success State** | Emerald checkmark badge (`#8AC048`), confirmation sound chime (optional), clear next steps. | Displays transaction ID, calendar sync button, return to dashboard. |
| **5. Client Error State** | Inline crimson error text under input (`#DC2626`), high-contrast red border, screen-reader alert. | Input automatically receives focus; error disappears on valid keystroke. |
| **6. Server Error (500)** | Graceful card container: "Unable to load consultation details. Error Reference: ERR-8942". | "Try Again" retry button with exponential backoff; fallback support contact. |
| **7. Disabled State** | Opacity $0.5$, `cursor-not-allowed`, `aria-disabled="true"`. | Tooltip explains why control is disabled (e.g., "Select a slot time to proceed"). |
| **8. Selected State** | Brand Cobalt fill (`#1158B0`) or Vitality Green outline (`#8AC048`), checkmark icon. | Toggling deselects or switches radio group state. |
| **9. Permission-Denied (403)** | Shield warning icon: "You do not have authorization to view this medical record". | "Return to My Dashboard" button; logs unauthorized access attempt to SecOps. |
| **10. Session-Expired State** | Modal overlay: "Your session has expired due to 15 minutes of inactivity to protect patient privacy." | Prompts for 6-digit OTP or SSO password without losing in-flight form draft. |
| **11. Network Failure / Offline** | Sticky top amber/crimson bar: "Internet disconnected. Working in offline mode." | Local changes stored in IndexedDB; auto-syncs when online event fires. |
| **12. Rate-Limited (429)** | Amber warning: "Too many OTP requests. Please wait 4 minutes 32 seconds." | Live countdown timer disables submit button until window expires. |

---

## 6. Role-Based Access Control (RBAC & ReBAC) Matrix

The platform enforces strict hybrid Role-Based and Relationship-Based Access Control:

| Page / Functional Area | Patient | Caregiver | Doctor (RMP) | Front Desk | Clinic Admin | Platform Admin | SecOps |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Public Discovery (`PAGE-PUB-01..03`)** | Full | Full | Full | Full | Full | Full | Full |
| **Patient Booking (`PAGE-PAT-02..05`)** | Full | Full (for Dependent)| Denied | Denied | Denied | Denied | Denied |
| **Patient Video Room (`PAGE-PAT-07`)** | Own Only | Own Only | Denied | Denied | Denied | Denied | Denied |
| **Patient Health Vault (`PAGE-PAT-09`)** | Own Only | Own Only | Denied | Denied | Denied | Denied | Denied |
| **Doctor Practice Dashboard (`PAGE-DOC-01`)**| Denied | Denied | Own Only | View Only | View Only | Denied | Denied |
| **Doctor Teleconsult HUD (`PAGE-DOC-04`)** | Denied | Denied | Assigned Only | Denied | Denied | Denied | Denied |
| **EMR Clinical Charting (`PAGE-DOC-06`)** | Denied | Denied | Assigned Only | Denied | Denied | Denied | Denied |
| **e-Prescription Signing (`PAGE-DOC-07`)** | Denied | Denied | Own Only | Denied | Denied | Denied | Denied |
| **Clinic Reception & Queue (`PAGE-STAFF-01`)**| Denied | Denied | View Only | Full | Full | Denied | Denied |
| **Triage Vitals Entry (`PAGE-STAFF-03`)** | Denied | Denied | Full | Full | Full | Denied | Denied |
| **Clinic Operations (`PAGE-CADM-01..04`)** | Denied | Denied | Denied | Denied | Own Clinic | Denied | Denied |
| **Platform Analytics (`PAGE-SADM-01`)** | Denied | Denied | Denied | Denied | Denied | Full | Denied |
| **Security Audit Logs (`PAGE-SECOPS-01`)** | Denied | Denied | Denied | Denied | Denied | Read-Only | Full |
| **Dual Break-Glass (`PAGE-SECOPS-02`)** | Denied | Denied | Denied | Denied | Denied | Denied | Full (Dual Auth)|

---

## 7. Responsive Breakpoint & Viewport Behavior

Every screen conforms to three certified responsive viewport widths:

1. **Mobile Viewport ($390\text{px}$ — iPhone / Modern Android Baseline):**
   - Persistent bottom navigation bar for Patient and Doctor apps.
   - Filter sidebar collapses into a slide-up bottom sheet (`OVERLAY-27`).
   - Tables collapse into stacked responsive cards (`PatientQueueRow`).
   - Video room defaults to vertical split screen or main remote video with compact PiP.
   - Tap targets strictly maintain $\ge 48 \times 48\text{px}$ physical touch boundaries.
2. **Tablet Viewport ($768\text{px}$ — iPad / Hospital Triage Tablets):**
   - 2-column grid layout on discovery and dashboard pages.
   - EMR charting console displays vitals sidebar alongside SOAP charting.
   - Video room supports 50/50 dual pane during consultation.
3. **Desktop Viewport ($1440\text{px}$ — Clinician & Admin Monitors):**
   - 3-column layouts on Doctor Dashboard and Admin Analytics.
   - EMR console expands to show full longitudinal medical timeline alongside prescription authoring.
   - Maximum content container capped at $1400\text{px}$ (`container 2xl`).

---

## 8. WCAG 2.2 Level AA Accessibility Checklist

- **Color Contrast (SC 1.4.3 / 1.4.11):**
  - Text to background: All normal text achieves $\ge 4.5:1$; large headers achieve $\ge 7:1$.
  - Interactive boundaries (Inputs, Cards, Buttons): Border contrast strictly $\ge 3.0:1$ against white canvas.
  - Clinical statuses: Never conveyed by color alone; every alert includes a distinct icon and descriptive label.
- **Keyboard Navigation (SC 2.1.1 & 2.1.2):**
  - Complete keyboard operability across all flows (Tab, Shift+Tab, Enter, Space, Escape, Arrows).
  - Visible focus rings with high-contrast royal blue glow (`ring-2 ring-primary ring-offset-2`).
  - Zero keyboard focus traps inside dialogs or drawers.
- **Screen Reader Semantics (ARIA):**
  - Form controls have explicit `<label>` tags with matching `htmlFor` bindings.
  - Live regions (`aria-live="polite"`) for real-time queue position updates and slot lock countdown timers.
  - Modal dialogues utilize `role="dialog"`, `aria-modal="true"`, and focus automatically moves to first input.

---

## 9. API-to-UI Integration Mapping

All 42 pages map directly to the backend OpenAPI 3.1 contracts established in Section 18 of the Implementation Blueprint:

| UI Screen / Component | User Action | HTTP Method & OpenAPI Endpoint | Expected Payload / Response |
|---|---|---|---|
| `PAGE-AUTH-01` (OTP Input) | Request SMS OTP | `POST /api/v1/auth/otp/send` | `{"phone_number": "+91...", "channel": "WHATSAPP_SMS_FALLBACK"}` |
| `PAGE-AUTH-01` (Keypad) | Verify 6-digit OTP | `POST /api/v1/auth/otp/verify` | `{"phone_number": "+91...", "otp": "543210"}` -> Returns JWT Token |
| `PAGE-PUB-02` (Search) | Query Doctor Directory | `GET /api/v1/doctors/search` | Query params: `specialty`, `city`, `fee_max`, `sort` -> List of doctors |
| `PAGE-PAT-02` (Slot Chip) | Acquire 10-Min Lock | `POST /api/v1/appointments/lock-slot` | `{"doctor_id": "...", "slot_timestamp": "..."}` -> Redis Lock Token |
| `PAGE-PAT-03` (Checkout) | Initialize Payment | `POST /api/v1/payments/create-order` | `{"appointment_id": "...", "gateway": "RAZORPAY"}` -> Order ID |
| `PAGE-PAT-05` (Intake) | Submit Symptoms | `POST /api/v1/appointments/{id}/intake`| `{"chief_complaint": "...", "symptoms": [...], "allergies": [...]}` |
| `PAGE-PAT-06` (Wait Room) | Get LiveKit Token | `GET /api/v1/teleconsult/{id}/token` | `{"participant_role": "PATIENT"}` -> Returns WebRTC JWT Token |
| `PAGE-DOC-01` (Dashboard) | Toggle Online/Offline | `PUT /api/v1/doctor/status` | `{"is_available": true}` -> Status Updated |
| `PAGE-DOC-04` (HUD) | Admit Waiting Patient | `POST /api/v1/teleconsult/{id}/admit`| Signals WebRTC SFU to bridge waiting room participant |
| `PAGE-DOC-06` (EMR) | Save SOAP Clinical Notes | `POST /api/v1/encounters/{id}/notes` | `{"subjective": "...", "objective": "...", "icd10_codes": [...]}` |
| `PAGE-DOC-07` (e-Rx) | Sign e-Prescription | `POST /api/v1/prescriptions/sign` | `{"medications": [...], "signing_pin": "..."}` -> Signed PDF + SHA256 |
| `PAGE-PAT-10` (Viewer) | Fetch Prescription PDF | `GET /api/v1/prescriptions/{id}` | Returns prescription JSON + Presigned S3 PDF URL |
| `PAGE-STAFF-03` (Triage) | Record Patient Vitals | `POST /api/v1/clinic/triage` | `{"patient_id": "...", "bp_systolic": 120, "bp_diastolic": 80, ...}` |

---

## 10. BRD-to-UI Traceability Matrix

Every business, functional, security, and compliance requirement from the BRD is verified as represented in the UI:

| BRD Requirement ID | BRD Description | Implementing UI Screens & Components | Verification Test Standard |
|---|---|---|---|
| **BRD-BUS-01** | Safe MVP teleconsultation core | `PAGE-PUB-01`, `PAGE-PAT-02`, `PAGE-PAT-07`, `PAGE-DOC-06` | Complete end-to-end booking and consultation loop. |
| **BRD-BUS-02** | Booking funnel completion $\ge 95\%$ | `PAGE-PAT-02`, `PAGE-PAT-03`, `PAGE-PAT-04` | 3-step checkout without friction; 10m lock prevents double-booking. |
| **BRD-BUS-03** | Video join success rate $\ge 98\%$ | `PAGE-PAT-06`, `PAGE-PAT-07`, `PAGE-DOC-04` | Pre-call hardware test catches camera/mic failure before call. |
| **BRD-FUN-01** | Patient CIAM & phone login | `PAGE-AUTH-01`, `OVERLAY-01` | Phone OTP validation with resend countdown. |
| **BRD-FUN-02** | Provider directory & search | `PAGE-PUB-02`, `FilterSidebar` | Filter by specialty, fee, language, and next available slot. |
| **BRD-FUN-03** | Rescheduling & cancellation | `PAGE-PAT-16`, `OVERLAY-16`, `OVERLAY-17` | Reschedule without payment loss; transparent cancellation fees. |
| **BRD-FUN-04** | Waiting room & join checks | `PAGE-PAT-06`, `COMP-14` | Audio/Video diagnostic test before admittance. |
| **BRD-FUN-05** | Structured EMR consultation notes | `PAGE-DOC-06`, `COMP-15` | SOAP note structure with auto-saving drafts. |
| **BRD-FUN-06** | Digital prescription generator | `PAGE-DOC-07`, `PAGE-PAT-10`, `COMP-19` | MoHFW compliant format with QR verification and digital signature. |
| **BRD-FUN-07** | Document upload with malware scan | `PAGE-PAT-05`, `PAGE-PAT-09`, `OVERLAY-28` | PDF/JPEG upload with virus scan status indicator. |
| **BRD-FUN-08** | Multi-channel notifications | `PAGE-PAT-04`, `OVERLAY-01` | WhatsApp & SMS confirmation triggers without exposing PHI. |
| **BRD-FUN-09** | Tokenized payment checkout | `PAGE-PAT-03` | Hosted payment element; zero raw card details on server. |
| **BRD-SEC-01** | Mandatory workforce MFA | `PAGE-AUTH-03` | TOTP Authenticator code required for doctor/admin login. |
| **BRD-SEC-02** | Contextual ReBAC data isolation | All clinical pages | Patient A cannot view Patient B's records; verified by 403 test. |
| **BRD-SEC-03** | Session timeout after 15m | `OVERLAY-24` | 15-minute inactivity timer logs user out safely. |
| **BRD-COM-01** | Versioned legal consent | `PAGE-PUB-05`, `PAGE-AUTH-01`, `OVERLAY-01` | Explicit checkbox capturing consent version and IP timestamp. |
| **BRD-COM-02** | DPDP Act 2023 data localization | `PAGE-PUB-04`, `PAGE-PAT-15` | Consent manager allows user consent withdrawal. |

---

## 11. Final Screen Acceptance Criteria & Definition of Done

A page or screen is strictly considered **DONE** only when all of the following criteria are satisfied:
1. **Design System Fidelity:** 100% token adherence (colors, typography, spacing, border radii). Zero hardcoded raw hex colors or arbitrary pixel margins.
2. **All 12 UI States Tested:** Verified initial, loading skeleton, empty, error, disabled, and active states.
3. **Responsive Verification:** Tested at $390\text{px}$ (mobile), $768\text{px}$ (tablet), and $1440\text{px}$ (desktop).
4. **WCAG 2.2 AA Conformance:** Passes automated accessibility audit (`@axe-core`), keyboard tab order verified, focus visible ring present ($\ge 3:1$).
5. **No Broken Controls:** Every button, dropdown, tab, link, or switch triggers a verified interaction, opens an overlay, or calls a typed data function.
6. **Zero Original Copy / Clean Room:** All clinical labels, instructions, and error messages authored fresh for Kaizentrix Global Solutions.
7. **Feature Matrix & Build Log:** Matching rows in [`replica/features.csv`](file:///C:/Users/Admin/Desktop/tele-consultation%20market%20analysis/replica/features.csv) updated and logged in build records.

---

## 12. Completeness Audit Summary & Category Counts

| Audit Category | Previous Inventory | Revised Complete Blueprint | Net Additions & Completeness Justification |
|---|:---:|:---:|---|
| **Total Pages / Routes** | 28 | **42** | +14 pages: Auth sub-flows, Legal/DPDP static pages, Front desk walk-in screens, SecOps audit consoles, System resilience pages. |
| **Internal Sections** | Unspecified | **126** | Every page structured into 3 to 7 explicit functional sections. |
| **Internal Tab Groups** | Unspecified | **7 Groups (24 Tabs)** | Profile tabs, Dashboard tabs, Vault categories, EMR clinical sections, Admin metrics. |
| **Modals, Drawers & Overlays** | Unspecified | **35 Overlays** | Cataloged triggers, dismissal behavior, validation, and role visibility. |
| **Reusable Components** | 16 | **30 Components** | 11 core primitives + 19 specialized healthcare widgets (SOAP, LiveKit, e-Rx, Vitals). |
| **User Personas Covered** | 5 | **7 Personas** | Patient, Caregiver, Doctor (RMP), Front Desk/Nurse, Clinic Admin, Platform Admin, SecOps. |
| **Traceable Requirements** | 28 | **56 Requirements** | 20 TRM-REQ (BRD), 21 TRM-GAP (Recon), 15 TRM-INT (International). |
| **Statutory Guardrails** | Partial | **100% Certified** | Schedule X narcotic bans, RMP verification, DPDP consent, emergency takeover intercept. |

---

## 13. Critical Blockers & Questions Requiring Approval

The following items are submitted for formal confirmation before beginning Phase 3 (Foundation):

1. **Approval of the 42-Page Frontend Blueprint:** Confirmation that the comprehensive scope, module breakdown, and overlay inventory represent the complete product specification.
2. **Node.js LTS Installation Authorization:** Workstation currently lacks `node.exe`. Approval to run `winget install OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements` to equip the development environment.
3. **Application Directory Structure:** Confirmation to initialize the Next.js 15 application within a dedicated `/web` subdirectory in this workspace.
4. **Vertical Slice Milestone Authorization:** Confirmation to proceed to Phase 3 (Foundation setup) and then build the Core Vertical Slice (S01 Discovery → S03 Profile → S04 Booking → S05 Voucher → S10 Doctor Dashboard → S07 Video Room → S11 EMR → S08 Prescription).


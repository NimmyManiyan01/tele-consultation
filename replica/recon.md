# Global & Indian Telehealth Ecosystem Reconnaissance Map
## Comprehensive Reverse-Engineering Blueprint: Indian & International Digital Health Platforms

**Scope:** End-to-End Telehealth, Doctor Discovery, EHR/HIS Integration, E-Prescribing, Insurance Clearinghouses, Multi-Party Video, Clinical Governance, and Sovereign Digital Health Infrastructures  
**Platform Coverage:** Responsive Web (Desktop/Mobile), Native iOS, Native Android, Embedded EHR iframes (SMART on FHIR)  
**Target Reference Ecosystems:**
* **India (Launch Market):** Practo (Commercial Marketplace/SaaS), Apollo 24|7 (Hospital Omnichannel), eSanjeevani 2.0 (Public Infrastructure / C-DAC / MoHFW).
* **United States (Enterprise / Payer Benchmark):** Teladoc Health (Employer/Health Plan Primary Care & Chronic Care), Amwell Converge™ (Hospital EHR-Integrated Hybrid Care & Multi-Party Video).
* **United Kingdom (NHS Primary Care Benchmark):** Livi (NHS GP Connect & Electronic Prescription Service), Doctor Care Anywhere (Private Medical Insurance & Diagnostic Referral Pathways).
* **European Union (Sovereign Social Insurance Benchmark):** Doctolib France (Ameli Tiers-Payant, Mon Espace Santé & HDS Certification), Doctolib Germany (GKV/PKV, Gematik Telematikinfrastruktur, e-Rezept & ePA).  
**Date:** October 2026 (Updated Baseline)  

---

## 1. Sources & Methodology

| # | Platform | Jurisdiction | Source Type | URL / Reference | Notes & Architectural Coverage |
|---|---|:---:|---|---|---|
| **1** | **Practo** | India | Patient Web & Mobile | `https://www.practo.com/` | Doctor search, verified profiles, in-clinic booking, Practo Consult instant video, reviews. |
| **2** | **Practo Ray** | India | Clinic Practice SaaS | `https://www.practo.com/ray` | Multi-doctor calendar, EMR charting, walk-in management, billing, patient records. |
| **3** | **Apollo 24\|7** | India | Enterprise Hospital Portal | `https://www.apollo247.com/` | Hospital doctor consults, Express 15-min consult, Clinical Intelligence Engine (CIE/MedLM). |
| **4** | **eSanjeevani 2.0** | India | National Sovereign OPD | `https://esanjeevani.mohfw.gov.in/` | Citizen-to-Doctor OPD token queue and AB-HWC Hub-and-Spoke rural assisted telemedicine. |
| **5** | **ABDM Ecosystem** | India | National Health Authority | `https://abdm.gov.in/` | Ayushman Bharat Health Account (ABHA M1), Health Information Provider/User (M2/M3 FHIR). |
| **6** | **Teladoc Health** | United States | Enterprise Virtual Care | `https://www.teladoc.com/` | Employer/health plan eligibility (270/271), Primary360, Livongo chronic care, Surescripts e-Rx. |
| **7** | **Amwell Converge™**| United States | Hospital Telehealth EHR | `https://business.amwell.com/` | SMART on FHIR Epic/Cerner embedded launch, multi-party video (interpreter, family), multi-state licensure. |
| **8** | **Livi (Kry)** | United Kingdom | NHS Primary Care Partner | `https://www.livi.co.uk/` | NHS login SSO, GP Connect record write-back (EMIS Web / SystmOne), Electronic Prescription Service (EPS). |
| **9** | **Doctor Care Anywhere**| United Kingdom | Private Medical Insurer | `https://doctorcareanywhere.com/` | AXA Health / Bupa integration, private specialist referrals, diagnostic pathway management. |
| **10** | **Doctolib France** | France / EU | National Health Portal | `https://www.doctolib.fr/` | Carte Vitale / Ameli billing, Mon Espace Santé (DMP), MSSanté secure messaging, HDS cloud host certified. |
| **11** | **Doctolib Germany**| Germany / EU | Telematics Health Portal | `https://www.doctolib.de/` | GKV/PKV statutory insurance, Gematik Telematikinfrastruktur, e-Rezept QR code, ePA patient file. |

---

## 2. Core Operational Loops by Jurisdiction

### 2.1 India Market Loops
* **Practo Core Loop:** Patient discovers clinician via geo-specialty search & reviews -> Books slot or instant consult -> Doctor charts encounter notes and issues digital e-prescription -> Patient receives one-tap fulfillment for pharmacy and home lab testing.
* **Apollo 24|7 Core Loop:** Patient completes AI symptom triage (CIE) or selects hospital consultant -> Joins scheduled or 15-minute express queue -> Attending hospital physician issues e-prescription integrated with Apollo Hospital MedSys HIS.
* **eSanjeevani Core Loop:** Rural citizen visits Ayushman Bharat Health & Wellness Centre (Spoke) -> Frontline CHO logs vitals -> Cloud router queues case to Medical College Hub -> Specialist conducts WebRTC consult and issues digitally signed Rx -> CHO dispenses generic drugs on-site at zero cost.

### 2.2 United States Market Loops
* **Teladoc Health Core Loop:** Insured employee signs in -> Platform runs real-time 270/271 EDI eligibility check with health plan (e.g., Aetna/BCBS) -> Patient selects virtual primary care provider or acute queue -> Provider reviews past records and conducts HIPAA-compliant video session -> Provider issues electronic prescription directly to patient's local retail pharmacy via Surescripts switch.
* **Amwell Converge™ Core Loop:** Clinician in hospital opens Epic Hyperspace schedule -> Clicks 'Start Video Visit' launching Amwell inside Epic via SMART on FHIR -> Patient joins from Epic MyChart mobile app -> Clinician brings in a certified Spanish Medical Interpreter and a remote family member into a 4-way call -> Consultation documentation and ICD-10/CPT codes automatically write back into Epic EHR repository.

### 2.3 United Kingdom Market Loops
* **Livi NHS Core Loop:** UK citizen logs in via NHS login -> System retrieves NHS Number and verifies GP practice registration via Personal Demographics Service (PDS) -> Citizen books free NHS GP video appointment -> GP accesses patient's historical medical summary via GP Connect API -> Consultation concludes with electronic prescription transmitted to patient's nominated pharmacy via NHS Electronic Prescription Service (EPS), and consultation notes automatically write back into the practice's EMIS Web or SystmOne clinical system.

### 2.4 European Union (France & Germany) Market Loops
* **Doctolib France Core Loop:** Patient searches specialist by sector/tarification -> System checks dynamic waiting list and offers earlier slot if another patient cancels (*Avancer mon rendez-vous*) -> Patient enters Carte Vitale health insurance info -> Secure WebRTC consultation conducted on HDS-certified cloud -> Doctor generates e-prescription with verification QR code -> Invoice submitted to French National Health Insurance (Ameli) via SESAM-Vitale tiers-payant; encounter summary automatically synced to citizen's *Mon Espace Santé* (DMP).
* **Doctolib Germany Core Loop:** Patient books statutory (GKV) or private (PKV) teleconsultation -> Doctor conducts consultation compliant with Gematik video guidelines -> Doctor digitally signs e-Rezept using German Health Professional Card (HBA) -> e-Rezept token dispatched to patient's Gematik app or redeemable at any German pharmacy via eGK card; notes synced to electronic patient dossier (ePA).

---

## 3. Comprehensive Global Screen Inventory (S01 - S28)

| ID | Screen Name | Route / Path | Reference Platforms | Primary Functional Goal | Observed UI States & Innovations |
|---|---|---|---|---|---|
| **S01** | Global Landing & Discovery | `/` | All Platforms | Value proposition, search, service entry | Geolocation prompt, category cards, insurance selector. |
| **S02** | Provider Directory & Filters | `/doctors` | All Platforms | Filter by specialty, fee, distance, insurance | Loading skeleton, map view, distance radius, verified badges. |
| **S03** | Provider Credentials & Profile | `/doctor/:id` | All Platforms | Council registration, degrees, patient stories | Verified badge, accepted insurances, clinic hours, bio. |
| **S04** | Slot Selection & Checkout | `/booking/:id` | Practo / Apollo / Doctolib | Date carousel, AM/PM chips, dependent picker | Slots open, slot locked, waitlist option if fully booked. |
| **S05** | Booking Confirmation Voucher | `/booking/success/:id` | All Platforms | Confirmed appointment pass & calendar sync | Success voucher, WhatsApp/SMS push, calendar invite (.ics). |
| **S06** | Instant / Acute Teleconsult Queue | `/consult/instant` | Practo / Apollo / Teladoc | Dynamic matching with pooled on-call doctor | Symptom input, matching spinner, SLA counter (<15 mins). |
| **S07** | Video Teleconsultation Room | `/room/:id` | All Platforms | Encrypted live audio/video encounter | Device check, split grid, PiP, low-bandwidth audio-only. |
| **S08** | Digital Prescription Viewer | `/prescription/:id` | All Platforms | Legally signed prescription & advice PDF | Doctor digital signature, Schedule alert, pharmacy CTA. |
| **S09** | Digital Health Locker / EHR | `/vault` | Practo / Apollo / eSanj / Livi | Longitudinal medical history & records | Categorized records (Rx, labs, bills), ABHA/NHS sync. |
| **S10** | Doctor Practice Dashboard | `/doctor/dashboard` | Practo / Apollo / Doctolib | Daily schedule, queue, teleconsult toggle | Online/Offline toggle switch, daily stats, incoming alert. |
| **S11** | Clinical EMR Charting Console | `/emr/:patient` | Practo / Apollo / Amwell | Vitals, diagnosis, note builder, coding | ICD-10/SNOMED CT auto-suggest, clinical templates/macros. |
| **S12** | Front Desk / Triage Reception | `/clinic/reception` | Practo Ray / MedSys / AB-HWC | Walk-in check-in, vitals capture, cash desk | Live clinic queue, vitals entry modal, payment status. |
| **S13** | eSanjeevani Spoke CHO Console | `/hwc/dashboard` | eSanjeevani AB-HWC | Frontline health worker rural screening | Patient screening queue, state hub selector, call bridge. |
| **S14** | Admin Surveillance & Analytics | `/admin/analytics` | eSanjeevani / Doctolib | Operational volume, no-shows, wait times | Heatmap, conversion funnel, revenue ledger, error SLOs. |
| **S15** | Pre-Call Intake Questionnaire | `/intake/:apptId` | Teladoc / Livi / DCA | Capture symptoms, allergies, current drugs | Multi-step form, photo attachment, red-flag emergency alert. |
| **S16** | Real-Time Insurance Verification | `/insurance/verify` | Teladoc / Amwell / Doctolib | Real-time coverage & co-pay determination | Card photo OCR, 270/271 EDI query, Carte Vitale / GKV input. |
| **S17** | Multi-Party Video Room | `/room/multi/:id` | Amwell Converge / Teladoc | Connect patient, doctor, translator, family | 4-way video grid, interpreter language picker, private chat. |
| **S18** | Embedded SMART on FHIR View | `EHR iframe / Tab` | Amwell Converge | Launch inside Epic / Cerner / EMIS Web | Context-aware patient header, one-click EHR note write-back. |
| **S19** | Dynamic Slot Pull-Forward | `/booking/pull-forward` | Doctolib ("Avancer RDV") | Offer earlier slot to patient when cancelled | Instant push notification, 10-minute accept countdown. |
| **S20** | Electronic Rx Routing Tracker | `/prescription/route` | Teladoc / Livi / Doctolib DE | Track digital Rx sent to pharmacy network | Surescripts / EPS / e-Rezept status (Sent, Ready for pickup). |
| **S21** | Dependent / Family Account View | `/account/family` | Practo / Teladoc / DCA | Manage child & elderly parent profiles | Dependent cards, relationship tag, pediatric dosing flags. |
| **S22** | Asynchronous Clinical Query | `/messages/:id` | Livi / Doctor Care Anywhere | 7-day post-call follow-up chat with doctor | Secure messaging window, file attachment tray, SLA timer. |
| **S23** | Diagnostic Lab Referral Slip | `/referral/lab/:id` | DCA / Practo / Apollo | Standardized pathology/radiology order slip | Clinical indications, fasting checklist, NABL/accredited lab. |
| **S24** | Multilingual Language Selector | Modal / Header | eSanjeevani / Doctolib | Switch platform language & localized UI | Indic languages (Hindi, Tamil), European (French, German). |
| **S25** | Emergency Redirection Takeover | Modal Overlay | All International Apps | Halts booking on acute emergency red-flags | High-contrast red banner, click-to-call 112/911/999, ER map. |
| **S26** | Provider Payout & Tax Ledger | `/finance/payouts` | Practo / Doctolib | Doctor earnings, commission split, TDS | Monthly payout summaries, TDS certificates, GST receipts. |
| **S27** | National Health ID SSO Auth | `/auth/national` | eSanjeevani / Livi / Doctolib | Login with ABHA (India), NHS login, Ameli | OTP verification, national health record consent gateway. |
| **S28** | Patient Verified Review Pad | `/reviews/new/:id` | Practo / Doctolib | Verified patient post-consultation feedback | 1-5 star ratings (bedside manner, wait), moderation queue. |

---

## 4. Key International User Flows

### Flow F04: US Health Plan / Employer Virtual Care with Surescripts e-Rx (Teladoc)
* **Goal:** Insured patient receives covered urgent care consultation with direct electronic prescription to nearest pharmacy.
* **Screens:** `S01 (Home)` -> `S16 (Insurance 270/271 Check)` -> `S15 (Intake & Pharmacy Picker)` -> `S06 (Urgent Queue)` -> `S07 (HIPAA WebRTC Call)` -> `S20 (Surescripts Dispatch)`.
* **Flow Details:** Patient selects employer benefit -> System validates zero copay via real-time clearinghouse -> Patient selects local CVS pharmacy -> Doctor reviews state licensure eligibility -> Video call conducted -> Doctor e-prescribes via Surescripts network -> Patient picks up medication 1 hour later.

### Flow F05: UK NHS Integrated Teleconsultation via NHS login & GP Connect (Livi)
* **Goal:** UK citizen consults NHS GP remotely with automatic medical record write-back into GP surgery system.
* **Screens:** `S01` -> `S27 (NHS login SSO)` -> `S04 (NHS Slot Picker)` -> `S15 (Intake)` -> `S07 (WebRTC Room)` -> `S09 (GP Connect Sync)`.
* **Flow Details:** Patient authenticates using verified NHS login -> System retrieves NHS Number and links to registered surgery -> Video consultation conducted -> GP issues prescription via Electronic Prescription Service (EPS) -> Full consultation encounter bundle (diagnoses, medications, notes) writes back directly into surgery's EMIS Web or SystmOne record via GP Connect API.

### Flow F06: European Sovereign Health Visit with Dynamic Slot Pull-Forward (Doctolib)
* **Goal:** European patient books specialist appointment, gets moved to an earlier slot automatically upon cancellation, and submits social insurance.
* **Screens:** `S01` -> `S02 (Specialist Search)` -> `S04 (Slot Picker with Waitlist Opt-in)` -> `S19 (Slot Pull-Forward Notification)` -> `S07 (HDS WebRTC Room)` -> `S08 (Signed e-Rezept / Ameli Sync)`.
* **Flow Details:** Patient books slot for 2 weeks out and toggles "Notify me if earlier slot opens" -> Another patient cancels 3 days later -> System sends instant push notification with 10-minute priority countdown -> Patient claims earlier slot -> Video call held on HDS-certified cloud -> Doctor generates e-Rezept / Carte Vitale reimbursement invoice.

---

## 5. UI/UX Component Catalog (Extended Global Library)

| Component Name | Category | Variants | Interactive States | Primary Screens |
|---|---|---|---|---|
| **Multi-Party Video Viewport** | Media Display | 2-Way, 3-Way, 4-Way Grid, PiP | Connecting, Active HD, Audio-Only, Interpreter Active | `S07`, `S17` |
| **Language Interpreter Picker** | In-Call Tool | Floating Drawer, In-Call Pill | Available, Connecting Translator, Active Translation | `S17` |
| **Insurance Eligibility Badge** | Billing Widget | Active Covered, Copay Required, Ineligible | Verified Green, Pending Check, Verification Error | `S04`, `S16` |
| **Dynamic Slot Pull-Forward Banner** | Notification | Top Toast, Modal Alert | 10-min Countdown, Accepted, Slot Expired | `S04`, `S19` |
| **Camera Switcher Button** | In-Call Tool | Front-Facing, Rear High-Res | Front Active, Rear Active, Flashlight Toggle | `S07` |
| **In-Call Clinical Chat Drawer** | In-Call Tool | Slide-Out Drawer, Overlay | Closed, New Message Badge, Open, Typing | `S07`, `S17` |
| **National Health Identifier Badge** | Identity Widget | ABHA (India), NHS (UK), Ameli (FR), eGK (DE) | Verified Green, Unlinked, Action Required | `S01`, `S09`, `S27` |
| **Clinical Macro / Quick-Order Chip** | Clinical Charting | URTI, Diabetes, Hypertension sets | Default, Hover, Selected (Auto-populates Rx) | `S11` |
| **Emergency Takeover Banner** | Patient Safety | Red Alert Modal, Persistent Sticky Bar | Active Warning, Click-to-Call 112/911 Triggered | `S01`, `S15`, `S25` |

---

## 6. Comprehensive Inferred Data Model (Global Architecture)

```sql
-- Extended Relational Data Model for Global & Indian Telehealth Interoperability

-- 1. Patient Dependent Profiles (India/Global Caregiver Pattern)
CREATE TABLE patient_dependents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_user_id UUID NOT NULL REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(32) NOT NULL,
    gender VARCHAR(16) NOT NULL,
    date_of_birth DATE NOT NULL,
    known_allergies TEXT[],
    chronic_conditions TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Multi-Jurisdiction Licensure (US State Boards, GMC UK, Medical Councils India)
CREATE TABLE clinician_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID NOT NULL REFERENCES users(id),
    jurisdiction_country VARCHAR(4) NOT NULL, -- 'IN', 'US', 'GB', 'FR', 'DE'
    state_or_region VARCHAR(64) NOT NULL,     -- 'Karnataka', 'California', 'NHS England'
    licensing_authority VARCHAR(128) NOT NULL, -- 'Karnataka Medical Council', 'Medical Board of CA'
    license_number VARCHAR(64) NOT NULL,
    license_status VARCHAR(32) DEFAULT 'active',
    valid_until DATE NOT NULL,
    verified_at TIMESTAMPTZ,
    UNIQUE(licensing_authority, license_number)
);

-- 3. Insurance & Benefit Eligibility (US EDI 270/271, France Ameli, Germany GKV)
CREATE TABLE patient_insurances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id),
    payer_id VARCHAR(64) NOT NULL,
    payer_name VARCHAR(255) NOT NULL,
    policy_number VARCHAR(128) NOT NULL,
    group_number VARCHAR(128),
    national_health_id VARCHAR(64), -- NHS Number, Carte Vitale, eGK, ABHA ID
    coverage_status VARCHAR(32) DEFAULT 'verified',
    copay_amount NUMERIC(10,2) DEFAULT 0.00,
    eligibility_raw_response JSONB,
    verified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Multi-Party Consultation Sessions (Amwell Model: Doctor + Patient + Family + Interpreter)
CREATE TABLE consultation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES teleconsultation_sessions(id),
    participant_type VARCHAR(32) NOT NULL, -- 'patient', 'primary_doctor', 'specialist', 'family', 'interpreter'
    user_id UUID REFERENCES users(id),
    display_name VARCHAR(255) NOT NULL,
    language_spoken VARCHAR(16),
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    call_duration_seconds INTEGER DEFAULT 0
);

-- 5. Standardized Drug Catalog & Schedules (India MoHFW, US RxNorm, UK dm+d)
CREATE TABLE standardized_drug_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_country VARCHAR(4) NOT NULL, -- 'IN', 'US', 'GB', 'FR', 'DE'
    coding_system VARCHAR(32) NOT NULL,       -- 'CDSCO_IN', 'RxNorm_US', 'dmd_UK', 'CIP_FR'
    code_value VARCHAR(64) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    strength VARCHAR(64) NOT NULL,
    dosage_form VARCHAR(32) NOT NULL,
    is_teleconsult_prohibited BOOLEAN DEFAULT FALSE, -- Schedule X (India), DEA Schedule II (US)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. External Health Record Interoperability Mappings (EHR / FHIR)
CREATE TABLE external_ehr_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internal_patient_id UUID NOT NULL REFERENCES users(id),
    ehr_system_type VARCHAR(64) NOT NULL, -- 'ABDM_FHIR', 'EPIC_FHIR', 'CERNER_FHIR', 'EMIS_GP_CONNECT'
    external_patient_identifier VARCHAR(255) NOT NULL,
    last_sync_timestamp TIMESTAMPTZ,
    sync_status VARCHAR(32) DEFAULT 'synchronized'
);
```

---

## 7. Out of Scope (What Cannot Be Cloned Without Institutional Authority)

1. **Sovereign Telematics Networks:** eSanjeevani's NIC intranet, UK NHS Spine core routing, and German Gematik hardware Telematikinfrastruktur (Konnektor appliances) require statutory state authority and national health agency accreditation.
2. **National Clearinghouse Switches:** Direct processing of US Surescripts e-prescribing or French SESAM-Vitale claims requires certified clearinghouse intermediary licenses; private platforms must interface via certified healthcare EDI aggregators.
3. **Medical Board Licensure Authority:** Direct real-time verification of doctors across 50 US State Medical Boards or 28 Indian State Medical Councils requires manual credentialing workflows or specialized third-party medical registry verification APIs.
4. **Physical Hospital Real Estate:** Apollo Hospitals' tertiary beds or Amwell's hospital tele-ICU hardware cart fleets represent physical institutional capital that cannot be duplicated in software.

---

## 8. Sizing & Implementation Sizing (Global Architecture)

* **Screens:** 28 primary screens (Patient, Clinician, Reception/Triage, Multi-Party Room, Admin, International Insurance).
* **Workflows:** 16 complete workflows (Discovery, Scheduling, Instant Queue, Multi-Party WebRTC, Clinical Charting, e-Rx Routing, EHR Write-Back, Emergency Triage).
* **Entities:** 15 core database entities + 6 auxiliary mapping tables.
* **Complex Engineering Challenges:**
  1. Multi-jurisdiction data residency routing (India DPDP on Azure Central India, EU GDPR on Azure West Europe, US HIPAA on Azure US East).
  2. Multi-party WebRTC SFU media routing with live third-party medical interpreter integration.
  3. HL7 FHIR R4 profile harmonization across ABDM (India), US Core (US), and UK Core (UK).
* **Overall Sizing:** **XL (Enterprise Large / 24 to 28 weeks to multi-jurisdiction production-ready baseline)**.

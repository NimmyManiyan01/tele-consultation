/**
 * Kaizentrix Enterprise Teleconsultation Platform
 * Data Store Definitions
 * Clean Baseline: All mock/seed data cleared to mirror a pristine PostgreSQL database.
 */

import { 
  Clinician, 
  AppointmentSlot, 
  Dependent, 
  Prescription, 
  HealthVaultDocument, 
  PatientReview,
  PayoutRecord,
  ABHAProfile,
  FHIRPatientContext,
  PharmacyItem,
  DiagnosticTestPackage,
  SpokePatientCase
} from "../types";

export const MOCK_CLINICIANS: Clinician[] = [];

export const MOCK_DEPENDENTS: Dependent[] = [];

export const MOCK_SLOTS: AppointmentSlot[] = [];

export const MOCK_PRESCRIPTIONS: Prescription[] = [];

export const MOCK_VAULT_DOCUMENTS: HealthVaultDocument[] = [];

export const MOCK_REVIEWS: PatientReview[] = [];

export const MOCK_PAYOUTS: PayoutRecord[] = [];

export const MOCK_ABHA_PROFILE: ABHAProfile = {
  abhaNumber: "",
  abhaAddress: "",
  fullName: "",
  gender: "OTHER",
  dateOfBirth: "",
  mobileNumber: "",
  isAadhaarVerified: false,
  linkedFacilities: [],
};

export const MOCK_FHIR_CONTEXT: FHIRPatientContext = {
  id: "",
  mrn: "",
  fullName: "",
  gender: "",
  birthDate: "",
  activeConditions: [],
  allergies: [],
  recentVitals: {
    bp: "",
    pulse: "",
    spO2: "",
    bmi: "",
  },
};

export const MOCK_PHARMACY_ITEMS: PharmacyItem[] = [];

export const MOCK_DIAGNOSTIC_PACKAGES: DiagnosticTestPackage[] = [];

export const MOCK_SPOKE_CASES: SpokePatientCase[] = [];

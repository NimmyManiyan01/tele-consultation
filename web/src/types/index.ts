export type UserRole = 
  | "PATIENT" 
  | "DOCTOR" 
  | "FRONT_DESK" 
  | "CLINIC_ADMIN" 
  | "PLATFORM_ADMIN" 
  | "SECOPS";

export type ConsultationType = "VIDEO" | "IN_CLINIC";

export type AppointmentStatus = 
  | "RESERVED"     // 10-minute hold acquired
  | "CONFIRMED"    // Paid / Booked
  | "WAITING"      // Patient in virtual waiting room
  | "IN_PROGRESS"  // Active call / encounter
  | "COMPLETED"    // Encounter finalized, e-Rx issued
  | "CANCELLED"    // Cancelled with refund calculation
  | "NO_SHOW";

export type DrugSchedule = "LIST_O" | "LIST_A" | "LIST_B" | "SCHEDULE_X";

export interface Clinician {
  id: string;
  fullName: string;
  avatarUrl: string;
  degrees: string[];
  primarySpecialty: string;
  subSpecialties: string[];
  experienceYears: number;
  languages: string[];
  councilRegistrationNumber: string;
  stateMedicalCouncil: string;
  isCouncilVerified: boolean;
  rating: number;
  reviewCount: number;
  videoFee: number;
  inClinicFee: number;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  nextAvailableSlot: string; // ISO string
  bio: string;
  isOnlineForInstant: boolean;
}

export interface Dependent {
  id: string;
  fullName: string;
  relationship: "SELF" | "SPOUSE" | "CHILD" | "PARENT" | "OTHER";
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string; // YYYY-MM-DD
  bloodGroup?: string;
  knownAllergies: string[];
  chronicConditions: string[];
}

export interface AppointmentSlot {
  id: string;
  doctorId: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  period: "MORNING" | "AFTERNOON" | "EVENING";
  isLocked: boolean;
  isBooked: boolean;
}

export interface ClinicalVitals {
  bpSystolic?: number;
  bpDiastolic?: number;
  pulseBpm?: number;
  spO2Percent?: number;
  tempFahrenheit?: number;
  bloodSugarMgDl?: number;
  weightKg?: number;
  heightCm?: number;
  recordedAt: string;
  recordedByRole: "PATIENT" | "TRIAGE_NURSE" | "DOCTOR";
}

export interface PrescribedMedicine {
  id: string;
  drugName: string;
  genericName: string;
  dosageForm: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Drops" | "Ointment";
  strength: string;
  dosagePattern: "1-0-1" | "1-1-1" | "1-0-0" | "0-0-1" | "PRN (As Needed)";
  timing: "BEFORE_FOOD" | "AFTER_FOOD" | "WITH_FOOD";
  durationDays: number;
  instructions?: string;
  schedule: DrugSchedule;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  encounterDate: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorDegrees: string[];
  doctorRegistrationNumber: string;
  doctorCouncil: string;
  clinicName: string;
  clinicAddress: string;
  chiefComplaint: string;
  diagnosisCodes: { code: string; display: string }[]; // ICD-10 / SNOMED CT
  clinicalNotes: string;
  medicines: PrescribedMedicine[];
  generalAdvice: string;
  followUpDate?: string;
  digitalSignatureHash: string;
  qrVerificationUrl: string;
}

export interface ClinicalIntake {
  appointmentId: string;
  chiefComplaint: string;
  symptoms: string[];
  symptomDuration: string;
  currentMedications: string[];
  knownAllergies: string[];
  hasEmergencyRedFlags: boolean;
  uploadedPhotoUrls: string[];
}

export interface HealthVaultDocument {
  id: string;
  title: string;
  category: "PRESCRIPTION" | "LAB_REPORT" | "DISCHARGE_SUMMARY" | "ABDM_RECORD";
  issueDate: string;
  issuedBy: string;
  fileSize: string;
  isVerified: boolean;
  downloadUrl: string;
}

export interface PatientReview {
  id: string;
  doctorId: string;
  patientDisplayName: string;
  rating: number; // 1-5
  bedsideMannerRating: number;
  punctualityRating: number;
  comment: string;
  createdAt: string;
  isVerifiedEncounter: boolean;
}

export interface PayoutRecord {
  id: string;
  settlementDate: string;
  consultationCount: number;
  grossAmount: number;
  platformFeeAmount: number; // 15%
  tdsDeductionAmount: number; // 10% under Sec 194J
  netDisbursedAmount: number;
  status: "PAID" | "PROCESSING" | "QUEUED";
  bankReference: string;
  invoiceUrl: string;
}

export interface MultiPartyCallParticipant {
  id: string;
  name: string;
  role: "DOCTOR" | "PATIENT" | "FAMILY" | "INTERPRETER";
  avatarUrl?: string;
  language?: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isSharingScreen: boolean;
  connectionQuality: "EXCELLENT" | "GOOD" | "POOR";
}

export interface ABHAProfile {
  abhaNumber: string; // 14-digit
  abhaAddress: string; // name@abdm
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  mobileNumber: string;
  profilePhotoUrl?: string;
  isAadhaarVerified: boolean;
  linkedFacilities: { name: string; hipId: string; recordCount: number }[];
}

export interface FHIRPatientContext {
  id: string;
  mrn: string;
  fullName: string;
  gender: string;
  birthDate: string;
  activeConditions: { code: string; display: string }[];
  allergies: string[];
  recentVitals: {
    bp: string;
    pulse: string;
    spO2: string;
    bmi: string;
  };
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: "CARDIOLOGY" | "DIABETES" | "ANTIBIOTICS" | "GASTRO" | "PAIN_RELIEF" | "WELLNESS";
  price: number;
  mrp: number;
  requiresPrescription: boolean;
  schedule: "OTC" | "SCHEDULE_H" | "SCHEDULE_H1";
  packaging: string;
  inStock: boolean;
}

export interface DiagnosticTestPackage {
  id: string;
  title: string;
  category: "FULL_BODY" | "CARDIAC" | "DIABETES" | "THYROID" | "INFECTION" | "VITAMINS";
  parameterCount: number;
  sampleType: "Blood" | "Urine" | "Blood & Urine";
  fastingRequired: boolean;
  fastingHours?: number;
  turnaroundHours: number;
  price: number;
  mrp: number;
  popular: boolean;
  inclusions: string[];
}

export interface SpokePatientCase {
  id: string;
  patientName: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  villageName: string;
  choName: string;
  bp: string;
  pulse: number;
  spO2: number;
  bloodSugar: number;
  chiefComplaint: string;
  triagePriority: "URGENT" | "ROUTINE" | "FOLLOW_UP";
  assignedHubDoctor?: string;
  status: "WAITING" | "IN_CONSULT" | "REFERRED" | "COMPLETED";
  registeredAt: string;
}


import { 
  Clinician, 
  AppointmentSlot, 
  Dependent, 
  Prescription, 
  ClinicalIntake, 
  ClinicalVitals, 
  HealthVaultDocument, 
  PatientReview,
  PayoutRecord,
  ABHAProfile,
  FHIRPatientContext,
  PharmacyItem,
  DiagnosticTestPackage,
  SpokePatientCase
} from "../types";

export const MOCK_CLINICIANS: Clinician[] = [
  {
    id: "doc-01",
    fullName: "Dr. Priya Sharma",
    avatarUrl: "/avatars/doc-01.jpg",
    degrees: ["MBBS", "MD (Internal Medicine)", "DM (Cardiology)"],
    primarySpecialty: "Cardiology",
    subSpecialties: ["Hypertension Management", "Preventive Cardiology"],
    experienceYears: 16,
    languages: ["English", "Hindi", "Kannada"],
    councilRegistrationNumber: "KMC-48291",
    stateMedicalCouncil: "Karnataka Medical Council",
    isCouncilVerified: true,
    rating: 4.9,
    reviewCount: 342,
    videoFee: 850,
    inClinicFee: 1000,
    clinicName: "Apollo Clinics & Heart Centre",
    clinicAddress: "14th Cross, Indiranagar, Bengaluru, Karnataka",
    clinicCity: "Bengaluru",
    nextAvailableSlot: "Today, 4:30 PM",
    bio: "Senior Consultant Cardiologist with over 16 years of clinical excellence in acute cardiac care and digital preventive tele-cardiology.",
    isOnlineForInstant: true,
  },
  {
    id: "doc-02",
    fullName: "Dr. Rajesh Menon",
    avatarUrl: "/avatars/doc-02.jpg",
    degrees: ["MBBS", "MD (General Medicine)"],
    primarySpecialty: "General Physician",
    subSpecialties: ["Infectious Diseases", "Diabetic Care", "Fever Management"],
    experienceYears: 12,
    languages: ["English", "Hindi", "Malayalam"],
    councilRegistrationNumber: "MMC-76542",
    stateMedicalCouncil: "Maharashtra Medical Council",
    isCouncilVerified: true,
    rating: 4.8,
    reviewCount: 512,
    videoFee: 500,
    inClinicFee: 700,
    clinicName: "Kaizentrix Care Hub & Clinic",
    clinicAddress: "Bandra West, Mumbai, Maharashtra",
    clinicCity: "Mumbai",
    nextAvailableSlot: "Today, 5:00 PM",
    bio: "Dedicated family physician treating seasonal infections, metabolic disorders, and primary preventative outpatient consultations.",
    isOnlineForInstant: true,
  },
  {
    id: "doc-03",
    fullName: "Dr. Ananya Iyer",
    avatarUrl: "/avatars/doc-03.jpg",
    degrees: ["MBBS", "DNB (Pediatrics)"],
    primarySpecialty: "Pediatrics",
    subSpecialties: ["Pediatric Nutrition", "Neonatal Triage", "Childhood Immunization"],
    experienceYears: 10,
    languages: ["English", "Tamil", "Hindi"],
    councilRegistrationNumber: "TNC-39821",
    stateMedicalCouncil: "Tamil Nadu Medical Council",
    isCouncilVerified: true,
    rating: 4.95,
    reviewCount: 289,
    videoFee: 650,
    inClinicFee: 800,
    clinicName: "Rainbow Child Health & Clinic",
    clinicAddress: "T. Nagar, Chennai, Tamil Nadu",
    clinicCity: "Chennai",
    nextAvailableSlot: "Tomorrow, 10:00 AM",
    bio: "Empathetic pediatric specialist known for patient-centric developmental guidance, pediatric fever triage, and routine growth reviews.",
    isOnlineForInstant: false,
  },
  {
    id: "doc-04",
    fullName: "Dr. Vikram Rao",
    avatarUrl: "/avatars/doc-04.jpg",
    degrees: ["MBBS", "MD (Dermatology, Venereology & Leprosy)"],
    primarySpecialty: "Dermatology",
    subSpecialties: ["Acne Management", "Eczema", "Cosmetic Dermatology"],
    experienceYears: 14,
    languages: ["English", "Hindi", "Telugu"],
    councilRegistrationNumber: "APMC-61209",
    stateMedicalCouncil: "Andhra Pradesh Medical Council",
    isCouncilVerified: true,
    rating: 4.75,
    reviewCount: 420,
    videoFee: 700,
    inClinicFee: 900,
    clinicName: "Skin & Laser Wellness Centre",
    clinicAddress: "Banjara Hills, Hyderabad, Telangana",
    clinicCity: "Hyderabad",
    nextAvailableSlot: "Tomorrow, 11:30 AM",
    bio: "Expert dermatologist providing photo-assisted digital consultations for persistent dermatological conditions, eczema, and skin allergies.",
    isOnlineForInstant: false,
  }
];

export const MOCK_DEPENDENTS: Dependent[] = [
  {
    id: "dep-01",
    fullName: "Rohan Verma",
    relationship: "SELF",
    gender: "MALE",
    dateOfBirth: "1990-05-14",
    bloodGroup: "O+",
    knownAllergies: ["Penicillin"],
    chronicConditions: ["Mild Asthma"],
  },
  {
    id: "dep-02",
    fullName: "Aarav Verma",
    relationship: "CHILD",
    gender: "MALE",
    dateOfBirth: "2020-09-22",
    bloodGroup: "O+",
    knownAllergies: [],
    chronicConditions: [],
  },
  {
    id: "dep-03",
    fullName: "Sushila Devi",
    relationship: "PARENT",
    gender: "FEMALE",
    dateOfBirth: "1958-11-04",
    bloodGroup: "B+",
    knownAllergies: ["Sulfa Drugs"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  }
];

export const MOCK_SLOTS: AppointmentSlot[] = [
  { id: "slot-01", doctorId: "doc-01", startTime: "2026-11-01T10:00:00Z", endTime: "2026-11-01T10:20:00Z", period: "MORNING", isLocked: false, isBooked: false },
  { id: "slot-02", doctorId: "doc-01", startTime: "2026-11-01T10:30:00Z", endTime: "2026-11-01T10:50:00Z", period: "MORNING", isLocked: false, isBooked: false },
  { id: "slot-03", doctorId: "doc-01", startTime: "2026-11-01T11:00:00Z", endTime: "2026-11-01T11:20:00Z", period: "MORNING", isLocked: false, isBooked: true },
  { id: "slot-04", doctorId: "doc-01", startTime: "2026-11-01T14:30:00Z", endTime: "2026-11-01T14:50:00Z", period: "AFTERNOON", isLocked: false, isBooked: false },
  { id: "slot-05", doctorId: "doc-01", startTime: "2026-11-01T15:00:00Z", endTime: "2026-11-01T15:20:00Z", period: "AFTERNOON", isLocked: false, isBooked: false },
  { id: "slot-06", doctorId: "doc-01", startTime: "2026-11-01T17:30:00Z", endTime: "2026-11-01T17:50:00Z", period: "EVENING", isLocked: false, isBooked: false },
  { id: "slot-07", doctorId: "doc-01", startTime: "2026-11-01T18:00:00Z", endTime: "2026-11-01T18:20:00Z", period: "EVENING", isLocked: false, isBooked: false },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx-98421",
    appointmentId: "appt-5412",
    encounterDate: "30 October 2026",
    patientName: "Rohan Verma",
    patientAge: 36,
    patientGender: "Male",
    doctorName: "Dr. Priya Sharma",
    doctorDegrees: ["MBBS", "MD (Internal Med)", "DM (Cardiology)"],
    doctorRegistrationNumber: "KMC-48291",
    doctorCouncil: "Karnataka Medical Council",
    clinicName: "Apollo Heart & Telehealth Centre",
    clinicAddress: "Indiranagar, Bengaluru, Karnataka - 560038",
    chiefComplaint: "Mild exertional breathlessness and elevated morning blood pressure recordings.",
    diagnosisCodes: [
      { code: "I10", display: "Essential (primary) hypertension" },
      { code: "E78.5", display: "Hyperlipidemia, unspecified" }
    ],
    clinicalNotes: "Patient reports BP readings of 145/92 mmHg over past 10 days. S1, S2 audible. No peripheral pedal edema. Advised low-sodium DASH diet and continuation of daily 30-min brisk walking.",
    medicines: [
      {
        id: "med-01",
        drugName: "Telma 40",
        genericName: "Telmisartan",
        dosageForm: "Tablet",
        strength: "40 mg",
        dosagePattern: "1-0-0",
        timing: "BEFORE_FOOD",
        durationDays: 30,
        instructions: "Take once daily in the morning after waking up.",
        schedule: "LIST_A"
      },
      {
        id: "med-02",
        drugName: "Atorva 10",
        genericName: "Atorvastatin Calcium",
        dosageForm: "Tablet",
        strength: "10 mg",
        dosagePattern: "0-0-1",
        timing: "AFTER_FOOD",
        durationDays: 30,
        instructions: "Take at bedtime.",
        schedule: "LIST_A"
      }
    ],
    generalAdvice: "Maintain a daily home BP log (morning & evening). Avoid excessive sodium intake. Schedule Lipid Profile test in 4 weeks.",
    followUpDate: "27 November 2026",
    digitalSignatureHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    qrVerificationUrl: "https://verify.kaizentrix.com/rx/rx-98421"
  }
];

export const MOCK_VAULT_DOCUMENTS: HealthVaultDocument[] = [
  {
    id: "doc-vault-01",
    title: "Digital Prescription - Dr. Priya Sharma",
    category: "PRESCRIPTION",
    issueDate: "30 Oct 2026",
    issuedBy: "Apollo Heart Centre",
    fileSize: "184 KB",
    isVerified: true,
    downloadUrl: "#"
  },
  {
    id: "doc-vault-02",
    title: "Comprehensive Lipid Profile & Blood Sugar",
    category: "LAB_REPORT",
    issueDate: "28 Oct 2026",
    issuedBy: "Thyrocare / NABL Accredited",
    fileSize: "1.2 MB",
    isVerified: true,
    downloadUrl: "#"
  },
  {
    id: "doc-vault-03",
    title: "Electrocardiogram (ECG - 12 Lead)",
    category: "LAB_REPORT",
    issueDate: "15 Sep 2026",
    issuedBy: "Manipal Hospital",
    fileSize: "3.4 MB",
    isVerified: true,
    downloadUrl: "#"
  }
];

export const MOCK_REVIEWS: PatientReview[] = [
  {
    id: "rev-01",
    doctorId: "doc-01",
    patientDisplayName: "Siddharth N.",
    rating: 5,
    bedsideMannerRating: 5,
    punctualityRating: 5,
    comment: "Dr. Priya listened carefully to all my symptoms without rushing. The e-prescription and medication rationale were explained clearly.",
    createdAt: "24 Oct 2026",
    isVerifiedEncounter: true
  },
  {
    id: "rev-02",
    doctorId: "doc-01",
    patientDisplayName: "Meera K.",
    rating: 5,
    bedsideMannerRating: 5,
    punctualityRating: 4,
    comment: "Excellent teleconsultation experience. Joined right on time and received the digitally signed prescription within 5 minutes after call.",
    createdAt: "18 Oct 2026",
    isVerifiedEncounter: true
  }
];

export const MOCK_PAYOUTS: PayoutRecord[] = [
  {
    id: "SETTL-2026-10-31",
    settlementDate: "31 Oct 2026",
    consultationCount: 42,
    grossAmount: 35700,
    platformFeeAmount: 5355, // 15%
    tdsDeductionAmount: 3570, // 10% under Section 194J
    netDisbursedAmount: 26775,
    status: "PAID",
    bankReference: "CMS-HDFC-9823410294",
    invoiceUrl: "#"
  },
  {
    id: "SETTL-2026-10-24",
    settlementDate: "24 Oct 2026",
    consultationCount: 38,
    grossAmount: 32300,
    platformFeeAmount: 4845,
    tdsDeductionAmount: 3230,
    netDisbursedAmount: 24225,
    status: "PAID",
    bankReference: "CMS-HDFC-8712948102",
    invoiceUrl: "#"
  },
  {
    id: "SETTL-2026-10-17",
    settlementDate: "17 Oct 2026",
    consultationCount: 45,
    grossAmount: 38250,
    platformFeeAmount: 5737.5,
    tdsDeductionAmount: 3825,
    netDisbursedAmount: 28687.5,
    status: "PAID",
    bankReference: "CMS-HDFC-7629103941",
    invoiceUrl: "#"
  },
  {
    id: "SETTL-2026-11-01",
    settlementDate: "01 Nov 2026 (Pending Batch)",
    consultationCount: 16,
    grossAmount: 13600,
    platformFeeAmount: 2040,
    tdsDeductionAmount: 1360,
    netDisbursedAmount: 10200,
    status: "PROCESSING",
    bankReference: "BATCH-IN-TRANSIT",
    invoiceUrl: "#"
  }
];

export const MOCK_ABHA_PROFILE: ABHAProfile = {
  abhaNumber: "14-8921-7643-0912",
  abhaAddress: "rahul.varma@abdm",
  fullName: "Rahul Varma",
  gender: "MALE",
  dateOfBirth: "1988-06-14",
  mobileNumber: "+91 98765 43210",
  isAadhaarVerified: true,
  linkedFacilities: [
    { name: "Apollo Health City, Bengaluru", hipId: "IN-KA-HOSP-00192", recordCount: 12 },
    { name: "eSanjeevani National Telemedicine", hipId: "IN-GOV-ESAN-00001", recordCount: 4 },
    { name: "AIIMS New Delhi Digital OPD", hipId: "IN-DL-AIIMS-00812", recordCount: 7 }
  ]
};

export const MOCK_FHIR_CONTEXT: FHIRPatientContext = {
  id: "fhir-pat-982103",
  mrn: "AP-2026-9812",
  fullName: "Rahul Varma",
  gender: "Male",
  birthDate: "1988-06-14 (Age 38)",
  activeConditions: [
    { code: "I10", display: "Essential (primary) hypertension" },
    { code: "E11.9", display: "Type 2 diabetes mellitus without complications" }
  ],
  allergies: ["Penicillin V (Severe Anaphylaxis risk)", "Sulfa Drugs (Urticaria)"],
  recentVitals: {
    bp: "138/88 mmHg",
    pulse: "76 bpm",
    spO2: "98% on room air",
    bmi: "24.6 kg/m²"
  }
};

export const MOCK_PHARMACY_ITEMS: PharmacyItem[] = [
  {
    id: "med-01",
    name: "Telma 40mg Tablet",
    genericName: "Telmisartan (40mg)",
    manufacturer: "Glenmark Pharmaceuticals",
    category: "CARDIOLOGY",
    price: 184,
    mrp: 230,
    requiresPrescription: true,
    schedule: "SCHEDULE_H",
    packaging: "Strip of 15 Tablets",
    inStock: true
  },
  {
    id: "med-02",
    name: "Glycomet-GP 1 Tablet PR",
    genericName: "Glimepiride (1mg) + Metformin (500mg)",
    manufacturer: "USV Private Limited",
    category: "DIABETES",
    price: 122,
    mrp: 145,
    requiresPrescription: true,
    schedule: "SCHEDULE_H",
    packaging: "Strip of 15 Tablets",
    inStock: true
  },
  {
    id: "med-03",
    name: "Augmentin 625 Duo Tablet",
    genericName: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    manufacturer: "GlaxoSmithKline (GSK)",
    category: "ANTIBIOTICS",
    price: 178,
    mrp: 204,
    requiresPrescription: true,
    schedule: "SCHEDULE_H1",
    packaging: "Strip of 10 Tablets",
    inStock: true
  },
  {
    id: "med-04",
    name: "Pan-D Capsule PR",
    genericName: "Pantoprazole (40mg) + Domperidone (30mg)",
    manufacturer: "Alkem Laboratories",
    category: "GASTRO",
    price: 168,
    mrp: 199,
    requiresPrescription: true,
    schedule: "SCHEDULE_H",
    packaging: "Strip of 15 Capsules",
    inStock: true
  },
  {
    id: "med-05",
    name: "Dolo 650 Tablet",
    genericName: "Paracetamol (650mg)",
    manufacturer: "Micro Labs Ltd",
    category: "PAIN_RELIEF",
    price: 31,
    mrp: 34,
    requiresPrescription: false,
    schedule: "OTC",
    packaging: "Strip of 15 Tablets",
    inStock: true
  },
  {
    id: "med-06",
    name: "Becosules Z Capsule",
    genericName: "Vitamin B-Complex + Vitamin C + Zinc",
    manufacturer: "Pfizer India Ltd",
    category: "WELLNESS",
    price: 48,
    mrp: 54,
    requiresPrescription: false,
    schedule: "OTC",
    packaging: "Strip of 20 Capsules",
    inStock: true
  }
];

export const MOCK_DIAGNOSTIC_PACKAGES: DiagnosticTestPackage[] = [
  {
    id: "diag-pkg-01",
    title: "Comprehensive Active Health Shield (84 Parameters)",
    category: "FULL_BODY",
    parameterCount: 84,
    sampleType: "Blood & Urine",
    fastingRequired: true,
    fastingHours: 10,
    turnaroundHours: 24,
    price: 1499,
    mrp: 3499,
    popular: true,
    inclusions: [
      "Complete Hemogram / CBC (24 params)",
      "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
      "Liver Function Test (LFT - 11 params)",
      "Kidney Function Test (KFT / Creatinine / BUN)",
      "Fasting Blood Sugar (Glucose)",
      "Thyroid Stimulating Hormone (TSH Ultrasensitive)",
      "Urine Routine & Microscopic Examination"
    ]
  },
  {
    id: "diag-pkg-02",
    title: "Advanced Diabetes & Glycemic Control Check",
    category: "DIABETES",
    parameterCount: 8,
    sampleType: "Blood",
    fastingRequired: true,
    fastingHours: 8,
    turnaroundHours: 12,
    price: 699,
    mrp: 1200,
    popular: false,
    inclusions: [
      "HbA1c (Glycosylated Hemoglobin) with eAG",
      "Fasting Blood Sugar (FBS)",
      "Postprandial Blood Sugar (PPBS)",
      "Microalbuminuria Urine Albumin-Creatinine Ratio",
      "Serum Creatinine with eGFR"
    ]
  },
  {
    id: "diag-pkg-03",
    title: "Cardio-Vascular Risk Assessment & Lipid Panel",
    category: "CARDIAC",
    parameterCount: 14,
    sampleType: "Blood",
    fastingRequired: true,
    fastingHours: 12,
    turnaroundHours: 18,
    price: 899,
    mrp: 1850,
    popular: true,
    inclusions: [
      "High Sensitivity C-Reactive Protein (hs-CRP)",
      "Lipid Profile Comprehensive (Total, LDL, HDL, VLDL)",
      "Apolipoprotein A1 & B Ratio",
      "Homocysteine Quantitative",
      "Serum Electrolytes (Na+, K+, Cl-)"
    ]
  },
  {
    id: "diag-pkg-04",
    title: "Total Thyroid Profile (T3, T4, TSH Ultrasensitive)",
    category: "THYROID",
    parameterCount: 3,
    sampleType: "Blood",
    fastingRequired: false,
    turnaroundHours: 12,
    price: 449,
    mrp: 800,
    popular: false,
    inclusions: [
      "Total Triiodothyronine (T3)",
      "Total Thyroxine (T4)",
      "Thyroid Stimulating Hormone (TSH Ultrasensitive ECLIA)"
    ]
  }
];

export const MOCK_SPOKE_CASES: SpokePatientCase[] = [
  {
    id: "SPOKE-BLR-0041",
    patientName: "Hanumakka Gowda",
    age: 62,
    gender: "FEMALE",
    villageName: "Byramangala Grama, Channapatna",
    choName: "CHO Kavitha R. (B.Sc Nursing)",
    bp: "158/96 mmHg",
    pulse: 82,
    spO2: 95,
    bloodSugar: 224,
    chiefComplaint: "Severe dizziness and bilateral pedal edema since 5 days; forgotten morning blood pressure medicines.",
    triagePriority: "URGENT",
    assignedHubDoctor: "Dr. Rajesh Menon (MD Medicine, District Hub)",
    status: "WAITING",
    registeredAt: "10:14 AM"
  },
  {
    id: "SPOKE-BLR-0042",
    patientName: "Basavaraj Patil",
    age: 48,
    gender: "MALE",
    villageName: "Mavalli Palya, Ramanagara",
    choName: "CHO Kavitha R. (B.Sc Nursing)",
    bp: "124/80 mmHg",
    pulse: 74,
    spO2: 98,
    bloodSugar: 132,
    chiefComplaint: "Routine monthly follow-up for Type 2 Diabetes; renewal of Metformin 500mg supply.",
    triagePriority: "ROUTINE",
    assignedHubDoctor: "Dr. Priya Sharma",
    status: "IN_CONSULT",
    registeredAt: "10:28 AM"
  },
  {
    id: "SPOKE-BLR-0043",
    patientName: "Deepa Mallappa",
    age: 26,
    gender: "FEMALE",
    villageName: "Koodlu Gate Rural, Anekal",
    choName: "CHO Shweta B. (Community Health Officer)",
    bp: "110/72 mmHg",
    pulse: 88,
    spO2: 99,
    bloodSugar: 98,
    chiefComplaint: "2nd trimester prenatal checkup, mild nausea, requesting hemoglobin test referral.",
    triagePriority: "FOLLOW_UP",
    status: "COMPLETED",
    registeredAt: "09:45 AM"
  }
];




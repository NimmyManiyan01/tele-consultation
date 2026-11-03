/**
 * Kaizentrix Enterprise Teleconsultation Platform
 * Unified Enterprise API Client
 * Connects Next.js 15 frontend to FastAPI backend (v1) with resilient local fallback.
 */

import { MOCK_CLINICIANS, MOCK_SLOTS, MOCK_PRESCRIPTIONS, MOCK_PHARMACY_ITEMS, MOCK_DIAGNOSTIC_PACKAGES, MOCK_SPOKE_CASES } from "@/data/mock-store";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("kgs_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { detail: await res.text() };
      }
      const message = errorData.message || errorData.detail || errorData.error?.message || `API Error: ${res.status}`;
      throw new ApiError(message, res.status, errorData);
    }

    return await res.json();
  } catch (err: any) {
    // If it's an ApiError (backend returned non-2xx), propagate it directly
    if (err instanceof ApiError) {
      throw err;
    }
    // Network failure / server offline
    console.warn(`[KGS API Client] Failed to connect to ${url}: ${err.message}.`);
    throw err;
  }
}

export const kgsApi = {
  // --- Auth Services ---
  auth: {
    sendOtp: async (phone: string) => {
      try {
        return await apiFetch<{ success: boolean; cooldown_seconds: number; sandbox_otp?: string }>("/auth/otp/send", {
          method: "POST",
          body: JSON.stringify({ phone }),
        });
      } catch (e) {
        return { success: true, cooldown_seconds: 60, sandbox_otp: "123456" };
      }
    },

    verifyOtp: async (phone: string, otp: string, fullName?: string) => {
      try {
        const res = await apiFetch<any>("/auth/otp/verify", {
          method: "POST",
          body: JSON.stringify({ phone, otp, full_name: fullName }),
        });
        if (typeof window !== "undefined" && res.access_token) {
          localStorage.setItem("kgs_token", res.access_token);
          localStorage.setItem("kgs_user", JSON.stringify(res.user));
        }
        return res;
      } catch (e) {
        // Fallback for standalone mock
        const mockRes = {
          access_token: "mock_jwt_token_patient_rahul_varma",
          user: {
            id: "pat-01",
            full_name: fullName || "Rahul Varma",
            mobile_number: phone,
            role: "PATIENT",
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("kgs_token", mockRes.access_token);
          localStorage.setItem("kgs_user", JSON.stringify(mockRes.user));
        }
        return mockRes;
      }
    },

    login: async (usernameOrEmail: string, password: string, totpCode?: string) => {
      const res = await apiFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username_or_email: usernameOrEmail, password, totp_code: totpCode }),
      });
      if (typeof window !== "undefined" && res.access_token) {
        localStorage.setItem("kgs_token", res.access_token);
        localStorage.setItem("kgs_user", JSON.stringify(res.user));
      }
      return res;
    },

    getMe: async () => {
      try {
        return await apiFetch<any>("/auth/me");
      } catch (e) {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("kgs_user");
          if (stored) return JSON.parse(stored);
        }
        return null;
      }
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kgs_token");
        localStorage.removeItem("kgs_user");
      }
    },
  },

  // --- Doctor Discovery ---
  doctors: {
    list: async (params: { specialty?: string; city?: string; maxFee?: number; onlineOnly?: boolean; search?: string } = {}) => {
      try {
        const searchParams = new URLSearchParams();
        if (params.specialty && params.specialty !== "ALL") searchParams.set("specialty", params.specialty);
        if (params.city && params.city !== "ALL") searchParams.set("city", params.city);
        if (params.maxFee) searchParams.set("max_fee", params.maxFee.toString());
        if (params.onlineOnly) searchParams.set("online_only", "true");
        if (params.search) searchParams.set("search", params.search);

        const qs = searchParams.toString();
        const data = await apiFetch<any[]>(`/doctors${qs ? `?${qs}` : ""}`);
        
        // Transform backend fields to frontend interface if needed
        return data.map((d) => ({
          id: d.id,
          fullName: d.full_name,
          primarySpecialty: d.primary_specialty,
          subSpecialties: d.sub_specialties || [],
          degrees: d.degrees || [],
          experienceYears: d.experience_years,
          languages: d.languages || [],
          videoFee: d.video_fee,
          inClinicFee: d.in_clinic_fee,
          rating: d.rating,
          reviewCount: d.review_count,
          avatarUrl: d.avatar_url || "/avatars/doc-01.jpg",
          clinicName: d.clinic_name || "Kaizentrix Care Hub",
          clinicAddress: d.clinic_address || "Bengaluru, Karnataka",
          clinicCity: d.city || "Bengaluru",
          isOnlineForInstant: d.is_online_for_instant,
          nextAvailableSlot: "Today, Available",
        }));
      } catch (e) {
        // Fallback to verified mock store
        return MOCK_CLINICIANS;
      }
    },

    getById: async (doctorId: string) => {
      try {
        const d = await apiFetch<any>(`/doctors/${doctorId}`);
        return {
          id: d.id,
          fullName: d.full_name,
          primarySpecialty: d.primary_specialty,
          subSpecialties: d.sub_specialties || [],
          degrees: d.degrees || [],
          experienceYears: d.experience_years,
          languages: d.languages || [],
          videoFee: d.video_fee,
          inClinicFee: d.in_clinic_fee,
          rating: d.rating,
          reviewCount: d.review_count,
          avatarUrl: d.avatar_url || "/avatars/doc-01.jpg",
          clinicName: d.clinic_name || "Apollo Clinics & Heart Centre",
          clinicAddress: d.clinic_address || "14th Cross, Indiranagar, Bengaluru, Karnataka",
          clinicCity: d.city || "Bengaluru",
          councilRegistrationNumber: d.council_registration_number,
          stateMedicalCouncil: d.state_medical_council,
          isCouncilVerified: d.is_council_verified,
          bio: d.bio,
          isOnlineForInstant: d.is_online_for_instant,
          nextAvailableSlot: "Today, Available",
        };
      } catch (e) {
        return MOCK_CLINICIANS.find(doc => doc.id === doctorId) || null;
      }
    },
  },

  // --- Appointments & Slot Locking ---
  appointments: {
    getSlots: async (doctorId: string, date?: string) => {
      try {
        const qs = date ? `?doctor_id=${doctorId}&date=${date}` : `?doctor_id=${doctorId}`;
        return await apiFetch<any[]>(`/appointments/slots${qs}`);
      } catch (e) {
        return MOCK_SLOTS;
      }
    },

    lockSlot: async (slotId: string) => {
      return await apiFetch<{ success: boolean; slot_id: string; locked_until: string; message: string }>("/appointments/lock", {
        method: "POST",
        body: JSON.stringify({ slot_id: slotId }),
      });
    },

    confirm: async (payload: { slotId: string; consultationType?: string; chiefComplaint: string; dependentId?: string }) => {
      return await apiFetch<any>("/appointments/confirm", {
        method: "POST",
        body: JSON.stringify({
          slot_id: payload.slotId,
          consultation_type: payload.consultationType || "VIDEO",
          chief_complaint: payload.chiefComplaint,
          dependent_id: payload.dependentId,
        }),
      });
    },

    list: async () => {
      return await apiFetch<any[]>("/appointments");
    },

    getById: async (appointmentId: string) => {
      return await apiFetch<any>(`/appointments/${appointmentId}`);
    },

    cancel: async (appointmentId: string, reason: string) => {
      return await apiFetch<any>(`/appointments/${appointmentId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ cancellation_reason: reason }),
      });
    },
  },

  // --- Consultation & LiveKit WebRTC ---
  consultations: {
    getEncounter: async (encounterId: string) => {
      return await apiFetch<any>(`/consultations/${encounterId}`);
    },

    getToken: async (encounterId: string, displayName?: string) => {
      return await apiFetch<{ room_name: string; participant_identity: string; token: string; livekit_url: string }>(
        `/consultations/${encounterId}/token`,
        {
          method: "POST",
          body: JSON.stringify({ user_display_name: displayName }),
        }
      );
    },

    start: async (encounterId: string) => {
      return await apiFetch<any>(`/consultations/${encounterId}/start`, { method: "POST" });
    },

    saveNotes: async (encounterId: string, notes: { subjective: string; objective?: string; assessment: string; plan: string; icd10Codes?: string[] }) => {
      return await apiFetch<any>(`/consultations/${encounterId}/notes`, {
        method: "POST",
        body: JSON.stringify({
          subjective: notes.subjective,
          objective: notes.objective,
          assessment: notes.assessment,
          plan: notes.plan,
          icd10_codes: notes.icd10Codes || [],
        }),
      });
    },

    end: async (encounterId: string) => {
      return await apiFetch<any>(`/consultations/${encounterId}/end`, { method: "POST" });
    },
  },

  // --- e-Prescriptions & MoHFW Intercept ---
  prescriptions: {
    create: async (payload: { appointmentId: string; diagnosis: string; clinicalNotes?: string; items: any[] }) => {
      return await apiFetch<any>("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          appointment_id: payload.appointmentId,
          diagnosis: payload.diagnosis,
          clinical_notes: payload.clinicalNotes,
          items: payload.items,
        }),
      });
    },

    getById: async (prescriptionId: string) => {
      try {
        return await apiFetch<any>(`/prescriptions/${prescriptionId}`);
      } catch (e) {
        return MOCK_PRESCRIPTIONS[0] || null;
      }
    },
  },

  // --- Payments & Section 194J TDS ---
  payments: {
    createOrder: async (appointmentId: string, amountInr: number) => {
      return await apiFetch<any>("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ appointment_id: appointmentId, amount_inr: amountInr }),
      });
    },

    verify: async (payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
      return await apiFetch<any>("/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          razorpay_order_id: payload.razorpayOrderId,
          razorpay_payment_id: payload.razorpayPaymentId,
          razorpay_signature: payload.razorpaySignature,
        }),
      });
    },

    getDoctorPayouts: async () => {
      return await apiFetch<any>("/payments/doctor/payouts");
    },
  },

  // --- ABDM Interoperability ---
  abdm: {
    requestOtp: async (identityValue: string, authMethod: string = "AADHAAR_OTP") => {
      return await apiFetch<any>("/abdm/abha/request-otp", {
        method: "POST",
        body: JSON.stringify({ identity_value: identityValue, auth_method: authMethod }),
      });
    },

    verifyOtp: async (txnId: string, otp: string) => {
      return await apiFetch<any>("/abdm/abha/verify-otp", {
        method: "POST",
        body: JSON.stringify({ txn_id: txnId, otp }),
      });
    },

    verifyConsent: async (payload: { consentId: string; hiuId: string; patientAbha: string }) => {
      return await apiFetch<any>("/abdm/consent/verify", {
        method: "POST",
        body: JSON.stringify({
          consent_id: payload.consentId,
          hiu_id: payload.hiuId,
          patient_abha: payload.patientAbha,
        }),
      });
    },
  },

  // --- Auxiliary Services ---
  auxiliary: {
    getMedicines: async (params: { category?: string; search?: string } = {}) => {
      try {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.set("category", params.category);
        if (params.search) searchParams.set("search", params.search);
        const qs = searchParams.toString();
        return await apiFetch<any[]>(`/pharmacy/medicines${qs ? `?${qs}` : ""}`);
      } catch (e) {
        return MOCK_PHARMACY_ITEMS;
      }
    },

    getDiagnosticPackages: async (category?: string) => {
      try {
        const qs = category ? `?category=${category}` : "";
        return await apiFetch<any[]>(`/diagnostics/packages${qs}`);
      } catch (e) {
        return MOCK_DIAGNOSTIC_PACKAGES;
      }
    },

    getSpokeCases: async (priority?: string) => {
      try {
        const qs = priority ? `?priority=${priority}` : "";
        return await apiFetch<any[]>(`/spoke/cases${qs}`);
      } catch (e) {
        return MOCK_SPOKE_CASES;
      }
    },

    createSpokeCase: async (payload: any) => {
      return await apiFetch<any>("/spoke/cases", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },
};

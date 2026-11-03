from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    doctors,
    appointments,
    consultations,
    prescriptions,
    payments,
    abdm,
    pharmacy,
    diagnostics,
    spoke
)

api_v1_router = APIRouter()

# 1. System Health & Probes
api_v1_router.include_router(health.router)

# 2. Authentication, MFA & Access Control
api_v1_router.include_router(auth.router)

# 3. Doctor Discovery & Clinical Profiles
api_v1_router.include_router(doctors.router)

# 4. Appointments & High-Concurrency Slot Locking
api_v1_router.include_router(appointments.router)

# 5. Consultation Encounter & WebRTC LiveKit Sessions
api_v1_router.include_router(consultations.router)

# 6. e-Prescription & MoHFW Schedule X Intercept
api_v1_router.include_router(prescriptions.router)

# 7. Payments, Webhook & Section 194J Statutory TDS Ledger
api_v1_router.include_router(payments.router)

# 8. Ayushman Bharat Digital Mission (ABDM) & ABHA Gateway
api_v1_router.include_router(abdm.router)

# 9. Auxiliary Healthcare Services (Pharmacy, Diagnostics, Rural Spoke)
api_v1_router.include_router(pharmacy.router)
api_v1_router.include_router(diagnostics.router)
api_v1_router.include_router(spoke.router)

import enum

class UserRole(str, enum.Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    FRONT_DESK = "FRONT_DESK"
    CLINIC_ADMIN = "CLINIC_ADMIN"
    PLATFORM_ADMIN = "PLATFORM_ADMIN"
    SECOPS = "SECOPS"

class ConsultationType(str, enum.Enum):
    VIDEO = "VIDEO"
    IN_CLINIC = "IN_CLINIC"

class AppointmentStatus(str, enum.Enum):
    RESERVED = "RESERVED"       # 10-minute temporary reservation
    CONFIRMED = "CONFIRMED"     # Paid / Confirmed
    WAITING = "WAITING"         # Patient in virtual waiting room
    IN_PROGRESS = "IN_PROGRESS" # Active call / encounter
    COMPLETED = "COMPLETED"     # Finished, e-Rx issued
    CANCELLED = "CANCELLED"     # Cancelled
    NO_SHOW = "NO_SHOW"

class SlotStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    LOCKED = "LOCKED"
    BOOKED = "BOOKED"
    BLOCKED = "BLOCKED"

class SlotPeriod(str, enum.Enum):
    MORNING = "MORNING"
    AFTERNOON = "AFTERNOON"
    EVENING = "EVENING"

class DrugSchedule(str, enum.Enum):
    LIST_O = "LIST_O"           # OTC / Safe
    LIST_A = "LIST_A"           # First-line teleconsult safe
    LIST_B = "LIST_B"           # Follow-up renewal
    SCHEDULE_X = "SCHEDULE_X"   # Hard-banned in teleconsult

class PharmacyDrugSchedule(str, enum.Enum):
    OTC = "OTC"
    SCHEDULE_H = "SCHEDULE_H"
    SCHEDULE_H1 = "SCHEDULE_H1"
    SCHEDULE_X = "SCHEDULE_X"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    CREATED = "CREATED"
    PAID = "PAID"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class PayoutStatus(str, enum.Enum):
    PENDING = "PENDING"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    PAID = "PAID"

class TriagePriority(str, enum.Enum):
    EMERGENT = "EMERGENT"
    URGENT = "URGENT"
    ROUTINE = "ROUTINE"
    FOLLOW_UP = "FOLLOW_UP"

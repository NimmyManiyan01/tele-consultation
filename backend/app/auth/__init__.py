from app.auth.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
    verify_totp_code
)
from app.auth.dependencies import (
    get_current_user,
    require_roles,
    get_current_doctor,
    get_current_patient
)
from app.auth.otp import (
    generate_and_dispatch_otp,
    verify_otp,
    normalize_phone
)

__all__ = [
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "decode_access_token",
    "verify_totp_code",
    "get_current_user",
    "require_roles",
    "get_current_doctor",
    "get_current_patient",
    "generate_and_dispatch_otp",
    "verify_otp",
    "normalize_phone",
]


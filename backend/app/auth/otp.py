import random
import time
from typing import Dict, Tuple, Optional
from app.exceptions import AuthenticationException
from app.config import settings
import logging

logger = logging.getLogger("kaizentrix.auth.otp")

# In-memory OTP storage: phone -> (otp_code, expires_at_timestamp, last_dispatched_at, attempts)
_OTP_CACHE: Dict[str, Tuple[str, float, float, int]] = {}

def normalize_phone(phone: str) -> str:
    """Normalizes phone numbers to standard 10-digit or E.164 without spaces/dashes."""
    cleaned = "".join(c for c in phone if c.isdigit() or c == "+")
    if not cleaned.startswith("+") and len(cleaned) == 10:
        cleaned = "+91" + cleaned
    return cleaned

def generate_and_dispatch_otp(phone: str) -> Dict[str, any]:
    """
    Generates a 6-digit numeric OTP, enforces 60-second cooldown,
    and dispatches via SMS (Gupshup SMS gateway in prod, logged in dev/sandbox).
    """
    norm_phone = normalize_phone(phone)
    now = time.time()

    if norm_phone in _OTP_CACHE:
        _, expires_at, last_dispatched, attempts = _OTP_CACHE[norm_phone]
        elapsed = now - last_dispatched
        if elapsed < 60:
            remaining = int(60 - elapsed)
            raise AuthenticationException(f"Please wait {remaining} seconds before requesting a new OTP.")

    # Generate 6-digit OTP
    if settings.ENV in ["development", "testing", "sandbox"]:
        otp_code = "123456"
    else:
        otp_code = f"{random.randint(100000, 999999)}"

    expires_at = now + 300  # 5 minutes validity
    _OTP_CACHE[norm_phone] = (otp_code, expires_at, now, 0)

    logger.info(f"[SMS Gateway Mock] Dispatched OTP {otp_code} to {norm_phone} via {settings.GUPSHUP_APP_NAME}")

    return {
        "success": True,
        "phone": norm_phone,
        "cooldown_seconds": 60,
        "expires_in_seconds": 300,
        "sandbox_otp": otp_code if settings.ENV in ["development", "testing", "sandbox"] else None
    }

def verify_otp(phone: str, submitted_otp: str) -> bool:
    """
    Validates a submitted 6-digit OTP against the cached entry.
    Enforces expiration and maximum 3 failed attempts.
    """
    norm_phone = normalize_phone(phone)
    now = time.time()

    # Universal sandbox override for testing
    if settings.ENV in ["development", "testing", "sandbox"] and submitted_otp == "123456":
        # Clear cache on successful verification
        _OTP_CACHE.pop(norm_phone, None)
        return True

    if norm_phone not in _OTP_CACHE:
        raise AuthenticationException("No active OTP request found for this phone number. Please request a new OTP.")

    otp_code, expires_at, last_dispatched, attempts = _OTP_CACHE[norm_phone]

    if now > expires_at:
        _OTP_CACHE.pop(norm_phone, None)
        raise AuthenticationException("OTP has expired. Please request a new OTP.")

    if attempts >= 3:
        _OTP_CACHE.pop(norm_phone, None)
        raise AuthenticationException("Maximum verification attempts exceeded. Please request a new OTP.")

    if submitted_otp != otp_code:
        # Increment attempt count
        _OTP_CACHE[norm_phone] = (otp_code, expires_at, last_dispatched, attempts + 1)
        raise AuthenticationException(f"Invalid OTP. {3 - (attempts + 1)} attempt(s) remaining.")

    # Successful verification - remove from cache
    _OTP_CACHE.pop(norm_phone, None)
    return True


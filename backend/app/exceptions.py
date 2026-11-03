from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.logging import correlation_id_ctx, logger

class KaizentrixException(Exception):
    def __init__(self, message: str, error_code: str = "INTERNAL_SERVER_ERROR", status_code: int = 500, details: dict = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

class ClinicalSafetyException(KaizentrixException):
    def __init__(self, message: str, details: dict = None):
        super().__init__(
            message=message,
            error_code="CLINICAL_SAFETY_INTERCEPT",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class ScheduleXRestrictionException(ClinicalSafetyException):
    def __init__(self, drug_name: str):
        super().__init__(
            message=f"Prescription of Schedule X substance '{drug_name}' is strictly prohibited via teleconsultation under MoHFW Telemedicine Practice Guidelines (2020).",
            details={"prohibited_drug": drug_name, "regulatory_statute": "Drugs & Cosmetics Act 1940 / MoHFW 2020"}
        )

class SlotConcurrencyException(KaizentrixException):
    def __init__(self, message: str = "Appointment slot was acquired by another request. Zero double-booking enforced."):
        super().__init__(
            message=message,
            error_code="SLOT_CONCURRENCY_LOCKED",
            status_code=status.HTTP_409_CONFLICT
        )

class ResourceNotFoundException(KaizentrixException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} with identifier '{identifier}' was not found.",
            error_code="RESOURCE_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )

class AuthenticationException(KaizentrixException):
    def __init__(self, message: str = "Invalid credentials or expired session."):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_FAILED",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class AuthorizationException(KaizentrixException):
    def __init__(self, message: str = "Access forbidden. Required permissions not granted."):
        super().__init__(
            message=message,
            error_code="PERMISSION_DENIED",
            status_code=status.HTTP_403_FORBIDDEN
        )

async def kaizentrix_exception_handler(request: Request, exc: KaizentrixException) -> JSONResponse:
    corr_id = correlation_id_ctx.get() or "unknown"
    logger.warning(f"Domain exception: {exc.error_code} - {exc.message} [corr_id={corr_id}]")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.error_code,
            "message": exc.message,
            "correlation_id": corr_id,
            "details": exc.details
        }
    )

async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    corr_id = correlation_id_ctx.get() or "unknown"
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {str(exc)} [corr_id={corr_id}]", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Please contact Kaizentrix support with the correlation ID.",
            "correlation_id": corr_id
        }
    )


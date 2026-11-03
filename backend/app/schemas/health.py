from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class HealthCheckResponse(BaseModel):
    status: str = Field(default="healthy", description="healthy | degraded | unhealthy")
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    database_connected: bool
    redis_connected: bool
    services: Dict[str, str] = Field(
        default_factory=lambda: {
            "auth_service": "online",
            "appointment_service": "online",
            "consultation_service": "online",
            "prescription_service": "online",
            "payment_service": "online",
            "abdm_service": "online",
            "notification_service": "online"
        }
    )

class ProbeResponse(BaseModel):
    status: str = "ok"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

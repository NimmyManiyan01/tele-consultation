import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

    # Core Application Configuration
    APP_NAME: str = "Kaizentrix Enterprise Teleconsultation Platform"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENV: str = Field(default="development", description="development | staging | production")

    # Server Host & Port
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Allowed Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "https://telehealth.kaizentrix.com"
    ]

    # Database Configuration (PostgreSQL 16 in Prod / SQLite+aiosqlite in Dev)
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./kaizentrix.db",
        description="Async database connection string"
    )
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # Distributed Mutex & Redis (Redlock Concurrency Engine)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MOCK_FALLBACK: bool = True

    # Security & Cryptography
    SECRET_KEY: str = Field(
        default="kgs_dev_secret_key_change_in_production_f7a29e1c4b8d",
        description="JWT signature secret"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    TOTP_ISSUER: str = "Kaizentrix Health"

    # Clinical Safety & MoHFW Constraints
    SCHEDULE_X_ENFORCEMENT: bool = True
    EMERGENCY_INTERCEPT_ACTIVE: bool = True
    STATUTORY_RETENTION_YEARS: int = 3

    # Third-Party External Integrations (Sandbox / Mock mode enabled by default)
    LIVEKIT_URL: str = "https://livekit.kaizentrix.local"
    LIVEKIT_API_KEY: str = "devkey"
    LIVEKIT_API_SECRET: str = "devsecret_mock_livekit_signature"

    RAZORPAY_KEY_ID: str = "rzp_test_kaizentrix_mock"
    RAZORPAY_KEY_SECRET: str = "rzp_secret_kaizentrix_mock"

    GUPSHUP_API_KEY: str = "mock_gupshup_api_key"
    GUPSHUP_APP_NAME: str = "KaizentrixTelehealth"

    ABDM_CLIENT_ID: str = "mock_abdm_client_id"
    ABDM_CLIENT_SECRET: str = "mock_abdm_client_secret"
    ABDM_BASE_URL: str = "https://dev.abdm.gov.in/gateway"

settings = Settings()


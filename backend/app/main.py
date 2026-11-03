import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.logging import setup_logging, correlation_id_ctx, logger
from app.database import init_db, engine
from app.exceptions import (
    KaizentrixException, 
    kaizentrix_exception_handler, 
    generic_exception_handler
)
from app.api.v1.router import api_v1_router
from app.api.v1.endpoints import health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Lifecycle
    setup_logging(settings.DEBUG)
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENV}]")
    await init_db()
    yield
    # Shutdown Lifecycle
    logger.info("Shutting down backend database connections...")
    await engine.dispose()
    logger.info("Application shutdown complete.")

app = FastAPI(
    title="Kaizentrix Enterprise Teleconsultation Platform API",
    description="""
## Enterprise Healthcare Backend & Teleconsultation Services
Conforming to:
- **MoHFW Telemedicine Practice Guidelines (2020)**
- **Digital Personal Data Protection (DPDP) Act (2023)**
- **Ayushman Bharat Digital Mission (ABDM M1/M2/M3)**
- **HL7® FHIR® Release 4 Clinical Specifications**
- **OpenAPI 3.1 Contract-First Architecture**
    """,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-ID", "Content-Disposition"]
)

# 2. Request Correlation ID & Latency Tracking Middleware
@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    corr_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    token = correlation_id_ctx.set(corr_id)
    start_time = time.perf_counter()

    try:
        response = await call_next(request)
        latency_ms = (time.perf_counter() - start_time) * 1000
        response.headers["X-Correlation-ID"] = corr_id
        response.headers["X-Response-Time-Ms"] = f"{latency_ms:.2f}"
        
        # Log non-healthcheck requests
        if not request.url.path.endswith(("/live", "/ready", "/health")):
            logger.info(
                f"{request.method} {request.url.path} -> {response.status_code} ({latency_ms:.2f}ms)"
            )
        return response
    finally:
        correlation_id_ctx.reset(token)

# 3. Centralized Exception Handlers Registration
app.add_exception_handler(KaizentrixException, kaizentrix_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# 4. Mount Master API Routers
app.include_router(health.router)  # Direct root /health, /health/live, /health/ready
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root_status():
    return {
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_PREFIX
    }


import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.models.core import User
from app.logging import correlation_id_ctx

logger = logging.getLogger("kaizentrix.audit")

async def record_audit_event(
    db: AsyncSession,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    user: Optional[User] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    """
    Persists immutable statutory audit trail entry in compliance with DPDP Act 2023 §8
    and MoHFW Telemedicine Guidelines for electronic health record access and mutations.
    """
    try:
        log_entry = AuditLog(
            user_id=user.id if user else None,
            user_role=user.role.value if user and hasattr(user, "role") and user.role else None,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id_ctx.get(),
            details=details or {}
        )
        db.add(log_entry)
        logger.info(f"[AUDIT] action={action} resource={resource_type}:{resource_id} user={getattr(user, 'id', 'anonymous')}")
        return log_entry
    except Exception as e:
        logger.error(f"Failed to record audit event: {str(e)}")
        return None


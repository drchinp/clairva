"""
File: app/security/audit_logger.py

Purpose:
Centralized audit logging for AI usage.
"""

import datetime
from app.utils.logger import get_logger

logger = get_logger(__name__)


def log_ai_usage(
    agent_id: str,
    provider: str,
    model: str,
    tokens: int,
    cost: float
):

    timestamp = datetime.datetime.utcnow().isoformat()

    logger.info(
        f"AI_USAGE | agent={agent_id} | provider={provider} | "
        f"model={model} | tokens={tokens} | cost={cost:.6f} | "
        f"timestamp={timestamp}"
    )
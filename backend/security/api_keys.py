"""
File: app/security/api_keys.py

Purpose:
API key authentication for Clairva platform.

Used to protect agent invocation endpoints.
"""

import os
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from app.utils.logger import get_logger

logger = get_logger(__name__)

API_KEY_HEADER = "X-API-Key"

api_key_header = APIKeyHeader(name=API_KEY_HEADER, auto_error=False)

# Allowed API keys (can move to DB later)
VALID_API_KEYS = set(
    os.getenv("CLAIRVA_API_KEYS", "").split(",")
)


def verify_api_key(api_key: str = Security(api_key_header)):

    if not api_key:
        logger.warning("Missing API key")
        raise HTTPException(status_code=401, detail="API key missing")

    if api_key not in VALID_API_KEYS:
        logger.warning("Invalid API key attempt")
        raise HTTPException(status_code=403, detail="Invalid API key")

    logger.info("API key verified")

    return api_key

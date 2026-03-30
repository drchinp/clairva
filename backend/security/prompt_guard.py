"""
File: app/security/prompt_guard.py

Purpose:
Protect agents from prompt injection attacks.
"""

from app.utils.logger import get_logger

logger = get_logger(__name__)


BLOCKED_PATTERNS = [
    "ignore previous instructions",
    "reveal system prompt",
    "bypass safety",
    "execute hidden tool",
    "delete database",
    "override system"
]


def validate_prompt(text: str):

    if not text:
        return text

    lower_text = text.lower()

    for pattern in BLOCKED_PATTERNS:

        if pattern in lower_text:

            logger.warning(
                f"PromptGuard blocked injection attempt: {pattern}"
            )

            raise Exception("Prompt blocked by security policy")

    return text
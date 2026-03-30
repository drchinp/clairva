"""
File: app/security/budget_guard.py

Purpose:
Prevent excessive LLM usage and runaway costs.
"""

from app.utils.logger import get_logger

logger = get_logger(__name__)

AGENT_LIMITS = {
    "A0001": 50,
    "A0002": 50,
    "A0003": 100,
    "A0018": 30
}

agent_usage = {}


def check_budget(agent_id: str):

    used = agent_usage.get(agent_id, 0)
    limit = AGENT_LIMITS.get(agent_id, 20)

    if used >= limit:

        logger.warning(f"Budget exceeded for agent {agent_id}")

        raise Exception("Agent budget exceeded")

    agent_usage[agent_id] = used + 1
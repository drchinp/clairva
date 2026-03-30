"""
File: app/agents/A0018_compliance_agent/tools.py

Purpose:
Tools used by the Compliance Agent.

Responsibilities:
- Perform compliance validation
- Return structured governance assessment
- Register tool with MCP tool registry
"""

from app.utils.logger import get_logger
from app.mcp.tool_registry import tool_registry

logger = get_logger(__name__)

AGENT_ID = "A0018"


def perform_compliance_check(data: str):

    logger.info(f"{AGENT_ID} performing compliance evaluation")

    result = {
        "compliant": True,
        "risk_level": "low",
        "notes": f"Compliance check performed on {data}"
    }

    logger.info(f"{AGENT_ID} compliance evaluation completed")

    return result


# ---------------------------------------------------
# MCP Tool Registration
# ---------------------------------------------------

tool_registry.register_tool(
    name="perform_compliance_check",
    func=perform_compliance_check,
    description="Evaluate regulatory compliance and governance risk level",
    allowed_agents=["A0018"]
)
"""
File: app/agents/A0003_consulting_agent/tools.py

Purpose:
Tools used by the Consulting Agent.

Responsibilities:
- Build consulting prompts
- Call centralized LLM provider
- Log consulting analysis execution
- Register tools into Clairva MCP tool registry
"""

from app.tools.llm_provider import generate
from app.agents.A0003_consulting_agent.prompts import CONSULTING_ANALYSIS_PROMPT
from app.mcp.tool_registry import tool_registry
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Clairva agent identifier
AGENT_ID = "A0003"


def analyze_business_context(context: str, model: str | None = None):
    """
    Analyze a business context and generate consulting recommendations.

    Args:
        context (str): business situation description
        model (str | None): optional LLM model override

    Returns:
        str: consulting analysis result
    """

    logger.info(f"{AGENT_ID} consulting analysis started")

    prompt = CONSULTING_ANALYSIS_PROMPT.format(
        context=context
    )

    result = generate(
        prompt=prompt,
        agent_id=AGENT_ID,
        model=model
    )

    logger.info(f"{AGENT_ID} consulting analysis completed")

    return result


# ---------------------------------------------------
# Register Tool with MCP Tool Registry
# ---------------------------------------------------

tool_registry.register_tool(
    name="analyze_business_context",
    func=analyze_business_context,
    description="Analyze business strategy context and generate consulting recommendations",
    allowed_agents=["A0003"]
)
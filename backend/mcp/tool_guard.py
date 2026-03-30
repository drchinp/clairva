"""
File: app/mcp/tool_guard.py

Purpose:
Security guard for MCP tool execution.

Responsibilities:
- Verify tool exists
- Verify agent permission
- Prevent hallucinated tools
"""

from app.mcp.tool_registry import tool_registry
from app.utils.logger import get_logger

logger = get_logger(__name__)


def validate_tool_access(agent_id: str, tool_name: str):

    tools = tool_registry._tools

    if tool_name not in tools:

        logger.warning(
            f"ToolGuard blocked hallucinated tool: {tool_name}"
        )

        raise Exception(f"Tool not registered: {tool_name}")

    tool_meta = tools[tool_name]

    allowed_agents = tool_meta.get("allowed_agents")

    if allowed_agents and agent_id not in allowed_agents:

        logger.warning(
            f"ToolGuard blocked unauthorized access | agent={agent_id} tool={tool_name}"
        )

        raise Exception(
            f"Agent {agent_id} not allowed to use tool {tool_name}"
        )

    logger.info(
        f"ToolGuard allowed tool execution | agent={agent_id} tool={tool_name}"
    )
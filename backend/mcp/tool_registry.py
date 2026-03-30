"""
File: app/mcp/tool_registry.py

Purpose:
Central registry for all tools available to Clairva agents.

Supports:
- tool metadata
- descriptions for tool planner
- agent access control
"""

from typing import Dict, Callable, Optional, List
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ToolRegistry:

    def __init__(self):

        self._tools: Dict[str, Dict] = {}

        logger.info("ToolRegistry initialized")

    def register_tool(
        self,
        name: str,
        func: Callable,
        description: Optional[str] = None,
        allowed_agents: Optional[List[str]] = None
    ):
        """
        Register a tool in the MCP registry.
        """

        if name in self._tools:
            raise ValueError(f"Tool already registered: {name}")

        self._tools[name] = {
            "func": func,
            "description": description or "",
            "allowed_agents": allowed_agents or []
        }

        logger.info(f"Tool registered: {name}")

    def get_tool(self, name: str):

        tool = self._tools.get(name)

        if not tool:
            raise ValueError(f"Tool not found: {name}")

        return tool["func"]

    def get_tool_metadata(self, name: str):

        tool = self._tools.get(name)

        if not tool:
            raise ValueError(f"Tool not found: {name}")

        return tool

    def list_tools(self):

        return list(self._tools.keys())

    def list_tool_descriptions(self):

        return {
            name: meta["description"]
            for name, meta in self._tools.items()
        }

    def is_tool_allowed(self, agent_id: str, tool_name: str):

        tool = self._tools.get(tool_name)

        if not tool:
            return False

        allowed_agents = tool["allowed_agents"]

        if not allowed_agents:
            return True

        return agent_id in allowed_agents


tool_registry = ToolRegistry()

from app.mcp.register_tools import register_all_tools
register_all_tools()
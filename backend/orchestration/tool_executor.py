"""
File: app/orchestration/tool_executor.py

Purpose:
Execute tools requested by LLM automatically.
"""

import json
from app.mcp.tool_registry import tool_registry
from app.utils.logger import get_logger

logger = get_logger(__name__)


def execute_tool_call(tool_name: str, tool_args: dict):

    logger.info(f"Executing tool: {tool_name}")

    tool = tool_registry.get_tool(tool_name)

    result = tool(**tool_args)

    logger.info(f"Tool executed successfully: {tool_name}")

    return result
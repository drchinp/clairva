"""
File: app/mcp/tool_executor.py

Purpose:
Execute MCP tools with safe argument handling
and execution tracing.
"""

import time
from app.mcp.tool_registry import tool_registry
from app.mcp.tool_guard import validate_tool_access
from app.database.tool_log_service import log_tool_execution
from app.utils.logger import get_logger

logger = get_logger(__name__)


def execute_tool(agent_id: str, tool_name: str, arguments: dict):

    logger.info(
        f"Executing tool | agent={agent_id} tool={tool_name}"
    )

    # --------------------------------
    # ToolGuard security validation
    # --------------------------------

    validate_tool_access(agent_id, tool_name)

    tool = tool_registry.get_tool(tool_name)

    # --------------------------------
    # Handle empty arguments
    # --------------------------------

    if not arguments:
        arguments = {}

    start_time = time.time()

    try:

        result = tool(**arguments)

    except TypeError:

        logger.warning(
            f"Tool {tool_name} missing arguments — using fallback injection"
        )

        if "document" in arguments:
            result = tool(arguments["document"])

        elif "data" in arguments:
            result = tool(arguments["data"])

        else:
            result = tool(list(arguments.values())[0]) if arguments else None

    end_time = time.time()

    execution_time_ms = int((end_time - start_time) * 1000)

    # --------------------------------
    # Log execution
    # --------------------------------

    try:

        log_tool_execution(
            agent_id=agent_id,
            tool_name=tool_name,
            arguments=arguments,
            result=result,
            execution_time_ms=execution_time_ms
        )

    except Exception as e:

        logger.warning(f"Tool execution log failed: {e}")

    return result
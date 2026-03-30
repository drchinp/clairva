"""
File: app/mcp/tool_planner.py

Purpose:
LLM-based planner that selects tools automatically
using tool descriptions from the MCP registry.
"""

import json
from app.tools.llm_provider import generate
from app.mcp.tool_registry import tool_registry
from app.utils.logger import get_logger

logger = get_logger(__name__)


def plan_tool_usage(query: str, agent_id: str):

    # --------------------------------
    # Get tools allowed for this agent
    # --------------------------------

    tools = []

    for name in tool_registry.list_tools():

        meta = tool_registry.get_tool_metadata(name)

        allowed_agents = meta.get("allowed_agents")

        if not allowed_agents or agent_id in allowed_agents:

            tools.append({
                "name": name,
                "description": meta.get("description", "")
            })

    # --------------------------------
    # Build readable tool list
    # --------------------------------

    tool_descriptions = "\n".join(
        [f"{t['name']} → {t['description']}" for t in tools]
    )

    prompt = f"""
    You are an AI tool planner.

    User request:
    {query}

    Available tools you can choose from:

    {tool_descriptions}

    Rules:
    1. Only choose a tool from the list above.
    2. If no tool is needed, return tool=null.
    3. Never invent a tool name.

    Return JSON only.

    Examples:

    No tool needed:
    {{
    "tool": null,
    "arguments": {{}}
    }}

    Tool needed:
    {{
    "tool": "rag_search",
    "arguments": {{"query": "example"}}
    }}

Return ONLY valid JSON.
"""

    response = generate(prompt, agent_id="tool_planner")

    try:

        result = json.loads(response)

    except Exception as e:

        logger.warning("Tool planner failed to parse JSON")

        return {"tool": None}

    # --------------------------------
    # Validate tool exists
    # --------------------------------

    tool_name = result.get("tool")

    if tool_name and tool_name not in tool_registry.list_tools():

        logger.warning(f"Planner returned unknown tool: {tool_name}")

        return {"tool": None}

    return result
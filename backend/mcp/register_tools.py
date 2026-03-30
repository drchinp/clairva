"""
File: app/mcp/register_tools.py

Purpose:
Register all tools available to Clairva agents.
"""

from app.mcp.tool_registry import tool_registry
from app.knowledge.rag_engine import rag_engine
from app.utils.logger import get_logger

logger = get_logger(__name__)


def register_all_tools():

    logger.info("Registering MCP tools")

    # --------------------------------
    # RAG Search Tool
    # --------------------------------

    if "rag_search" not in tool_registry.list_tools():

        tool_registry.register_tool(
            name="rag_search",
            func=rag_engine.search,
            description="Search Clairva knowledge base using hybrid semantic and keyword retrieval",
            allowed_agents=["A0003"]
        )

        logger.info("Tool registered: rag_search")

    else:

        logger.info("Tool rag_search already registered")

    logger.info("All MCP tools registered")
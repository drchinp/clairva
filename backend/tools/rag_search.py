"""
File: app/tools/rag_search.py

Purpose:
RAG search tool for Clairva agents.

Responsibilities:
- Query vector knowledge base
- Retrieve relevant documents
- Return context for LLM reasoning
"""

from app.knowledge.rag_engine import rag_engine
from app.mcp.tool_registry import tool_registry
from app.utils.logger import get_logger

logger = get_logger(__name__)


def rag_search(query: str, top_k: int = 5):
    """
    Search the internal Clairva knowledge base using hybrid search.

    Args:
        query (str): search query
        top_k (int): number of results

    Returns:
        list: relevant documents
    """

    logger.info(f"RAG search started | query={query}")

    try:

        results = rag_engine.search(
            query=query,
            top_k=top_k
        )

        logger.info(
            f"RAG search completed | results={len(results)}"
        )

        return results

    except Exception as e:

        logger.error(f"RAG search failed: {str(e)}")

        return []


# Register tool
tool_registry.register_tool(
    name="rag_search",
    func=rag_search,
    description="Search Clairva internal knowledge base using hybrid vector + keyword retrieval"
)
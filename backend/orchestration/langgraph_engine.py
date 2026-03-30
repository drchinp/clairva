"""
File: app/orchestration/langgraph_engine.py

Purpose:
LangGraph-style execution engine for Clairva multi-agent workflows.
Responsible for orchestrating agent nodes and execution flow.
"""

from typing import Callable, Dict, Any

from app.utils.logger import get_logger
from app.mcp.register_tools import register_all_tools

logger = get_logger(__name__)


class LangGraphEngine:

    def __init__(self):

        logger.info("LangGraphEngine initializing")

        # Register MCP tools once at engine startup
        register_all_tools()

        self.nodes: Dict[str, Callable] = {}
        self.edges: Dict[str, str] = {}

        logger.info("LangGraphEngine initialized")

    # -----------------------------
    # Register node
    # -----------------------------

    def add_node(self, name: str, func: Callable):

        logger.info(f"LangGraph node registered: {name}")

        self.nodes[name] = func

    # -----------------------------
    # Register edge
    # -----------------------------

    def add_edge(self, from_node: str, to_node: str):

        logger.info(f"LangGraph edge registered: {from_node} -> {to_node}")

        self.edges[from_node] = to_node

    # -----------------------------
    # Execute graph
    # -----------------------------

    def run(self, start_node: str, state: Dict[str, Any]):

        logger.info(f"LangGraph execution started | start_node={start_node}")

        current = start_node
        trace = []

        while current:

            logger.info(f"Executing node: {current}")

            node = self.nodes.get(current)

            if not node:
                raise Exception(f"LangGraph node not found: {current}")

            try:

                state = node(state)

            except Exception as e:

                logger.error(f"Node execution failed: {current} | error={e}")
                raise

            trace.append(current)

            current = self.edges.get(current)

        logger.info("LangGraph execution completed")

        return {
            "trace": trace,
            "state": state
        }
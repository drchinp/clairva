"""
File: app/registry/agent_registry.py

Purpose:
Centralized registry for managing Clairva AI agents.

Responsibilities:
- register agents safely
- retrieve agents
- list available agents
- prevent duplicate registration

This registry acts as the single source of truth
for all available agents within the Clairva platform.
"""

from typing import Dict, Any
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AgentRegistry:
    """
    Registry responsible for storing and managing
    all registered Clairva agents.
    """

    def __init__(self):

        # Internal agent storage
        self._agents: Dict[str, Any] = {}

        logger.info("AgentRegistry initialized")

    def register_agent(self, agent_id: str, agent_instance: Any):
        """
        Register a new AI agent.

        Args:
            agent_id: Unique agent identifier (e.g. A0001)
            agent_instance: Agent class instance
        """

        if agent_id in self._agents:
            logger.error(f"Agent already registered: {agent_id}")
            raise ValueError(f"Agent already registered: {agent_id}")

        self._agents[agent_id] = agent_instance

        logger.info(f"Agent registered successfully: {agent_id}")

    def get_agent(self, agent_id: str):
        """
        Retrieve an agent instance.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent instance
        """

        agent = self._agents.get(agent_id)

        if not agent:
            logger.error(f"Agent not found: {agent_id}")
            raise ValueError(f"Agent not found: {agent_id}")

        logger.info(f"Agent retrieved: {agent_id}")

        return agent

    def list_agents(self):
        """
        Return list of registered agents.
        """

        logger.info("Listing all registered agents")

        return list(self._agents.keys())

    def agent_exists(self, agent_id: str) -> bool:
        """
        Check if an agent exists.
        """

        return agent_id in self._agents


# Global singleton registry
agent_registry = AgentRegistry()
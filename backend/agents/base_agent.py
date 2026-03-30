"""
File: app/agents/base_agent.py

Purpose:
Base class for all Clairva agents.

This ensures:
- consistent agent interface
- centralized logging
- standardized execution flow
"""

from abc import ABC, abstractmethod
from app.utils.logger import get_logger

logger = get_logger(__name__)


class BaseAgent(ABC):

    def __init__(self, agent_id: str, agent_name: str):
        self.agent_id = agent_id
        self.agent_name = agent_name

    @abstractmethod
    def run(self, input_data: dict):
        """
        Execute the agent task.

        Must be implemented by all agents.
        """
        pass

    def log_start(self, input_data):
        logger.info(f"Agent {self.agent_id} started with input: {input_data}")

    def log_finish(self, result):
        logger.info(f"Agent {self.agent_id} finished with result: {result}")
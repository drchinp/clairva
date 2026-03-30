"""
File: app/registry/load_agents.py

Purpose:
Load and register all Clairva agents during application startup.
"""

from app.registry.agent_registry import agent_registry
from app.utils.logger import get_logger

# Import agents
from app.agents.A0001_document_agent.agent import DocumentAgent
from app.agents.A0002_reporting_agent.agent import ReportingAgent
from app.agents.A0003_consulting_agent.agent import ConsultingAgent
from app.agents.A0018_compliance_agent.agent import ComplianceAgent

logger = get_logger(__name__)


def load_agents():
    """
    Register all Clairva agents.
    """

    logger.info("Loading Clairva agents")

    agent_registry.register_agent("A0001", DocumentAgent())
    agent_registry.register_agent("A0002", ReportingAgent())
    agent_registry.register_agent("A0003", ConsultingAgent())
    agent_registry.register_agent("A0018", ComplianceAgent())

    logger.info("All agents successfully registered")
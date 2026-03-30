"""
File: app/orchestration/agent_router.py

Purpose:
Routes incoming requests to the appropriate Clairva AI agent.

Responsibilities:
- validate requested agent
- retrieve agent instance from registry
- execute agent
- log execution lifecycle
- return results

This router is the orchestration layer between
the API gateway and individual agents.
"""

from app.registry.agent_registry import agent_registry
from app.utils.logger import get_logger

# NEW: Supervisor integration
from app.agents.A0000_supervisor_agent.agent import SupervisorAgent

logger = get_logger(__name__)

# ------------------------------------------------
# Supervisor Instance
# ------------------------------------------------

supervisor = SupervisorAgent()


# ------------------------------------------------
# Direct Agent Routing (Existing Logic - Unchanged)
# ------------------------------------------------

def route_agent(agent_id: str, input_data: dict):
    """
    Route request to the correct agent.

    Args:
        agent_id: Agent identifier (e.g. A0001)
        input_data: Input payload for agent execution

    Returns:
        Agent execution result
    """

    logger.info(f"Agent routing requested for agent: {agent_id}")

    try:

        # Check if agent exists
        if not agent_registry.agent_exists(agent_id):
            logger.error(f"Requested agent does not exist: {agent_id}")
            raise ValueError(f"Agent not registered: {agent_id}")

        # Retrieve agent
        agent = agent_registry.get_agent(agent_id)

        logger.info(f"Executing agent: {agent_id}")

        # Execute agent
        result = agent.run(input_data)

        logger.info(f"Agent execution completed: {agent_id}")

        return {
            "agent": agent_id,
            "status": "success",
            "result": result
        }

    except Exception as e:

        logger.exception(f"Agent execution failed for {agent_id}")

        return {
            "agent": agent_id,
            "status": "error",
            "message": str(e)
        }


# ------------------------------------------------
# NEW: Supervisor Routing
# ------------------------------------------------

def route_via_supervisor(request: str):
    """
    Route a request using the Supervisor Agent.

    The supervisor decides which agent should handle the task.
    """

    logger.info("Supervisor routing initiated")

    try:

        decision = supervisor.run({
            "request": request
        })

        selected_agent = decision.get("selected_agent")

        logger.info(f"Supervisor selected agent: {selected_agent}")

        # Map request to agent input format
        input_payload = {
            "context": request,
            "data": request,
            "document": request
        }

        # Use existing router
        return route_agent(selected_agent, input_payload)

    except Exception as e:

        logger.exception("Supervisor routing failed")

        return {
            "agent": "supervisor",
            "status": "error",
            "message": str(e)
        }
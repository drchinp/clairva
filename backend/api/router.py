"""
File: app/api/router.py

Purpose:
Main API router for Clairva agents.
"""

from fastapi import APIRouter
from app.api.schemas import AgentRequest

from app.orchestration.agent_router import (
    route_agent,
    route_via_supervisor
)

router = APIRouter()


# ------------------------------------------------
# Direct Agent Invocation
# ------------------------------------------------

@router.post("/invoke")
def invoke_agent(request: AgentRequest):

    result = route_agent(
        request.agent,
        request.input
    )

    return result


# ------------------------------------------------
# Supervisor Invocation
# ------------------------------------------------

@router.post("/supervisor")
def run_supervisor(request: str):

    return route_via_supervisor(request)
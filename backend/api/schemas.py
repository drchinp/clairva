"""
File: app/api/schemas.py

Purpose:
Central request and response schemas for Clairva Agents API.
"""

from pydantic import BaseModel
from typing import Dict, Optional


class AgentRequest(BaseModel):

    agent: str
    input: Dict


class AgentResponse(BaseModel):

    agent: str
    status: str
    result: Optional[Dict]
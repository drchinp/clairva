"""
File: app/agents/A0003_consulting_agent/schema.py

Purpose:
Input and output schema for Consulting Agent.
"""

from pydantic import BaseModel
from typing import Dict


class ConsultingAgentInput(BaseModel):

    context: str


class ConsultingAgentOutput(BaseModel):

    status: str
    analysis: Dict
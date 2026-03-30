"""
File: app/agents/A0018_compliance_agent/schema.py

Purpose:
Input and output schema for Compliance Agent.
"""

from pydantic import BaseModel
from typing import Dict


class ComplianceAgentInput(BaseModel):

    data: str


class ComplianceAgentOutput(BaseModel):

    status: str
    compliance_result: Dict
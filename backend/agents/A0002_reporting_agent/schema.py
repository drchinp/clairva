"""
File: app/agents/A0002_reporting_agent/schema.py

Purpose:
Input and output schema for Reporting Agent.
"""

from pydantic import BaseModel
from typing import Dict


class ReportingAgentInput(BaseModel):

    data: str


class ReportingAgentOutput(BaseModel):

    status: str
    summary: str
    kpis: Dict
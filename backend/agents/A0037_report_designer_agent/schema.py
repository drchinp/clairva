"""
File: app/agents/A0037_report_designer_agent/schema.py

Purpose:
Define input schema for the Report Designer Agent.
The agent converts consulting analysis into a structured
Gamma-style report layout.
"""

from pydantic import BaseModel


class ReportDesignerInput(BaseModel):

    analysis: str
    report_title: str | None = None
    report_type: str | None = "Consulting Report"
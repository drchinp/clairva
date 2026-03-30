"""
File: app/agents/A0038_report_renderer_agent/schema.py

Purpose:
Defines input schema for the Report Renderer Agent.
Receives structured layout from A0037 and produces
a rendered report.
"""

from pydantic import BaseModel


class ReportRendererInput(BaseModel):

    report_layout: dict
    output_format: str = "html"
"""
File: app/agents/A0038_report_renderer_agent/agent.py

Purpose:
Render structured report layout into final visual output.
"""

from app.agents.base_agent import BaseAgent
from app.agents.A0038_report_renderer_agent.schema import ReportRendererInput
from app.agents.A0038_report_renderer_agent.renderer import render_html

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ReportRendererAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0038",
            agent_name="Report Renderer Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        validated = ReportRendererInput(**input_data)

        layout = validated.report_layout

        html = render_html(layout)

        result = {

            "status": "success",
            "html_report": html

        }

        self.log_finish(result)

        return result
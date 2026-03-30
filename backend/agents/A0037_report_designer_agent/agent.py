"""
File: app/agents/A0037_report_designer_agent/agent.py

Purpose:
Report Designer Agent responsible for transforming
consulting analysis into a structured Gamma-style report layout.

Outputs structured blocks that can later be rendered
into PDF, HTML, or presentation format.
"""

from app.agents.base_agent import BaseAgent
from app.agents.A0037_report_designer_agent.schema import ReportDesignerInput
from app.agents.A0037_report_designer_agent.prompts import REPORT_DESIGN_PROMPT
from app.agents.A0037_report_designer_agent.tools import normalize_report_layout

from app.tools.llm_provider import generate
from app.utils.logger import get_logger

import json

logger = get_logger(__name__)


class ReportDesignerAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0037",
            agent_name="Report Designer Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        validated = ReportDesignerInput(**input_data)

        analysis = validated.analysis

        prompt = REPORT_DESIGN_PROMPT.format(
            analysis=analysis
        )

        logger.info("A0037 generating report layout")

        response = generate(
            prompt=prompt,
            agent_id=self.agent_id
        )

        try:

            layout = json.loads(response)

        except Exception:

            logger.warning("LLM returned non-JSON response")

            layout = {
                "sections": [
                    {
                        "type": "executive_summary",
                        "content": response
                    }
                ]
            }

        layout["sections"] = normalize_report_layout(
            layout.get("sections", [])
        )

        result = {

            "status": "success",
            "report_layout": layout

        }

        self.log_finish(result)

        return result
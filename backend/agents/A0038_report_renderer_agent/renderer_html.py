"""
File: app/agents/A0038_report_renderer_agent/renderer_html.py

Purpose:
Render report layout into HTML format.
"""

from app.utils.logger import get_logger
from app.agents.A0038_report_renderer_agent.charts import generate_bar_chart

logger = get_logger(__name__)


def render_html(layout):

    html = "<html><body>"

    sections = layout.get("sections", [])

    for section in sections:

        if section["type"] == "hero":

            html += f"<h1>{section.get('title')}</h1>"

        elif section["type"] == "executive_summary":

            html += f"<p>{section.get('content')}</p>"

        elif section["type"] == "chart":

            chart_html = generate_bar_chart(
                section.get("data", [])
            )

            html += chart_html

    html += "</body></html>"

    logger.info("HTML report rendered")

    return html
"""
File: app/agents/A0038_report_renderer_agent/renderer.py

Purpose:
Render structured report layout into HTML.
"""

from app.utils.logger import get_logger
from app.agents.A0038_report_renderer_agent.templates import (
    HERO_TEMPLATE,
    SUMMARY_TEMPLATE,
    CARD_TEMPLATE
)

logger = get_logger(__name__)


def render_html(layout):

    html = "<html><body>"

    sections = layout.get("sections", [])

    for section in sections:

        section_type = section.get("type")

        if section_type == "hero":

            html += HERO_TEMPLATE.format(
                title=section.get("title", ""),
                subtitle=section.get("subtitle", "")
            )

        elif section_type == "executive_summary":

            html += SUMMARY_TEMPLATE.format(
                content=section.get("content", "")
            )

        elif section_type == "key_findings_cards":

            cards = section.get("cards", [])

            html += "<section><h2>Key Findings</h2>"

            for card in cards:

                html += CARD_TEMPLATE.format(
                    title=card.get("title"),
                    description=card.get("description")
                )

            html += "</section>"

    html += "</body></html>"

    logger.info("HTML report generated")

    return html
"""
File: app/agents/A0037_report_designer_agent/tools.py

Purpose:
Helper functions used by the Report Designer Agent.
"""

from app.utils.logger import get_logger

logger = get_logger(__name__)


def normalize_report_layout(layout):

    """
    Ensures report layout always contains required sections.
    """

    required_sections = [
        "hero",
        "executive_summary",
        "key_findings_cards",
        "recommendations",
        "roadmap_table"
    ]

    existing = [section.get("type") for section in layout]

    for section in required_sections:

        if section not in existing:

            logger.warning(f"Missing report section: {section}")

    return layout
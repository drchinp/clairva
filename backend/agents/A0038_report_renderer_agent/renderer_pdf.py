"""
File: app/agents/A0038_report_renderer_agent/renderer_pdf.py

Purpose:
Convert HTML report into PDF.
"""

from weasyprint import HTML
from app.utils.logger import get_logger

logger = get_logger(__name__)


def render_pdf(html, output_path="report.pdf"):

    HTML(string=html).write_pdf(output_path)

    logger.info(f"PDF generated at {output_path}")

    return output_path
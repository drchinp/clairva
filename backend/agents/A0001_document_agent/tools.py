"""
File: app/agents/A0001_document_agent/tools.py

Purpose:
Tools used by the Document Verification Agent.
"""

from app.utils.logger import get_logger
from app.mcp.tool_registry import tool_registry

logger = get_logger(__name__)


def extract_text(document):

    logger.info("Extracting text from document")

    # placeholder for OCR
    extracted_text = f"Extracted content from {document}"

    return extracted_text

tool_registry.register_tool(
    name="extract_text",
    func=extract_text,
    description="Extract text from uploaded documents using OCR",
    allowed_agents=["A0001"]
)
"""
File: app/agents/A0002_reporting_agent/tools.py

Purpose:
Tools used by the Reporting & Analysis Agent.
"""

from app.utils.logger import get_logger
from app.mcp.tool_registry import tool_registry

logger = get_logger(__name__)


def summarize_data(data):

    logger.info("Summarizing data")

    # placeholder logic
    summary = f"Summary generated for: {data}"

    return summary


def extract_kpis(data):

    logger.info("Extracting KPIs")

    kpis = {
        "sample_metric": "value",
        "risk_score": "low"
    }

    return kpis

tool_registry.register_tool(
    name="summarize_data",
    func=summarize_data,
    description="Generate a structured summary of provided data or reports",
    allowed_agents=["A0002"]
)

tool_registry.register_tool(
    name="extract_kpis",
    func=extract_kpis,
    description="Extract key performance indicators and metrics from structured datasets",
    allowed_agents=["A0002"]
)
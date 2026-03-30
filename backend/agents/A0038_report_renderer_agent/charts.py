"""
File: app/agents/A0038_report_renderer_agent/charts.py

Purpose:
Generate charts used in Clairva reports.
Supports Plotly charts for visual insights.
"""

import plotly.graph_objects as go
from app.utils.logger import get_logger

logger = get_logger(__name__)


def generate_bar_chart(data):

    """
    Create bar chart from list of dicts.

    Example input:
    [
        {"label": "Governance", "score": 0.75},
        {"label": "Workers", "score": 2.3}
    ]
    """

    labels = [d["label"] for d in data]
    values = [d["score"] for d in data]

    fig = go.Figure(
        data=[
            go.Bar(
                x=labels,
                y=values
            )
        ]
    )

    fig.update_layout(
        title="ESG Performance",
        template="plotly_white"
    )

    logger.info("Plotly chart generated")

    return fig.to_html(full_html=False)
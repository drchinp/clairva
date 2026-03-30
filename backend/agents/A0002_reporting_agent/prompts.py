"""
File: app/agents/A0002_reporting_agent/prompts.py

Purpose:
Prompt templates used by the Reporting & Analysis Agent.
"""

REPORT_SUMMARY_PROMPT = """
You are an ESG reporting analyst.

Your task is to analyze the provided information and produce
a structured summary report.

Focus on:

1. Key insights
2. KPIs and metrics
3. risk indicators
4. recommendations

Data:
{data}

Return a structured response.
"""


KPI_EXTRACTION_PROMPT = """
Extract the key performance indicators from the following data.

Data:
{data}

Return a JSON structure of KPIs.
"""
"""
File: app/agents/A0018_compliance_agent/prompts.py

Purpose:
Prompt templates used by the Compliance Agent.
"""

COMPLIANCE_CHECK_PROMPT = """
You are a compliance auditor.

Review the following data and determine:

1. compliance status
2. potential violations
3. regulatory risks
4. recommended actions

Data:
{data}

Return a structured compliance assessment.
"""
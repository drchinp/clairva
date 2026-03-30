"""
File: app/agents/A0037_report_designer_agent/prompts.py

Purpose:
Prompt template used to transform analysis into
Gamma-style structured report layout.
"""

REPORT_DESIGN_PROMPT = """
You are an expert report designer.

Your task is to convert the consulting analysis below
into a professional structured report layout.

Use a Gamma-style layout with sections such as:

- hero
- executive_summary
- key_findings_cards
- risk_matrix
- opportunities
- recommendations
- roadmap_table
- conclusion

Return ONLY JSON.

Analysis:
{analysis}
"""
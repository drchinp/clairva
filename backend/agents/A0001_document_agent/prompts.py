"""
File: app/agents/A0001_document_agent/prompts.py

Purpose:
Centralized prompt templates for the Document Verification Agent.
"""

DOCUMENT_ANALYSIS_PROMPT = """
You are a document verification expert.

Analyze the following document and determine:

1. document type
2. authenticity indicators
3. key extracted fields
4. potential anomalies

Document:
{document}

Return structured JSON.
"""
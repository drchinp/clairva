"""
File: app/agents/A0001_document_agent/schema.py

Purpose:
Input and output schema for Document Agent.
"""

from pydantic import BaseModel


class DocumentAgentInput(BaseModel):

    document: str


class DocumentAgentOutput(BaseModel):

    status: str
    extracted_text: str
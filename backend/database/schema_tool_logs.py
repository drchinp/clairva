"""
File: app/database/schema_tool_logs.py

Purpose:
Database schema for tool execution tracing.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class ToolExecutionLog(Base):

    __tablename__ = "tool_execution_logs"

    id = Column(Integer, primary_key=True)

    agent_id = Column(String(50))
    tool_name = Column(String(100))

    arguments = Column(Text)
    result = Column(Text)

    execution_time_ms = Column(Integer)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())
"""
File: app/database/tool_log_service.py

Purpose:
Store tool execution traces for auditing.
"""

import json
import time
from app.database.session import SessionLocal
from app.database.schema_tool_logs import ToolExecutionLog
from app.utils.logger import get_logger

logger = get_logger(__name__)


def log_tool_execution(
    agent_id: str,
    tool_name: str,
    arguments: dict,
    result: dict,
    execution_time_ms: int
):

    db = SessionLocal()

    try:

        record = ToolExecutionLog(
            agent_id=agent_id,
            tool_name=tool_name,
            arguments=json.dumps(arguments),
            result=json.dumps(result),
            execution_time_ms=execution_time_ms
        )

        db.add(record)
        db.commit()

        logger.info(
            f"Tool execution logged | agent={agent_id} tool={tool_name}"
        )

    except Exception as e:

        logger.error(f"Tool log failure: {e}")

    finally:
        db.close()
"""
File: app/agents/A0001_document_agent/agent.py

Purpose:
Document Verification Agent responsible for extracting
text and verifying uploaded documents.

Enhancements:
- PromptGuard protection
- Agent Memory storage
"""

from app.agents.base_agent import BaseAgent
from app.agents.A0001_document_agent.schema import DocumentAgentInput
from app.mcp.tool_planner import plan_tool_usage
from app.mcp.tool_executor import execute_tool
from app.agents.A0001_document_agent.tools import extract_text

from app.security.prompt_guard import validate_prompt
from app.memory.agent_memory import store_memory, retrieve_memory

from app.utils.logger import get_logger

logger = get_logger(__name__)


class DocumentAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0001",
            agent_name="Document Verification Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        validated_input = DocumentAgentInput(**input_data)

        document = validated_input.document

        # ---------------------------------
        # PromptGuard Protection
        # ---------------------------------

        document = validate_prompt(document)

        # ---------------------------------
        # Retrieve Agent Memory
        # ---------------------------------

        try:

            memory_context = retrieve_memory(
                self.agent_id,
                document
            )

            logger.info(
                f"A0001 retrieved memory items: {len(memory_context)}"
            )

        except Exception as e:

            logger.warning(
                f"Memory retrieval failed: {e}"
            )

            memory_context = []

        # -------------------------
        # MCP Tool Planning
        # -------------------------

        tool_plan = plan_tool_usage(
            query=document,
            agent_id=self.agent_id
        )

        tool_used = None
        extracted_text = None

        if tool_plan.get("tool"):

            tool_used = tool_plan["tool"]

            logger.info(f"A0001 selected tool: {tool_used}")

            extracted_text = execute_tool(
                self.agent_id,
                tool_used,
                tool_plan.get("arguments", {})
            )

        # -------------------------
        # Fallback OCR (important)
        # -------------------------

        if not extracted_text:

            logger.info("Fallback OCR extraction used")

            extracted_text = extract_text(document)

            tool_used = "extract_text"

        # ---------------------------------
        # Store Agent Memory
        # ---------------------------------

        try:

            store_memory(
                self.agent_id,
                extracted_text
            )

            logger.info("A0001 memory stored")

        except Exception as e:

            logger.warning(
                f"Memory store failed: {e}"
            )

        result = {
            "status": "success",
            "extracted_text": extracted_text,
            "tool_used": tool_used,
            "memory_used": len(memory_context)
        }

        self.log_finish(result)

        return result
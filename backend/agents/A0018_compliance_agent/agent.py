"""
File: app/agents/A0018_compliance_agent/agent.py

Purpose:
Compliance Agent responsible for regulatory checks
and governance validation.

Enhancements:
- PromptGuard protection
- Agent Memory retrieval
- Agent Memory storage
"""

from app.agents.base_agent import BaseAgent
from app.agents.A0018_compliance_agent.schema import ComplianceAgentInput
from app.agents.A0018_compliance_agent.tools import perform_compliance_check

from app.mcp.tool_planner import plan_tool_usage
from app.mcp.tool_executor import execute_tool

from app.security.prompt_guard import validate_prompt
from app.memory.agent_memory import store_memory, retrieve_memory

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ComplianceAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0018",
            agent_name="Compliance Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        validated_input = ComplianceAgentInput(**input_data)

        data = validated_input.data

        # --------------------------------
        # PromptGuard Protection
        # --------------------------------

        data = validate_prompt(data)

        # --------------------------------
        # Retrieve Agent Memory
        # --------------------------------

        try:

            memory_context = retrieve_memory(
                self.agent_id,
                data
            )

            logger.info(
                f"A0018 retrieved memory items: {len(memory_context)}"
            )

        except Exception as e:

            logger.warning(
                f"Memory retrieval failed: {e}"
            )

            memory_context = []

        # --------------------------------
        # Step 1: MCP Tool Planning
        # --------------------------------

        tool_plan = plan_tool_usage(
            query=data,
            agent_id=self.agent_id
        )

        compliance_result = None
        tool_used = None

        if tool_plan and tool_plan.get("tool"):

            tool_used = tool_plan["tool"]

            logger.info(f"A0018 selected tool: {tool_used}")

            try:

                compliance_result = execute_tool(
                    self.agent_id,
                    tool_used,
                    tool_plan.get("arguments", {})
                )

            except Exception as e:

                logger.warning(f"Tool execution failed: {e}")

        # --------------------------------
        # Step 2: Fallback Compliance Check
        # --------------------------------

        if not compliance_result:

            logger.info("Fallback compliance check used")

            compliance_result = perform_compliance_check(data)

            tool_used = "perform_compliance_check"

        # --------------------------------
        # Store Agent Memory
        # --------------------------------

        try:

            memory_text = f"""
Compliance Evaluation
---------------------
Input:
{data}

Result:
{compliance_result}
"""

            store_memory(
                self.agent_id,
                memory_text
            )

            logger.info("A0018 memory stored")

        except Exception as e:

            logger.warning(
                f"Memory store failed: {e}"
            )

        result = {
            "status": "success",
            "compliance_result": compliance_result,
            "tool_used": tool_used,
            "memory_used": len(memory_context)
        }

        self.log_finish(result)

        return result
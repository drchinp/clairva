"""
File: app/agents/A0003_consulting_agent/agent.py

Purpose:
Consulting Agent responsible for strategic analysis
and business advisory recommendations.

Enhancements:
- PromptGuard protection
- Agent Memory retrieval
- Agent Memory storage
- Priority RAG knowledge retrieval
"""

from app.agents.base_agent import BaseAgent
from app.agents.A0003_consulting_agent.schema import ConsultingAgentInput

from app.mcp.tool_planner import plan_tool_usage
from app.mcp.tool_executor import execute_tool
from app.mcp.tool_registry import tool_registry
from app.security.prompt_guard import validate_prompt
from app.memory.agent_memory import store_memory, retrieve_memory

from app.tools.llm_provider import generate
from app.utils.logger import get_logger
from app.agents.A0003_consulting_agent.prompts import CONSULTING_ANALYSIS_PROMPT

import json

logger = get_logger(__name__)


class ConsultingAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0003",
            agent_name="Consulting Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        validated_input = ConsultingAgentInput(**input_data)

        context = validated_input.context

        # --------------------------------
        # PromptGuard Protection
        # --------------------------------

        context = validate_prompt(context)

        # --------------------------------
        # Retrieve Agent Memory
        # --------------------------------

        try:

            memory_context = retrieve_memory(
                self.agent_id,
                context
            )

            logger.info(
                f"A0003 retrieved memory items: {len(memory_context)}"
            )

        except Exception as e:

            logger.warning(
                f"Memory retrieval failed: {e}"
            )

            memory_context = []

        # --------------------------------
        # Step 1: Priority RAG Retrieval
        # --------------------------------

        rag_result = None
        rag_context = ""

        try:

            rag_tool = "rag_search"

            if rag_tool in tool_registry.list_tools():

                logger.info("A0003 executing priority RAG search")

                rag_result = execute_tool(
                    self.agent_id,
                    rag_tool,
                    {"query": context}
                )

                # Convert result to safe text for prompt
                if isinstance(rag_result, list):
                    rag_context = "\n".join([str(r) for r in rag_result])

                elif isinstance(rag_result, dict):
                    rag_context = json.dumps(rag_result, indent=2)

                else:
                    rag_context = str(rag_result)

                logger.info("A0003 RAG context prepared")

        except Exception as e:

            logger.warning(f"RAG search failed: {e}")

        # --------------------------------
        # Step 2: MCP Tool Planning
        # --------------------------------

        tool_plan = plan_tool_usage(
            context,
            self.agent_id
        )

        tool_result = None
        tool_used = None

        if tool_plan and tool_plan.get("tool"):

            tool_used = tool_plan["tool"]

            logger.info(f"A0003 selected tool: {tool_used}")

            try:

                tool_result = execute_tool(
                    self.agent_id,
                    tool_used,
                    tool_plan.get("arguments", {})
                )

            except Exception as e:

                logger.warning(f"Tool execution failed: {e}")

        # --------------------------------
        # Step 3: LLM Strategic Analysis
        # --------------------------------

        prompt = CONSULTING_ANALYSIS_PROMPT.format(
            context=context,
            rag_context=rag_context,
            memory_context=memory_context,
            tool_result=tool_result
        )

        analysis = generate(
            prompt=prompt,
            agent_id=self.agent_id
        )

        # --------------------------------
        # Store Agent Memory
        # --------------------------------

        try:

            store_memory(
                self.agent_id,
                analysis
            )

            logger.info("A0003 memory stored")

        except Exception as e:

            logger.warning(
                f"Memory store failed: {e}"
            )

        result = {
            "status": "success",
            "analysis": analysis,
            "tool_used": tool_used,
            "rag_used": rag_result is not None,
            "memory_used": len(memory_context)
        }

        self.log_finish(result)

        return result
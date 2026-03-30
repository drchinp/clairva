"""
File: app/agents/A0000_supervisor_agent/agent.py

Purpose:
Supervisor Agent responsible for routing tasks
to the appropriate Clairva agents.
"""

import json

from app.agents.base_agent import BaseAgent
from app.security.prompt_guard import validate_prompt
from app.tools.llm_provider import generate
from app.utils.logger import get_logger

logger = get_logger(__name__)


AVAILABLE_AGENTS = {
    "A0001": "Document Verification Agent (extract text from documents)",
    "A0002": "Reporting & Analysis Agent (summarize data and extract KPIs)",
    "A0003": "Consulting Agent (strategic business advice)",
    "A0018": "Compliance Agent (regulatory compliance validation)"
}


class SupervisorAgent(BaseAgent):

    def __init__(self):

        super().__init__(
            agent_id="A0000",
            agent_name="Supervisor Agent"
        )

    def run(self, input_data: dict):

        self.log_start(input_data)

        request = input_data.get("request", "")

        request = validate_prompt(request)

        prompt = f"""
You are the supervisor of a multi-agent AI platform.

User request:
{request}

Available agents:
{AVAILABLE_AGENTS}

Decide which agent should handle the task.

Return JSON only:

{{
 "agent_id": "A000X"
}}
"""

        response = generate(
            prompt=prompt,
            agent_id=self.agent_id
        )

        try:

            decision = json.loads(response)

        except Exception:

            logger.warning("Supervisor failed to parse response")

            decision = {"agent_id": "A0003"}

        selected_agent = decision.get("agent_id")

        logger.info(f"Supervisor selected agent: {selected_agent}")

        # -------------------------
        # Execute Selected Agent
        # -------------------------

        result = self.execute_agent(selected_agent, input_data)

        output = {
            "status": "success",
            "selected_agent": selected_agent,
            "agent_output": result
        }

        self.log_finish(output)

        return output

    # ----------------------------------------------------
    # Execute Agent
    # ----------------------------------------------------

    def execute_agent(self, agent_id, input_data):

        try:

            audit_data = input_data.get("audit_data", {})

            # Convert dict to string for agents
            audit_json = json.dumps(audit_data, indent=2)

            # -----------------------------
            # Transform payload per agent
            # -----------------------------

            if agent_id == "A0001":

                from app.agents.A0001_document_agent.agent import DocumentAgent
                agent = DocumentAgent()

                agent_input = {
                    "document": audit_json
                }

            elif agent_id == "A0002":

                from app.agents.A0002_reporting_agent.agent import ReportingAgent
                agent = ReportingAgent()

                agent_input = {
                    "data": audit_json
                }

            elif agent_id == "A0003":

                from app.agents.A0003_consulting_agent.agent import ConsultingAgent
                agent = ConsultingAgent()

                # FIX: ConsultingAgent expects "context"
                agent_input = {
                    "context": audit_json
                }

            elif agent_id == "A0018":

                from app.agents.A0018_compliance_agent.agent import ComplianceAgent
                agent = ComplianceAgent()

                agent_input = {
                    "data": audit_json
                }

            else:

                raise ValueError(f"Unknown agent: {agent_id}")

            logger.info(f"Executing {agent_id} with transformed input")

            return agent.run(agent_input)

        except Exception as e:

            logger.error(f"Agent execution failed: {str(e)}")

            return {
                "status": "error",
                "message": str(e)
            }
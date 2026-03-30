"""
File: app/orchestration/workflows/consulting_workflow.py

Purpose:
Example multi-agent workflow using LangGraph engine.
"""

from app.orchestration.langgraph_engine import LangGraphEngine

from app.agents.A0003_consulting_agent.agent import ConsultingAgent
from app.agents.A0002_reporting_agent.agent import ReportingAgent
from app.agents.A0018_compliance_agent.agent import ComplianceAgent


engine = LangGraphEngine()

consulting = ConsultingAgent()
reporting = ReportingAgent()
compliance = ComplianceAgent()


def consulting_node(state):

    result = consulting.run({
        "context": state["context"]
    })

    state["consulting"] = result

    return state


def reporting_node(state):

    result = reporting.run({
        "data": state["consulting"]["analysis"]
    })

    state["report"] = result

    return state


def compliance_node(state):

    result = compliance.run({
        "data": state["consulting"]["analysis"]
    })

    state["compliance"] = result

    return state


engine.add_node("consulting", consulting_node)
engine.add_node("reporting", reporting_node)
engine.add_node("compliance", compliance_node)

engine.add_edge("consulting", "reporting")
engine.add_edge("reporting", "compliance")
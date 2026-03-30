"""
File: app/tests/run_clairva_workflow.py

Purpose
-------
Run Clairva agents step-by-step and display
each stage of the processing pipeline.
"""

import json
from pathlib import Path

from app.agents.A0000_supervisor_agent.agent import SupervisorAgent


# ------------------------------------------------
# Select audit case
# ------------------------------------------------

AUDIT_FILE = Path("data/audit_cases/audit_fail.json")

with open(AUDIT_FILE) as f:
    audit_case = json.load(f)

print("\n==============================")
print("CLAIRVA AI TEST RUN")
print("==============================")

print("\nLoaded Audit Case")
print("Company:", audit_case["audit"]["company_name"])
print("Framework:", audit_case["audit"]["framework"])


# ------------------------------------------------
# Create supervisor
# ------------------------------------------------

supervisor = SupervisorAgent()


# ------------------------------------------------
# Define UI actions
# ------------------------------------------------

tests = [

    {
        "name": "VERIFY CRITERIA",
        "request": "Verify compliance against B Corp requirements"
    },

    {
        "name": "SUMMARIZE EVIDENCE",
        "request": "Summarize the submitted evidence and audit data"
    },

    {
        "name": "GENERATE DRAFT REPORT",
        "request": "Generate a draft audit report based on findings"
    },

    {
        "name": "POLISH COMMENTS",
        "request": "Improve wording of audit observations"
    }

]


# ------------------------------------------------
# Run tests
# ------------------------------------------------

for test in tests:

    print("\n====================================")
    print("TEST:", test["name"])
    print("====================================")

    payload = {
        "request": test["request"],
        "audit_data": audit_case
    }

    result = supervisor.run(payload)

    print("\n--- Supervisor Decision ---")
    print("Selected Agent:", result["selected_agent"])

    print("\n--- Agent Output ---")
    print(json.dumps(result["agent_output"], indent=2))


print("\n====================================")
print("TEST COMPLETE")
print("====================================")
"""
File: app/tests/test_clairva_agents.py

Purpose
-------
Simulate Clairva AI Advisor workflow using generated audit JSON.

Test agents:

A0001_document_agent
A0002_reporting_agent
A0003_consulting_agent
A0018_compliance_agent
"""

import json
from pathlib import Path

from agents.A0000_supervisor_agent.agent import SupervisorAgent


# -----------------------------
# Load audit case
# -----------------------------

CASE_FILE = Path("data/audit_cases/audit_fail.json")

with open(CASE_FILE) as f:
    audit_case = json.load(f)

print("\nLoaded Audit Case")
print(audit_case["audit"]["company_name"])


# -----------------------------
# Initialize Supervisor
# -----------------------------

supervisor = SupervisorAgent()


# -----------------------------
# 1. Verify Criteria
# (Compliance Agent)
# -----------------------------

print("\n--- VERIFY CRITERIA ---")

result = supervisor.run(

    task="verify_criteria",
    payload=audit_case

)

print(result)



# -----------------------------
# 2. Summarize Evidence
# (Document Agent)
# -----------------------------

print("\n--- SUMMARIZE EVIDENCE ---")

result = supervisor.run(

    task="summarize_evidence",
    payload=audit_case

)

print(result)



# -----------------------------
# 3. Generate Draft Report
# (Reporting Agent)
# -----------------------------

print("\n--- GENERATE DRAFT REPORT ---")

result = supervisor.run(

    task="generate_draft_report",
    payload=audit_case

)

print(result)



# -----------------------------
# 4. Polish Comments
# (Consulting Agent)
# -----------------------------

print("\n--- POLISH COMMENTS ---")

result = supervisor.run(

    task="polish_comments",
    payload=audit_case

)

print(result)
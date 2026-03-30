import json

from app.agents.A0000_supervisor_agent.agent import SupervisorAgent

with open("data/audit_cases/audit_fail.json") as f:
    audit = json.load(f)

supervisor = SupervisorAgent()

result = supervisor.run({

    "request": "Verify criteria against B Corp requirements",
    "audit_data": audit

})

print(result)
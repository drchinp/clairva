"""
File: tests/test_agents.py

Purpose:
End-to-end testing of Clairva agents.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/invoke"


def test_agent(agent, payload):

    data = {
        "agent": agent,
        "input": payload
    }

    print("\n===============================")
    print(f"Testing Agent: {agent}")
    print("===============================")

    r = requests.post(BASE_URL, json=data)

    print("Status:", r.status_code)

    try:
        print(json.dumps(r.json(), indent=2))
    except:
        print(r.text)


# ----------------------------------------
# Run All Tests
# ----------------------------------------

if __name__ == "__main__":

    # Document Agent
    test_agent(
        "A0001",
        {
            "document": "This is a sample document to extract text."
        }
    )

    # Reporting Agent
    test_agent(
        "A0002",
        {
            "data": "Revenue grew from 10M to 15M while costs dropped 5%"
        }
    )

    # Consulting Agent
    test_agent(
        "A0003",
        {
            "context": "A logistics company wants to adopt AI to optimize fleet routing."
        }
    )

    # Compliance Agent
    test_agent(
        "A0018",
        {
            "data": "ESG governance disclosure of manufacturing company"
        }
    )
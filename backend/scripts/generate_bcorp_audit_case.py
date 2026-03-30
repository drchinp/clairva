"""
File: scripts/generate_bcorp_audit_case.py

Purpose
-------
Generate realistic B Corp style audit cases aligned with Tidua database models.

Output JSON structure mirrors:

RequirementAssessment
Finding
FindingAction
AuditReport
CopilotDraft

This allows simulation of real audit scenarios for Clairva AI agents.
"""

import json
import random
import uuid
from datetime import datetime, timedelta, UTC
from pathlib import Path


# ----------------------------
# Configuration
# ----------------------------

OUTPUT_DIR = Path("data/audit_cases")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FRAMEWORK_NAME = "B Impact Assessment v6"


# ----------------------------
# Sample Global Requirements
# ----------------------------

REQUIREMENTS = [

    {"id": 101, "title": "Stakeholder Governance", "max_points": 10},
    {"id": 102, "title": "Board Independence", "max_points": 8},
    {"id": 103, "title": "Ethics & Anti-Corruption Policy", "max_points": 8},

    {"id": 201, "title": "Worker Health & Safety", "max_points": 12},
    {"id": 202, "title": "Worker Grievance Mechanism", "max_points": 10},
    {"id": 203, "title": "Fair Wage Policies", "max_points": 10},

    {"id": 301, "title": "Energy Management", "max_points": 10},
    {"id": 302, "title": "Carbon Emissions Reporting", "max_points": 12},
    {"id": 303, "title": "Waste Reduction Practices", "max_points": 10},

    {"id": 401, "title": "Community Investment", "max_points": 8},
    {"id": 402, "title": "Local Supplier Engagement", "max_points": 8},
]


COMPANY_NAMES = [
    "GreenFuture Manufacturing",
    "EcoTech Industries",
    "FastFashion Global Ltd",
    "PlanetCare Foods",
    "UrbanBuild Construction"
]


# ----------------------------
# Helper Functions
# ----------------------------

def generate_requirement_assessments(mode):
    """
    mode:
        pass
        fail
        borderline
    """

    assessments = []

    for req in REQUIREMENTS:

        if mode == "pass":
            points = random.uniform(req["max_points"] * 0.8, req["max_points"])
            judgment = "Compliant"

        elif mode == "fail":
            points = random.uniform(0, req["max_points"] * 0.2)
            judgment = "Gap/Opportunity"

        else:
            points = random.uniform(req["max_points"] * 0.4, req["max_points"] * 0.7)
            judgment = random.choice(["Compliant", "Gap/Opportunity"])

        assessment = {

            "assessment_id": random.randint(1000, 9999),
            "requirement_id": req["id"],
            "judgment": judgment,
            "points_awarded": round(points, 2),
            "max_points": req["max_points"],
            "rationale": f"Assessment based on submitted documentation for {req['title']}",
            "status": "Confirmed",
            "scored_at": datetime.now(UTC).isoformat()

        }

        assessments.append(assessment)

    return assessments


def generate_findings(mode):

    findings = []

    if mode == "pass":
        num = random.randint(1, 2)

    elif mode == "fail":
        num = random.randint(6, 10)

    else:
        num = random.randint(3, 5)

    for i in range(num):

        req = random.choice(REQUIREMENTS)

        finding = {

            "finding_id": random.randint(1000, 9999),
            "requirement_id": req["id"],
            "severity": random.choice(["Low", "Medium", "High"]),
            "status": "Action Required",
            "due_date": (datetime.now(UTC) + timedelta(days=120)).date().isoformat(),
            "description": f"Gap identified in {req['title']} implementation.",
            "corrective_action": f"Develop formal policy and monitoring for {req['title']}.",
            "created_at": datetime.now(UTC).isoformat()

        }

        findings.append(finding)

    return findings


def generate_actions(findings):

    actions = []

    for f in findings:

        action = {

            "action_id": random.randint(10000, 99999),
            "finding_id": f["finding_id"],
            "requirement_id": f["requirement_id"],
            "action_description": f"Remediation plan for finding {f['finding_id']}",
            "deadline": (datetime.now(UTC) + timedelta(days=180)).date().isoformat(),
            "status": "Pending"

        }

        actions.append(action)

    return actions


def generate_report(audit_id, mode):

    status = "Draft"

    if mode == "pass":
        summary = "Audit indicates strong compliance across governance, worker, environmental and community domains."

    elif mode == "fail":
        summary = "Audit indicates significant compliance gaps and systemic governance and environmental deficiencies."

    else:
        summary = "Audit indicates partial readiness with several improvement areas identified."

    report = {

        "report_id": random.randint(1000, 9999),
        "audit_id": audit_id,
        "framework_id": 1,
        "report_name": "AI Generated Audit Draft",
        "report_type": "Full Audit Report",
        "content_selection": [
            "Executive Summary",
            "Compliance Percentages",
            "Gap Analysis"
        ],
        "ai_assistance_level": "AI assist Findings & Roadmap",
        "status": status,
        "version": "V1.0",
        "summary": summary,
        "created_at": datetime.now(UTC).isoformat()

    }

    return report


# ----------------------------
# Main Generator
# ----------------------------

def generate_audit_case(mode="pass"):

    audit_id = random.randint(1000, 9999)

    audit = {

        "audit_id": audit_id,
        "company_name": random.choice(COMPANY_NAMES),
        "framework": FRAMEWORK_NAME,
        "stage": "Evidence Review",
        "created_at": datetime.now(UTC).isoformat()

    }

    assessments = generate_requirement_assessments(mode)
    findings = generate_findings(mode)
    actions = generate_actions(findings)
    report = generate_report(audit_id, mode)

    dataset = {

        "audit": audit,
        "requirement_assessments": assessments,
        "findings": findings,
        "finding_actions": actions,
        "report": report

    }

    return dataset


# ----------------------------
# Generate Cases
# ----------------------------

def main():

    cases = {

        "audit_pass": generate_audit_case("pass"),
        "audit_fail": generate_audit_case("fail"),
        "audit_borderline": generate_audit_case("borderline")

    }

    for name, data in cases.items():

        path = OUTPUT_DIR / f"{name}.json"

        with open(path, "w") as f:
            json.dump(data, f, indent=2)

        print(f"Generated {path}")


if __name__ == "__main__":
    main()
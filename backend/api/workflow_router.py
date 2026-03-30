"""
File: app/api/workflow_router.py

Purpose:
Run multi-agent workflows.
"""

from fastapi import APIRouter
from app.orchestration.workflows.consulting_workflow import engine

router = APIRouter()


@router.post("/workflow/consulting")

def run_workflow(context: str):

    result = engine.run(

        start_node="consulting",

        state={
            "context": context
        }

    )

    return result
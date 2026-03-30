"""
File: app/main.py

Purpose:
Entry point for Clairva Agent Platform.
Handles application startup and agent loading.
"""

from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.router import router
from app.registry.load_agents import load_agents
from app.utils.logger import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------
# Application Lifespan
# ---------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting Clairva platform")

    # Load all agents
    load_agents()

    logger.info("Clairva platform ready")

    yield


# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------

app = FastAPI(
    title="Clairva Agent Platform",
    description="Enterprise Agentic AI Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Register API routes
app.include_router(router)
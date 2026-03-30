"""
File: app/database/init_db.py

Purpose:
Initialize Clairva database schema for production.

Creates:
- Extensions
- Agent memory
- Tool logs
- AI usage tracking
- Agent execution traces
- Workflow runs
- Knowledge vector store
"""

import os
from dotenv import load_dotenv
import psycopg2

from app.utils.logger import get_logger
from app.database.base import Base
from app.database.session import engine

load_dotenv()

logger = get_logger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")


# ------------------------------------------------
# SQL BLOCKS
# ------------------------------------------------

SQL_BLOCKS = [

# -----------------------------
# Extensions
# -----------------------------

"""
CREATE EXTENSION IF NOT EXISTS vector;
""",

# -----------------------------
# Agent memory (vector)
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS agent_memory (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    content TEXT,
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Tool execution logs
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS tool_execution_logs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    tool_name VARCHAR(100),
    arguments JSONB,
    result JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# AI usage tracking
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    provider VARCHAR(50),
    model VARCHAR(100),
    tokens INTEGER,
    cost FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Agent execution traces
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS agent_runs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(20),
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Workflow traces
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS workflow_runs (
    id SERIAL PRIMARY KEY,
    workflow_name VARCHAR(100),
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Reasoning logs
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS reasoning_logs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(50),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Knowledge documents (RAG)
# -----------------------------

"""
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    source TEXT,
    title TEXT,
    document_type TEXT,
    section TEXT,
    chunk_index INT,
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""",

# -----------------------------
# Vector index
# -----------------------------

"""
CREATE INDEX IF NOT EXISTS knowledge_embedding_index
ON knowledge_documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
"""

]


# ------------------------------------------------
# SQLAlchemy Models
# ------------------------------------------------

def init_db():

    logger.info("Initializing SQLAlchemy models")

    Base.metadata.create_all(bind=engine)


# ------------------------------------------------
# Main Database Init
# ------------------------------------------------

def init_database():

    logger.info("Initializing Clairva database")

    try:

        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Execute SQL blocks
        for sql in SQL_BLOCKS:

            cursor.execute(sql)

        conn.commit()

        cursor.close()
        conn.close()

        # Also initialize SQLAlchemy models
        init_db()

        logger.info("Clairva database initialized successfully")

    except Exception as e:

        logger.error(f"Database initialization failed: {str(e)}")
        raise
"""
File: app/memory/agent_memory.py

Purpose:
Store and retrieve agent memory using pgvector.
"""

import psycopg2
import os

from app.tools.llm_provider import generate_embedding
from app.utils.logger import get_logger

logger = get_logger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")


# ---------------------------------
# Database Connection
# ---------------------------------

def get_connection():

    try:

        return psycopg2.connect(DATABASE_URL)

    except Exception as e:

        logger.error(f"Database connection failed: {str(e)}")
        raise


# ---------------------------------
# Store Agent Memory
# ---------------------------------

def store_memory(agent_id: str, text: str):

    try:

        embedding = generate_embedding(text)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO agent_memory (agent_id, content, embedding)
            VALUES (%s, %s, %s::vector)
        """, (agent_id, text, embedding))

        conn.commit()

        cur.close()
        conn.close()

        logger.info(f"Memory stored for agent {agent_id}")

    except Exception as e:

        logger.error(f"Memory store failed: {str(e)}")


# ---------------------------------
# Retrieve Agent Memory
# ---------------------------------

def retrieve_memory(agent_id: str, query: str, limit: int = 3):

    try:

        embedding = generate_embedding(query)

        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT content
            FROM agent_memory
            WHERE agent_id = %s
            ORDER BY embedding <-> %s::vector
            LIMIT %s
        """, (agent_id, embedding, limit))

        rows = cur.fetchall()

        cur.close()
        conn.close()

        logger.info(
            f"Memory retrieved for agent {agent_id}: {len(rows)} items"
        )

        return [r[0] for r in rows]

    except Exception as e:

        logger.error(f"Memory retrieval failed: {str(e)}")

        return []
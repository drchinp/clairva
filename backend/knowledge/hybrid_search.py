import psycopg2
import os

from app.tools.llm_provider import generate_embedding

DATABASE_URL = os.getenv("DATABASE_URL")


def hybrid_search(query: str, limit: int = 5):
    embedding = generate_embedding(query)

    vector = "[" + ",".join(map(str, embedding)) + "]"

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("""
                SELECT content
                FROM knowledge_documents
                ORDER BY embedding <-> %s::vector
    LIMIT %s
                """, (vector, limit))

    vector_results = cur.fetchall()

    cur.execute("""
    SELECT content
    FROM knowledge_documents
    WHERE content ILIKE %s
    LIMIT %s
    """, (f"%{query}%", limit))

    keyword_results = cur.fetchall()

    cur.close()
    conn.close()

    combined = vector_results + keyword_results

    return list(set([r[0] for r in combined]))
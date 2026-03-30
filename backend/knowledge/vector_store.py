"""
File: app/knowledge/vector_store.py

Purpose:
Vector store layer for Clairva knowledge retrieval.

Responsibilities:
- generate embeddings
- insert documents into pgvector
- perform hybrid retrieval (vector + keyword)
- return relevant documents
"""

from dotenv import load_dotenv
import os

load_dotenv()

import psycopg2
from psycopg2.extras import execute_values
from openai import OpenAI
from app.utils.logger import get_logger

logger = get_logger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DATABASE_URL = os.getenv("DATABASE_URL")


# ------------------------------------------------
# Database Connection
# ------------------------------------------------

def get_db_connection():
    """
    Create database connection.
    """
    return psycopg2.connect(DATABASE_URL)


# ------------------------------------------------
# Embedding Generation
# ------------------------------------------------

def get_embedding(text: str):
    """
    Generate embedding vector.
    """

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding


# ------------------------------------------------
# Insert Documents
# ------------------------------------------------

def insert_documents(documents):
    """
    Insert documents into pgvector store.

    Args:
        documents (list):
            [{"content": "...", "source": "..."}]
    """

    logger.info(f"Inserting {len(documents)} documents into vector store")

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        rows = []
        texts = []
        sources = []

        # Normalize input format
        for doc in documents:

            if hasattr(doc, "page_content"):
                content = doc.page_content
                source = doc.metadata.get("source", "unknown") if hasattr(doc, "metadata") else "unknown"
            else:
                content = doc["content"]
                source = doc.get("source", "unknown")

            texts.append(content)
            sources.append(source)

        batch_size = 100

        logger.info(f"Generating embeddings in batches of {batch_size}")

        for i in range(0, len(texts), batch_size):

            batch_texts = texts[i:i + batch_size]
            batch_sources = sources[i:i + batch_size]

            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=batch_texts
            )

            for text, source, emb in zip(batch_texts, batch_sources, response.data):

                rows.append((
                    text,
                    source,
                    emb.embedding
                ))

            logger.info(f"Processed embeddings {i + len(batch_texts)}/{len(texts)}")

        execute_values(
            cursor,
            """
            INSERT INTO knowledge_documents
            (content, source, embedding)
            VALUES %s
            """,
            rows
        )

        conn.commit()

        cursor.close()
        conn.close()

        logger.info("Documents inserted successfully")

    except Exception as e:

        logger.error(f"Insert documents error: {str(e)}")


# ------------------------------------------------
# Vector Search
# ------------------------------------------------

def vector_search(query: str, top_k: int = 5):

    embedding = get_embedding(query)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT content, source, 1 - (embedding <=> %s::vector) AS score
        FROM knowledge_documents
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """,
        (embedding, embedding, top_k)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    for row in rows:

        results.append({
            "content": row[0],
            "source": row[1],
            "score": float(row[2]),
            "type": "vector"
        })

    return results


# ------------------------------------------------
# Keyword Search (BM25 / Full Text)
# ------------------------------------------------

def keyword_search(query: str, top_k: int = 5):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT content, source,
        ts_rank(content_tsv, websearch_to_tsquery(%s)) AS score
        FROM knowledge_documents
        WHERE content_tsv @@ websearch_to_tsquery(%s)
        ORDER BY score DESC
        LIMIT %s
        """,
        (query, query, top_k)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    for row in rows:

        results.append({
            "content": row[0],
            "source": row[1],
            "score": float(row[2]),
            "type": "keyword"
        })

    return results


# ------------------------------------------------
# Hybrid Search
# ------------------------------------------------

def search_vectors(query: str, top_k: int = 5):
    """
    Hybrid retrieval:
    vector search + keyword search
    """

    logger.info(f"Hybrid search started | query={query}")

    try:

        vector_results = vector_search(query, top_k)
        keyword_results = keyword_search(query, top_k)

        combined = vector_results + keyword_results

        # Remove duplicates
        seen = set()
        unique_results = []

        for r in combined:

            key = r["content"][:120]

            if key not in seen:
                seen.add(key)
                unique_results.append(r)

        # Sort by score
        unique_results.sort(key=lambda x: x["score"], reverse=True)

        final_results = unique_results[:top_k]

        logger.info(f"Hybrid search results: {len(final_results)}")

        return final_results

    except Exception as e:

        logger.error(f"Hybrid search error: {str(e)}")

        return []
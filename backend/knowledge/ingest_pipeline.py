"""
File: app/knowledge/ingest_pipeline.py

Purpose:
Document ingestion pipeline for Clairva RAG system.

Features:
- Load PDF, DOCX, TXT
- Chunk documents
- Generate embeddings
- Store vectors in pgvector
"""

import os
import uuid
from typing import List

import psycopg2
from psycopg2.extras import execute_values

from app.utils.logger import get_logger
from app.tools.llm_provider import generate_embedding


logger = get_logger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")


# ----------------------------------------
# Document loaders
# ----------------------------------------

def load_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def load_pdf(path: str) -> str:

    import pdfplumber

    text = ""

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"

    return text


def load_docx(path: str) -> str:

    import docx

    doc = docx.Document(path)

    text = "\n".join([p.text for p in doc.paragraphs])

    return text


# ----------------------------------------
# Chunking
# ----------------------------------------

def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50):

    words = text.split()

    chunks = []

    start = 0

    while start < len(words):

        chunk = words[start:start + chunk_size]

        chunks.append(" ".join(chunk))

        start += chunk_size - overlap

    return chunks


# ----------------------------------------
# Database connection
# ----------------------------------------

def get_connection():

    return psycopg2.connect(DATABASE_URL)


# ----------------------------------------
# Insert vectors
# ----------------------------------------

def insert_vectors(chunks: List[str], source: str):

    conn = get_connection()

    cur = conn.cursor()

    records = []

    for chunk in chunks:

        embedding = generate_embedding(chunk)

        records.append((
            str(uuid.uuid4()),
            chunk,
            embedding,
            source,
            os.path.basename(source),
            "RAG_DOCUMENT",
            None
        ))

    sql = """
          INSERT INTO knowledge_documents
              (id, content, embedding, source, title, document_type, section)
          VALUES %s \
          """

    execute_values(cur, sql, records)

    conn.commit()

    cur.close()
    conn.close()


# ----------------------------------------
# Main ingest function
# ----------------------------------------

def ingest_document(path: str):

    logger.info(f"Ingesting document: {path}")

    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        text = load_pdf(path)

    elif ext == ".docx":
        text = load_docx(path)

    elif ext == ".txt":
        text = load_text_file(path)

    else:
        raise Exception("Unsupported file type")

    chunks = chunk_text(text)

    insert_vectors(chunks, path)

    logger.info("Document ingestion completed")
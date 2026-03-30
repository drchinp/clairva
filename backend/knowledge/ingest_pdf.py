"""
File: app/knowledge/ingest_pdf.py

Purpose:
Ingest PDF documents into Clairva RAG vector store
"""

import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.knowledge.vector_store import insert_documents
from app.utils.logger import get_logger

logger = get_logger(__name__)


def load_pdf(path: str):

    reader = PdfReader(path)

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return pages


def ingest_pdf(file_path: str):

    logger.info(f"Ingesting file: {file_path}")

    pages = load_pdf(file_path)

    logger.info(f"Total pages loaded: {len(pages)}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )

    chunks = splitter.create_documents(pages)

    logger.info(f"Chunks created: {len(chunks)}")

    insert_documents(chunks)

    logger.info("Ingestion completed")


if __name__ == "__main__":

    pdf_path = "/Users/drchinp/Library/CloudStorage/GoogleDrive-patrick@clairvoyantlab.com/My Drive/CLxNFT/CLAIRVA/dev/clairva_agents/rag_files/blab/all.pdf"

    ingest_pdf(pdf_path)
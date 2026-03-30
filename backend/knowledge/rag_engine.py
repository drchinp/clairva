"""
File: app/knowledge/rag_engine.py

Purpose:
RAG orchestration layer for Clairva platform.

Responsibilities:
- receive search query
- retrieve documents using hybrid search (vector + keyword)
- build RAG context
- optionally generate LLM answers
"""

from app.knowledge.hybrid_search import hybrid_search
from app.tools.llm_provider import generate
from app.utils.logger import get_logger

logger = get_logger(__name__)


class RAGEngine:
    """
    Retrieval Augmented Generation engine.
    """

    # ------------------------------------------------
    # Hybrid Search
    # ------------------------------------------------

    def search(self, query: str, top_k: int = 5):
        """
        Search knowledge base using hybrid retrieval.

        Args:
            query (str): search query
            top_k (int): number of results

        Returns:
            list: relevant documents
        """

        logger.info(f"RAG hybrid search started | query={query}")

        try:

            docs = hybrid_search(
                query=query,
                limit=top_k
            )

            logger.info(f"RAG search results: {len(docs)}")

            return docs

        except Exception as e:

            logger.error(f"RAG search error: {str(e)}")

            return []

    # ------------------------------------------------
    # Build context for LLM
    # ------------------------------------------------

    def build_context(self, docs: list, max_chars: int = 12000):
        """
        Convert retrieved documents into context text.
        """

        if not docs:
            logger.warning("No documents retrieved for context")
            return ""

        context_blocks = []
        total_chars = 0

        for doc in docs:

            if isinstance(doc, dict):
                text = doc.get("content", "")
            else:
                text = str(doc)

            if not text:
                continue

            total_chars += len(text)

            if total_chars > max_chars:
                logger.info("Context size limit reached")
                break

            context_blocks.append(text)

        context = "\n\n".join(context_blocks)

        logger.info(f"Context built | chars={len(context)}")

        return context

    # ------------------------------------------------
    # Full RAG Answer
    # ------------------------------------------------

    def answer(self, query: str, agent_id: str = "rag", top_k: int = 5):
        """
        Perform full RAG workflow.
        """

        logger.info(f"RAG answer requested | query={query}")

        docs = self.search(query, top_k)

        context = self.build_context(docs)

        prompt = f"""
You are an expert assistant for enterprise knowledge systems.

Use the following knowledge context to answer the question.

Knowledge Context:
{context}

Question:
{query}

Instructions:
- Answer clearly and concisely.
- Base your answer only on the knowledge context.
- If the context does not contain the answer, say so.
"""

        try:

            answer = generate(
                prompt=prompt,
                agent_id=agent_id
            )

            logger.info("RAG answer generated successfully")

            return {
                "answer": answer,
                "sources": self.format_sources(docs)
            }

        except Exception as e:

            logger.error(f"RAG generation error: {str(e)}")

            return {
                "answer": "Unable to generate answer.",
                "sources": self.format_sources(docs)
            }

    # ------------------------------------------------
    # Format Sources
    # ------------------------------------------------

    def format_sources(self, docs: list):

        sources = []

        for doc in docs:

            if isinstance(doc, dict):

                sources.append({
                    "source": doc.get("source", "unknown"),
                    "score": doc.get("score", None)
                })

        return sources


# Singleton instance used by tools
rag_engine = RAGEngine()
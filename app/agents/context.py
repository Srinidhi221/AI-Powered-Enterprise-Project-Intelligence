"""
app/agents/context.py
Shared helper: agents don't re-run extraction, they read the already-ingested
document back out of the vector store (populated by the Milestone 1
/upload endpoint) and hand it to the LLM as context.
"""

from app.rag.vector_store import get_document_text, list_sources
from app.config import AGENT_MAX_CONTEXT_CHARS


class SourceNotFoundError(Exception):
    """Raised when the requested filename has no chunks in the vector store."""
    pass


def get_document_context(source: str) -> str:
    """
    Fetch a document's full text by filename, trimmed to a safe length for
    a single LLM call. Raises SourceNotFoundError if nothing was ever
    uploaded under that filename.
    """
    text = get_document_text(source)
    if not text:
        raise SourceNotFoundError(
            f"No indexed content found for '{source}'. "
            f"Known sources: {list_sources()}"
        )
    if len(text) > AGENT_MAX_CONTEXT_CHARS:
        text = text[:AGENT_MAX_CONTEXT_CHARS] + "\n[...document truncated for length...]"
    return text
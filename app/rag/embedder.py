"""
embedder.py
Converts text chunks into vector embeddings using a local sentence-transformers model.
No API key needed - runs fully offline after the model is first downloaded.
"""

from typing import List
from sentence_transformers import SentenceTransformer

# Small, fast, good-quality general-purpose embedding model
MODEL_NAME = "all-MiniLM-L6-v2"

_model = None  # lazy-loaded singleton so we don't reload the model every call


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Convert a list of text strings into a list of embedding vectors.

    Args:
        texts: list of chunk strings (non-empty)

    Returns:
        List of embedding vectors (one per input text), each a list of floats.
    """
    if not texts:
        return []

    model = get_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings.tolist()


def embed_text(text: str) -> List[float]:
    """Convenience wrapper for embedding a single string (e.g. a user query)."""
    return embed_texts([text])[0]
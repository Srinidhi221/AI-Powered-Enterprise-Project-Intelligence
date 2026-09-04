"""
chunker.py
Splits raw text into overlapping chunks suitable for embedding.
Chunking is done by word count (simple, dependency-free, good enough for M1).
"""

from typing import List


def chunk_text(
    text: str,
    chunk_size: int = 200,
    chunk_overlap: int = 40,
) -> List[str]:
    """
    Split text into overlapping chunks.

    Args:
        text: raw text to split
        chunk_size: number of words per chunk
        chunk_overlap: number of words repeated between consecutive chunks
                        (keeps context from breaking mid-idea at chunk boundaries)

    Returns:
        List of text chunks (strings). Empty input returns an empty list.
    """
    if not text or not text.strip():
        return []

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")

    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunks.append(" ".join(chunk_words))

        if end >= len(words):
            break

        # move window forward, keeping the overlap
        start = end - chunk_overlap

    return chunks


def chunk_documents(documents: List[dict], chunk_size: int = 200, chunk_overlap: int = 40) -> List[dict]:
    """
    Chunk a batch of documents while preserving source metadata.

    Args:
        documents: list of {"source": filename, "text": raw_text}
        chunk_size / chunk_overlap: passed through to chunk_text

    Returns:
        List of {"source": filename, "chunk_id": int, "text": chunk_text}
        One entry per chunk, across all documents.
    """
    all_chunks = []
    for doc in documents:
        text_chunks = chunk_text(doc["text"], chunk_size, chunk_overlap)
        for i, chunk in enumerate(text_chunks):
            all_chunks.append({
                "source": doc["source"],
                "chunk_id": i,
                "text": chunk,
            })
    return all_chunks
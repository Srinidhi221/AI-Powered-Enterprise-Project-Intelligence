"""
vector_store.py
Wraps ChromaDB for storing chunk embeddings and running similarity search.
Persists to disk under data/vector_db so the index survives restarts.
"""

from typing import List, Dict
import chromadb

PERSIST_DIR = "data/vector_db"
COLLECTION_NAME = "project_documents"

_client = None
_collection = None


def get_collection():
    """Lazy-loaded singleton Chroma collection, persisted to disk."""
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=PERSIST_DIR)
        _collection = _client.get_or_create_collection(name=COLLECTION_NAME)
    return _collection


def add_chunks(chunks: List[Dict], embeddings: List[List[float]]) -> int:
    """
    Store chunks and their embeddings in the vector index.

    Args:
        chunks: list of {"source": str, "chunk_id": int, "text": str}
        embeddings: list of embedding vectors, same length/order as chunks

    Returns:
        Number of chunks added.
    """
    if len(chunks) != len(embeddings):
        raise ValueError("chunks and embeddings must be the same length")
    if not chunks:
        return 0

    collection = get_collection()

    ids = [f"{c['source']}::{c['chunk_id']}" for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [{"source": c["source"], "chunk_id": c["chunk_id"]} for c in chunks]

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )
    return len(chunks)


def query_similar(query_embedding: List[float], top_k: int = 5) -> List[Dict]:
    """
    Find the top_k most similar chunks to a query embedding.

    Returns:
        List of {"text": str, "source": str, "chunk_id": int, "distance": float}
        ordered from most similar (lowest distance) to least.
    """
    collection = get_collection()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    output = []
    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    for doc, meta, dist in zip(documents, metadatas, distances):
        output.append({
            "text": doc,
            "source": meta["source"],
            "chunk_id": meta["chunk_id"],
            "distance": dist,
        })

    return output


def count_chunks() -> int:
    """Return total number of chunks currently stored."""
    return get_collection().count()
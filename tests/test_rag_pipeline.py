"""
tests/test_rag_pipeline.py
Run this directly: python tests/test_rag_pipeline.py
Tests embedding generation + vector store add/query (Sl No 10-13).
"""

from app.ingestion.extractors import extract_text
from app.rag.chunker import chunk_documents
from app.rag.embedder import embed_texts, embed_text
from app.rag.vector_store import add_chunks, query_similar, count_chunks

SAMPLE_DIR = "tests/sample_files"

def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {label} {detail}")


# --- Build chunks from a sample file ---
text = extract_text(f"{SAMPLE_DIR}/sample.txt")
docs = [{"source": "sample.txt", "text": text}]
chunks = chunk_documents(docs, chunk_size=50, chunk_overlap=10)
print(f"Prepared {len(chunks)} chunks from sample.txt")


# --- 10: Embedding generation ---
try:
    chunk_texts = [c["text"] for c in chunks]
    embeddings = embed_texts(chunk_texts)
    ok = len(embeddings) == len(chunks) and len(embeddings[0]) > 0
    check("10: Embedding generation", ok, f"- {len(embeddings)} vectors, dim {len(embeddings[0])}")
except Exception as e:
    check("10: Embedding generation", False, f"- ERROR: {e}")


# --- 11: Add chunks to vector store ---
try:
    before = count_chunks()
    added = add_chunks(chunks, embeddings)
    after = count_chunks()
    check("11: Add to vector store", added == len(chunks) and after >= before + added,
          f"- added {added}, total now {after}")
except Exception as e:
    check("11: Add to vector store", False, f"- ERROR: {e}")


# --- 12: Query similarity search ---
try:
    # pick a phrase you KNOW appears in your sample.txt for a meaningful test
    query = chunk_texts[0][:50]  # first 50 chars of first chunk as a self-check query
    q_embedding = embed_text(query)
    results = query_similar(q_embedding, top_k=3)
    ok = len(results) > 0 and results[0]["source"] == "sample.txt"
    check("12: Query similarity search", ok, f"- top result source: {results[0]['source'] if results else 'NONE'}, distance: {results[0]['distance'] if results else 'N/A'}")
except Exception as e:
    check("12: Query similarity search", False, f"- ERROR: {e}")


# --- 13: Mismatched chunks/embeddings length raises error ---
try:
    add_chunks(chunks, embeddings[:-1])  # deliberately shorter list
    check("13: Mismatched length validation", False, "- did NOT raise ValueError")
except ValueError as e:
    check("13: Mismatched length validation", True, f"- correctly raised: {e}")
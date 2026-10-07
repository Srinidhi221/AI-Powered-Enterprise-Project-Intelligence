"""
tests/test_milestone3.py
Run this directly: python -m tests.test_milestone3
End-to-end verification of Milestone 3 features:
1. Documentation Generation Agent
2. Project Health Scoring Module
3. Conversational RAG Project Intelligence Assistant
"""

import os
import time

from app.ingestion.extractors import extract_text
from app.rag.chunker import chunk_documents
from app.rag.embedder import embed_texts
from app.rag.vector_store import add_chunks, count_chunks
from app.agents.doc_agent import generate_documentation
from app.agents.health_agent import calculate_project_health
from app.rag.assistant import answer_project_query

SAMPLE_DIR = "tests/sample_files"


def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {label} {detail}")


def main():
    print("=== STARTING MILESTONE 3 VERIFICATION ===")

    # 1. Ingest sample document to ensure vector store has data
    sample_file = "campuscare_progress_update.txt"
    sample_path = os.path.join(SAMPLE_DIR, sample_file)

    if not os.path.exists(sample_path):
        sample_file = os.listdir(SAMPLE_DIR)[0]
        sample_path = os.path.join(SAMPLE_DIR, sample_file)

    print(f"Ingesting sample document: {sample_file}")
    text = extract_text(sample_path)
    docs = [{"source": sample_file, "text": text}]
    chunks = chunk_documents(docs, chunk_size=50, chunk_overlap=10)
    chunk_texts = [c["text"] for c in chunks]
    embeddings = embed_texts(chunk_texts)
    add_chunks(chunks, embeddings)
    print(f"Chunks indexed: {len(chunks)}. Total vector store count: {count_chunks()}")

    # 2. Test Documentation Generation Agent
    try:
        doc_res = generate_documentation(sample_file)
        ok = (
            doc_res.source == sample_file
            and isinstance(doc_res.user_stories, list)
            and isinstance(doc_res.risk_register, list)
            and isinstance(doc_res.action_items, list)
        )
        check("Doc Gen Agent", ok, f"- stories: {len(doc_res.user_stories)}, risks: {len(doc_res.risk_register)}, action items: {len(doc_res.action_items)}")
    except Exception as e:
        check("Doc Gen Agent", False, f"- ERROR: {e}")

    time.sleep(2)

    # 3. Test Project Health Scoring Module
    try:
        health_res = calculate_project_health(sample_file)
        ok = (
            health_res.source == sample_file
            and 0 <= health_res.overall_score <= 100
            and len(health_res.dimensions) > 0
        )
        check("Health Scoring Module", ok, f"- overall score: {health_res.overall_score}/100, status: {health_res.health_status}, dimensions: {len(health_res.dimensions)}")
    except Exception as e:
        check("Health Scoring Module", False, f"- ERROR: {e}")

    time.sleep(2)

    # 4. Test Conversational Project Intelligence Assistant (RAG Q&A)
    try:
        query = "What are the main risks and progress updates?"
        chat_res = answer_project_query(query, top_k=3)
        ok = (
            chat_res.question == query
            and len(chat_res.answer) > 20
            and len(chat_res.sources) > 0
        )
        check("Conversational RAG Assistant", ok, f"- answer snippet: '{chat_res.answer[:80]}...', cited sources: {len(chat_res.sources)}")
    except Exception as e:
        check("Conversational RAG Assistant", False, f"- ERROR: {e}")

    print("\n=== MILESTONE 3 VERIFICATION COMPLETED ===")


if __name__ == "__main__":
    main()

"""
tests/test_agents.py
Run this directly: python -m tests.test_agents
Validates the Milestone 2 agents (Scope, Risk, Blocker) end-to-end against
every sample document in tests/sample_files/, across formats (PDF, DOCX,
CSV, TXT). Requires GEMINI_API_KEY to be set in .env.
"""

import os
import time

from app.ingestion.extractors import extract_text
from app.rag.chunker import chunk_documents
from app.rag.embedder import embed_texts
from app.rag.vector_store import add_chunks, count_chunks
from app.agents.scope_agent import extract_scope
from app.agents.risk_agent import detect_risks
from app.agents.blocker_agent import extract_blockers

SAMPLE_DIR = "tests/sample_files"


def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"[{status}] {label} {detail}")


def ingest_file(filename):
    """Run a sample file through the Milestone 1 pipeline so agents can read it back."""
    path = os.path.join(SAMPLE_DIR, filename)
    text = extract_text(path)
    docs = [{"source": filename, "text": text}]
    chunks = chunk_documents(docs, chunk_size=50, chunk_overlap=10)
    chunk_texts = [c["text"] for c in chunks]
    embeddings = embed_texts(chunk_texts)
    add_chunks(chunks, embeddings)
    return len(chunks)


def validate_file(filename):
    print(f"\n=== {filename} ===")

    try:
        n_chunks = ingest_file(filename)
        print(f"Ingested {n_chunks} chunks. Store total: {count_chunks()}")
    except Exception as e:
        check(f"Ingestion: {filename}", False, f"- ERROR: {e}")
        return

    try:
        scope = extract_scope(filename)
        ok = scope.source == filename and isinstance(scope.project_goals, list)
        check("Scope agent", ok,
              f"- {len(scope.project_goals)} goals, {len(scope.deliverables)} deliverables, "
              f"{len(scope.milestones)} milestones")
    except Exception as e:
        check("Scope agent", False, f"- ERROR: {e}")
    time.sleep(2)

    try:
        risk_result = detect_risks(filename)
        ok = risk_result.source == filename and isinstance(risk_result.risks, list)
        valid_severities = all(r.severity in ("Low", "Medium", "High") for r in risk_result.risks)
        check("Risk agent", ok and valid_severities,
              f"- {len(risk_result.risks)} risks, forecast: "
              f"{risk_result.overall_delivery_forecast[:70]}...")
    except Exception as e:
        check("Risk agent", False, f"- ERROR: {e}")
    time.sleep(2)

    try:
        blocker_result = extract_blockers(filename)
        ok = blocker_result.source == filename and isinstance(blocker_result.action_items, list)
        valid_types = all(
            a.item_type in ("Blocker", "Pending Decision", "Action Item")
            for a in blocker_result.action_items
        )
        check("Blocker agent", ok and valid_types,
              f"- {len(blocker_result.action_items)} items")
    except Exception as e:
        check("Blocker agent", False, f"- ERROR: {e}")
    time.sleep(2)


# --- Discover and validate every sample file ---
sample_files = sorted(
    f for f in os.listdir(SAMPLE_DIR)
    if os.path.isfile(os.path.join(SAMPLE_DIR, f)) and not f.startswith(".")
)

print(f"Found {len(sample_files)} sample file(s): {sample_files}")

for filename in sample_files:
    validate_file(filename)

# --- Error handling: unknown source should fail cleanly, not crash ---
print("\n=== error handling ===")
try:
    extract_scope("this_file_was_never_uploaded.txt")
    check("Unknown source error handling", False, "- did NOT raise an error")
except Exception as e:
    check("Unknown source error handling", True, f"- correctly raised: {type(e).__name__}")
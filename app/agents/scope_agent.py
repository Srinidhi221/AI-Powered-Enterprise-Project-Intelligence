"""
app/agents/scope_agent.py
Scope and Deliverable Extraction Agent (Milestone 2, item 1).
Reads an already-ingested document and extracts project goals,
deliverables, milestones, and responsibilities via the cloud LLM.
"""

from app.agents.context import get_document_context
from app.agents.llm_client import call_json
from app.agents.prompts import SCOPE_SYSTEM_PROMPT, build_user_prompt
from app.models.schemas import ScopeExtractionResponse, Deliverable


def extract_scope(source: str) -> ScopeExtractionResponse:
    """
    Args:
        source: filename of a document already uploaded via /upload
                (i.e. already chunked + embedded + stored in Milestone 1's
                vector store).

    Returns:
        ScopeExtractionResponse grounded in that document's text.
    """
    document_text = get_document_context(source)
    user_prompt = build_user_prompt(source, document_text)

    result = call_json(SCOPE_SYSTEM_PROMPT, user_prompt)

    deliverables = [
        Deliverable(**d) for d in result.get("deliverables", [])
    ]

    return ScopeExtractionResponse(
        source=source,
        project_goals=result.get("project_goals", []),
        deliverables=deliverables,
        milestones=result.get("milestones", []),
        responsibilities=result.get("responsibilities", []),
        raw_model_notes=result.get("raw_model_notes"),
    )
"""
app/agents/doc_agent.py
Documentation Generation Agent (Milestone 3, Task 1).
Produces structured user stories, a risk register, and action items grounded
in an uploaded project document.
"""

from app.agents.context import get_document_context
from app.agents.llm_client import call_json
from app.agents.prompts import DOC_GEN_SYSTEM_PROMPT, build_user_prompt
from app.models.schemas import (
    DocumentationGenerationResponse,
    UserStory,
    RiskRegisterEntry,
    StructuredActionItem,
)


def generate_documentation(source: str) -> DocumentationGenerationResponse:
    """
    Args:
        source: filename of a document already uploaded via /upload.

    Returns:
        DocumentationGenerationResponse containing generated user stories,
        risk register entries, structured action items, and a summary.
    """
    document_text = get_document_context(source)
    user_prompt = build_user_prompt(source, document_text)

    result = call_json(DOC_GEN_SYSTEM_PROMPT, user_prompt)

    user_stories = [UserStory(**us) for us in result.get("user_stories", [])]
    risk_register = [RiskRegisterEntry(**rr) for rr in result.get("risk_register", [])]
    action_items = [StructuredActionItem(**ai) for ai in result.get("action_items", [])]

    return DocumentationGenerationResponse(
        source=source,
        user_stories=user_stories,
        risk_register=risk_register,
        action_items=action_items,
        generated_summary=result.get("generated_summary", ""),
    )

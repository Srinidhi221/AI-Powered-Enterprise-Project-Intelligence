"""
app/agents/blocker_agent.py
Blocker and Action Item Identification Agent (Milestone 2, item 3).
Extracts pending decisions, unresolved issues, and assigned action items
from meeting notes / progress updates, grounded in the document text.
"""

from app.agents.context import get_document_context
from app.agents.llm_client import call_json
from app.agents.prompts import BLOCKER_SYSTEM_PROMPT, build_user_prompt
from app.models.schemas import BlockerExtractionResponse, ActionItem


def extract_blockers(source: str) -> BlockerExtractionResponse:
    """
    Args:
        source: filename of a document already uploaded via /upload.

    Returns:
        BlockerExtractionResponse with a list of blockers / pending
        decisions / action items found in that document.
    """
    document_text = get_document_context(source)
    user_prompt = build_user_prompt(source, document_text)

    result = call_json(BLOCKER_SYSTEM_PROMPT, user_prompt)

    action_items = [ActionItem(**a) for a in result.get("action_items", [])]

    return BlockerExtractionResponse(
        source=source,
        action_items=action_items,
    )
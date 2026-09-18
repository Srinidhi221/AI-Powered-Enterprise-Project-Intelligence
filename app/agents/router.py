"""
app/agents/router.py
Milestone 2 endpoints. All of these operate on a document that has
ALREADY been uploaded via Milestone 1's /upload endpoint (so it exists in
the vector store) — they take the filename ("source") as a path parameter.
"""

from fastapi import APIRouter, HTTPException

from app.agents.context import SourceNotFoundError
from app.agents.llm_client import LLMNotConfiguredError
from app.agents.scope_agent import extract_scope
from app.agents.risk_agent import detect_risks
from app.agents.blocker_agent import extract_blockers
from app.models.schemas import (
    ScopeExtractionResponse,
    RiskDetectionResponse,
    BlockerExtractionResponse,
    AgentAnalysisResponse,
)

router = APIRouter()


def _handle_agent_errors(fn, *args):
    try:
        return fn(*args)
    except SourceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except LLMNotConfiguredError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        # e.g. LLM returned malformed JSON
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/agents/scope/{source}", response_model=ScopeExtractionResponse)
async def get_scope(source: str):
    """Scope and Deliverable Extraction Agent."""
    return _handle_agent_errors(extract_scope, source)


@router.get("/agents/risks/{source}", response_model=RiskDetectionResponse)
async def get_risks(source: str):
    """Risk Detection and Delivery Forecasting Agent."""
    return _handle_agent_errors(detect_risks, source)


@router.get("/agents/blockers/{source}", response_model=BlockerExtractionResponse)
async def get_blockers(source: str):
    """Blocker and Action Item Identification Agent."""
    return _handle_agent_errors(extract_blockers, source)


@router.get("/agents/analyze/{source}", response_model=AgentAnalysisResponse)
async def analyze_document(source: str):
    """
    Runs all three Milestone 2 agents on one document and returns a
    combined result. Useful for a single dashboard call instead of three
    separate requests.
    """
    scope = _handle_agent_errors(extract_scope, source)
    risks = _handle_agent_errors(detect_risks, source)
    blockers = _handle_agent_errors(extract_blockers, source)

    return AgentAnalysisResponse(
        source=source,
        scope=scope,
        risks=risks,
        blockers=blockers,
    )


from app.rag.vector_store import list_sources


@router.get("/documents")
async def list_documents():
    """
    List filenames currently indexed in the vector store — i.e. every
    document available for the Scope/Risk/Blocker agents to analyze.
    Used by the frontend to populate the document picker.
    """
    return {"sources": list_sources()}
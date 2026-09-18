"""
models/schemas.py
Pydantic models defining API request/response shapes.
"""

from pydantic import BaseModel
from typing import List, Optional


class UploadResponse(BaseModel):
    filename: str
    chunks_added: int
    total_chunks_in_store: int


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


class RetrievedChunk(BaseModel):
    text: str
    source: str
    chunk_id: int
    distance: float


class QueryResponse(BaseModel):
    query: str
    results: List[RetrievedChunk]


# ---------------------------------------------------------------------------
# Milestone 2: agent output shapes
# ---------------------------------------------------------------------------

class Deliverable(BaseModel):
    name: str
    description: str
    due_or_timeline: Optional[str] = None
    owner: Optional[str] = None


class ScopeExtractionResponse(BaseModel):
    source: str
    project_goals: List[str]
    deliverables: List[Deliverable]
    milestones: List[str]
    responsibilities: List[str]
    raw_model_notes: Optional[str] = None


class RiskItem(BaseModel):
    risk: str
    category: str
    severity: str
    evidence: str
    forecasted_impact: Optional[str] = None


class RiskDetectionResponse(BaseModel):
    source: str
    risks: List[RiskItem]
    overall_delivery_forecast: str


class ActionItem(BaseModel):
    item: str
    item_type: str
    owner: Optional[str] = None
    status: Optional[str] = None
    evidence: str


class BlockerExtractionResponse(BaseModel):
    source: str
    action_items: List[ActionItem]


class AgentAnalysisResponse(BaseModel):
    source: str
    scope: ScopeExtractionResponse
    risks: RiskDetectionResponse
    blockers: BlockerExtractionResponse
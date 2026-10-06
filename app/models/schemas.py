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


# ---------------------------------------------------------------------------
# Milestone 3: Task 1 - Documentation Generation schemas
# ---------------------------------------------------------------------------

class UserStory(BaseModel):
    id: str
    title: str
    as_a: str
    i_want: str
    so_that: str
    acceptance_criteria: List[str]
    priority: Optional[str] = "Medium"
    estimated_story_points: Optional[int] = None


class UserStoriesResponse(BaseModel):
    source: str
    user_stories: List[UserStory]


class RiskRegisterEntry(BaseModel):
    risk_id: str
    risk_description: str
    category: str
    probability: str
    impact: str
    severity: str
    mitigation_strategy: str
    owner: Optional[str] = "Unassigned"
    status: Optional[str] = "Open"


class RiskRegisterResponse(BaseModel):
    source: str
    risk_register: List[RiskRegisterEntry]


class StructuredActionItem(BaseModel):
    id: str
    task: str
    item_type: str
    priority: str
    assignee: Optional[str] = None
    status: str = "Open"
    due_date_or_sprint: Optional[str] = None


class ActionItemsResponse(BaseModel):
    source: str
    action_items: List[StructuredActionItem]


class DocumentationGenerationResponse(BaseModel):
    source: str
    user_stories: List[UserStory]
    risk_register: List[RiskRegisterEntry]
    action_items: List[StructuredActionItem]
    generated_summary: Optional[str] = None


# ---------------------------------------------------------------------------
# Milestone 3: Task 2 - Project Health Scoring schemas
# ---------------------------------------------------------------------------

class HealthDimension(BaseModel):
    dimension: str
    score: int
    status: str
    summary: str


class ProjectHealthResponse(BaseModel):
    source: str
    overall_score: int
    health_status: str
    summary: str
    dimensions: List[HealthDimension]
    recommendations: List[str]


# ---------------------------------------------------------------------------
# Milestone 3: Task 3 - Conversational Assistant schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    question: str
    top_k: int = 5


class ChatSourceCitation(BaseModel):
    source: str
    chunk_id: int
    relevance_score: float
    text_snippet: str


class ChatResponse(BaseModel):
    question: str
    answer: str
    sources: List[ChatSourceCitation]


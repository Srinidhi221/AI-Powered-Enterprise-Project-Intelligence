"""
app/agents/health_agent.py
Project Health Scoring Module (Milestone 3, Task 2).
Calculates overall project health score and dimension-wise breakdowns
(scope clarity, timeline risk, blocker severity) grounded in document content.
"""

from app.agents.context import get_document_context
from app.agents.llm_client import call_json
from app.agents.prompts import HEALTH_SCORING_PROMPT, build_user_prompt
from app.models.schemas import (
    ProjectHealthResponse,
    HealthDimension,
)


def calculate_project_health(source: str) -> ProjectHealthResponse:
    """
    Args:
        source: filename of a document already uploaded via /upload.

    Returns:
        ProjectHealthResponse containing overall health score, status,
        dimension breakdown (Scope Clarity, Timeline Risk, Blocker Severity),
        summary, and actionable recommendations.
    """
    document_text = get_document_context(source)
    user_prompt = build_user_prompt(source, document_text)

    result = call_json(HEALTH_SCORING_PROMPT, user_prompt)

    dimensions = [HealthDimension(**d) for d in result.get("dimensions", [])]

    return ProjectHealthResponse(
        source=source,
        overall_score=result.get("overall_score", 70),
        health_status=result.get("health_status", "Needs Attention"),
        summary=result.get("summary", ""),
        dimensions=dimensions,
        recommendations=result.get("recommendations", []),
    )

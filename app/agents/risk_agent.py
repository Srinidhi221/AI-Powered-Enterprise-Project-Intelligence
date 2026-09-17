"""
app/agents/risk_agent.py
Risk Detection and Delivery Forecasting Agent (Milestone 2, item 2).
Identifies schedule risks, dependency gaps, and delivery challenges,
grounded in a specific ingested document.
"""

from app.agents.context import get_document_context
from app.agents.llm_client import call_json
from app.agents.prompts import RISK_SYSTEM_PROMPT, build_user_prompt
from app.models.schemas import RiskDetectionResponse, RiskItem


def detect_risks(source: str) -> RiskDetectionResponse:
    """
    Args:
        source: filename of a document already uploaded via /upload.

    Returns:
        RiskDetectionResponse with a list of risks (category, severity,
        evidence) plus an overall delivery forecast.
    """
    document_text = get_document_context(source)
    user_prompt = build_user_prompt(source, document_text)

    result = call_json(RISK_SYSTEM_PROMPT, user_prompt)

    risks = [RiskItem(**r) for r in result.get("risks", [])]

    return RiskDetectionResponse(
        source=source,
        risks=risks,
        overall_delivery_forecast=result.get("overall_delivery_forecast", ""),
    )
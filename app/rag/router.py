"""
app/rag/router.py
/query endpoint: embeds a user's query and retrieves the most similar
chunks from the vector store. This lets you verify retrieval quality
before any chat/agent logic is built on top in later milestones.
"""

from fastapi import APIRouter, HTTPException

from app.rag.embedder import embed_text
from app.rag.vector_store import query_similar, count_chunks
from app.rag.assistant import answer_project_query
from app.agents.llm_client import LLMNotConfiguredError
from app.models.schemas import (
    QueryRequest,
    QueryResponse,
    RetrievedChunk,
    ChatRequest,
    ChatResponse,
)

router = APIRouter()


@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    if count_chunks() == 0:
        raise HTTPException(
            status_code=400,
            detail="Vector store is empty. Upload a document first via /upload.",
        )

    query_embedding = embed_text(request.query)
    raw_results = query_similar(query_embedding, top_k=request.top_k)

    results = [RetrievedChunk(**r) for r in raw_results]

    return QueryResponse(query=request.query, results=results)


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    Conversational Project Intelligence Assistant.
    Answers user queries grounded in uploaded document content via RAG.
    """
    try:
        return answer_project_query(request.question, top_k=request.top_k)
    except LLMNotConfiguredError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant error: {e}")
"""
app/main.py
FastAPI application entrypoint.
Run with: uvicorn app.main:app --reload
Then open http://127.0.0.1:8000/docs for interactive testing (Swagger UI).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ingestion.router import router as ingestion_router
from app.rag.router import router as rag_router
from app.agents.router import router as agents_router 

app = FastAPI(
    title="AI Project Intelligence & Risk Advisor",
    description="Milestone 1: Document ingestion + RAG pipeline, Milestone 2: Scope, Risk, and Blocker agents.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this before any real deployment
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingestion_router, tags=["Ingestion"])
app.include_router(rag_router, tags=["RAG"])
app.include_router(agents_router, tags=["Agents"])  


@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Project Intelligence API is running"}
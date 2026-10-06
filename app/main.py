"""
app/main.py
FastAPI application entrypoint.
Run with: uvicorn app.main:app --reload
Then open http://127.0.0.1:8000/docs for interactive testing (Swagger UI).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from app.ingestion.router import router as ingestion_router
from app.rag.router import router as rag_router
from app.agents.router import router as agents_router 

app = FastAPI(
    title="AI Project Intelligence & Risk Advisor",
    description="Milestone 1: Ingestion + RAG, Milestone 2: Scope/Risk/Blocker agents, Milestone 3: Documentation Generation",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingestion_router, tags=["Ingestion"])
app.include_router(rag_router, tags=["RAG"])
app.include_router(agents_router, tags=["Agents"])  


@app.get("/")
async def root():
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "index.html")
    if os.path.exists(frontend_path):
        return FileResponse(frontend_path)
    return {"status": "ok", "message": "AI Project Intelligence API is running"}
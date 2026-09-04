"""
models/schemas.py
Pydantic models defining API request/response shapes.
"""

from pydantic import BaseModel
from typing import List


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
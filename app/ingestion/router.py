"""
app/ingestion/router.py
/upload endpoint: accepts a file, runs it through the full pipeline
(extract -> chunk -> embed -> store) and reports how many chunks were added.
"""

import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import UPLOAD_DIR, CHUNK_SIZE, CHUNK_OVERLAP
from app.ingestion.extractors import extract_text, UnsupportedFileTypeError
from app.rag.chunker import chunk_documents
from app.rag.embedder import embed_texts
from app.rag.vector_store import add_chunks, count_chunks
from app.models.schemas import UploadResponse

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    # 1. Save the uploaded file to disk
    save_path = Path(UPLOAD_DIR) / file.filename
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 2. Extract raw text
    try:
        text = extract_text(str(save_path))
    except UnsupportedFileTypeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # 3. Chunk it
    chunks = chunk_documents(
        [{"source": file.filename, "text": text}],
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    if not chunks:
        raise HTTPException(status_code=422, detail="No chunks produced from file")

    # 4. Embed
    chunk_texts = [c["text"] for c in chunks]
    embeddings = embed_texts(chunk_texts)

    # 5. Store
    added = add_chunks(chunks, embeddings)

    return UploadResponse(
        filename=file.filename,
        chunks_added=added,
        total_chunks_in_store=count_chunks(),
    )
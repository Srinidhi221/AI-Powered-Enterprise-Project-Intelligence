"""
config.py
Central place for paths and pipeline settings so nothing is hardcoded
in multiple files.
"""

import os

# Where uploaded files get saved before processing
UPLOAD_DIR = "data/uploads"

# Where the Chroma vector index is persisted
VECTOR_DB_DIR = "data/vector_db"

# Chunking settings (word count based)
CHUNK_SIZE = 200
CHUNK_OVERLAP = 40

# Embedding model (local, no API key required)
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# Make sure required folders exist at startup
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_DB_DIR, exist_ok=True)
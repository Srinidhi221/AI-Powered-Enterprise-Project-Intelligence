"""
config.py
Central place for paths and pipeline settings so nothing is hardcoded
in multiple files.
"""

import os
from dotenv import load_dotenv

# Load variables from a .env file in the project root (if present).
# Keeps API keys out of source control.
load_dotenv()

# Where uploaded files get saved before processing
UPLOAD_DIR = "data/uploads"

# Where the Chroma vector index is persisted
VECTOR_DB_DIR = "data/vector_db"

# Chunking settings (word count based)
CHUNK_SIZE = 200
CHUNK_OVERLAP = 40

# Embedding model (local, no API key required)
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# --- Milestone 2: cloud LLM settings for the agent pipeline ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")
AGENT_TEMPERATURE = 0.2
AGENT_MAX_CONTEXT_CHARS = 12000

# Make sure required folders exist at startup
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_DB_DIR, exist_ok=True)
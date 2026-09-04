"""
extractors.py
Converts uploaded files (PDF, DOCX, CSV, TXT) into raw text strings.
Each extractor takes a file path and returns a single text string.
"""

from pathlib import Path
import pandas as pd
from pypdf import PdfReader
from docx import Document


class UnsupportedFileTypeError(Exception):
    """Raised when a file extension isn't one we know how to extract."""
    pass


def extract_pdf(file_path: str) -> str:
    """Extract text from a PDF, page by page."""
    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages_text.append(text)
    return "\n".join(pages_text).strip()


def extract_docx(file_path: str) -> str:
    """Extract text from a Word document, paragraph by paragraph."""
    doc = Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def extract_csv(file_path: str) -> str:
    """
    Extract text from a CSV by converting each row into a readable line.
    Example row: {"task": "Design DB", "status": "Done"} ->
    "task: Design DB | status: Done"
    """
    df = pd.read_csv(file_path)
    lines = []
    for _, row in df.iterrows():
        line = " | ".join(f"{col}: {row[col]}" for col in df.columns)
        lines.append(line)
    return "\n".join(lines).strip()


def extract_txt(file_path: str) -> str:
    """Read a plain text file."""
    return Path(file_path).read_text(encoding="utf-8", errors="ignore").strip()


# Maps file extensions to their extractor function
EXTRACTOR_MAP = {
    ".pdf": extract_pdf,
    ".docx": extract_docx,
    ".csv": extract_csv,
    ".txt": extract_txt,
}


def extract_text(file_path: str) -> str:
    """
    Main entry point. Detects file type from extension and routes
    to the correct extractor. Raises UnsupportedFileTypeError for
    anything else.
    """
    ext = Path(file_path).suffix.lower()
    extractor = EXTRACTOR_MAP.get(ext)

    if extractor is None:
        raise UnsupportedFileTypeError(
            f"No extractor available for '{ext}' files. "
            f"Supported types: {list(EXTRACTOR_MAP.keys())}"
        )

    text = extractor(file_path)

    if not text:
        raise ValueError(f"No extractable text found in {file_path}")

    return text
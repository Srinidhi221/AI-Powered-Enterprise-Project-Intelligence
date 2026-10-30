# AI-Powered Enterprise Project Intelligence

An AI Project Intelligence & Risk Advisor. Teams upload their existing project documents (proposals, SRS files, meeting notes, progress updates, task lists) and get back automated insights, risk forecasts, generated documentation and a project health score. A chat assistant answers questions about the project, grounded only in the uploaded documents.

> **Status:** Work in progress. The core pipeline runs locally; some bugs are still being fixed. See [Known Issues](#known-issues) and [Roadmap](#roadmap).

## The Problem

Software teams and student project groups often struggle with incomplete planning, missed deadlines, undetected risks and poor documentation. The information needed to catch these problems already exists, but it is scattered across documents and rarely analysed. The result is reactive problem-solving instead of proactive project management.

## What It Does

- **Ingests project artifacts:** PDF, DOCX, CSV and plain text
- **Builds a unified knowledge base** using a RAG pipeline (chunking, embeddings, vector index)
- **Runs a multi-agent pipeline** that:
  - extracts scope, goals, milestones, timelines and responsibilities
  - detects risks and forecasts delivery challenges
  - identifies blockers, pending decisions and action items
  - generates user stories, a risk register and action item lists
- **Scores project health** with a dimension-wise breakdown (scope clarity, timeline risk, blocker count)
- **Answers questions in natural language**, for example "Are we on track?" or "What are our biggest risks?"
- **Shows a dashboard** with the health score, risks, action items and scope summary
- **Supports incremental uploads**, so new meeting notes or updates can be added to the knowledge base

## Architecture

```
 Uploaded documents (PDF / DOCX / CSV / TXT)
              |
              v
   Document ingestion & text extraction
              |
              v
   Chunking --> Embeddings --> ChromaDB (vector store)
              |
              v
     Retrieval of relevant context
              |
     +--------+-----------------------------+
     |                                      |
     v                                      v
 Multi-agent pipeline (LLM)         Conversational assistant
  - Scope & deliverables            (grounded Q&A over documents)
  - Risk & delivery forecasting
  - Blockers & action items
  - Documentation generation
     |
     v
 Project health scoring
     |
     v
 FastAPI backend  <-->  Frontend dashboard
```

<!-- Replace the diagram above with an exported image if you make one: docs/architecture.png -->

## Tech Stack

| Layer | Tools |
| --- | --- |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Document parsing | pypdf, python-docx, pandas |
| Embeddings | sentence-transformers |
| Vector store | ChromaDB |
| LLM agents | OpenAI API |
| Testing | pytest, httpx |
| Frontend | <!-- add: e.g. React / Streamlit / HTML+JS --> |

## Project Structure

```
.
├── app/          # FastAPI backend: ingestion, RAG pipeline, agents, scoring
├── frontend/     # Dashboard and chat UI
├── data/         # Sample project documents
├── docs/         # Documentation
├── tests/        # pytest test suite
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.10+
- An OpenAI API key

### Installation

```bash
git clone https://github.com/Srinidhi221/AI-Powered-Enterprise-Project-Intelligence.git
cd AI-Powered-Enterprise-Project-Intelligence

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the project root:

```
OPENAI_API_KEY=your_api_key_here
```

### Run the backend

```bash
uvicorn app.main:app --reload
```

<!-- Check that app.main:app matches your actual entry point. -->

The API docs are then available at `http://localhost:8000/docs`.

### Run the frontend

<!-- Add the command to start your frontend, e.g. `cd frontend && npm install && npm start` -->

### Run the tests

```bash
pytest
```

## Usage

1. Upload one or more project documents (proposal, SRS, meeting notes, progress updates, task list).
2. Wait for the knowledge base to be built.
3. View extracted scope, risks, action items and the health score on the dashboard.
4. Ask the assistant questions about the project.
5. Upload new notes or updates at any time to refresh the insights.

## Screenshots

<!-- Add 2 to 3 screenshots: dashboard, chat assistant, generated risk register -->

## Implementation Status

Tick what currently works:

- [ ] Document ingestion (PDF, DOCX, CSV, plain text)
- [ ] RAG pipeline (chunking, embeddings, Chroma indexing)
- [ ] Scope and deliverable extraction agent
- [ ] Risk detection and delivery forecasting agent
- [ ] Blocker and action item agent
- [ ] Documentation generation (user stories, risk register, action items)
- [ ] Project health scoring
- [ ] Conversational assistant
- [ ] Insights dashboard
- [ ] Incremental document upload
- [ ] Automated tests

## Known Issues

<!-- Be specific. Honest notes here look professional. Examples: -->
- <!-- e.g. Large PDFs are slow to ingest -->
- <!-- e.g. Health score weighting needs tuning -->
- Not yet deployed; runs locally only

## Roadmap

- [ ] Fix the known issues above
- [ ] Deploy a live demo (Hugging Face Spaces, Render or Streamlit Community Cloud)
- [ ] Add retrieval evaluation on a set of test questions
- [ ] Improve agent output validation across more document types

## Author

**Srinidhi** | [GitHub](https://github.com/Srinidhi221)

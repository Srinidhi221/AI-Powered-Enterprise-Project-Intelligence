# 🚀 AI-Powered Enterprise Project Intelligence & Risk Advisor

An end-to-end, multi-agent AI project intelligence, document analysis, and risk advisory platform. The system ingests unstructured project documents (`.pdf`, `.docx`, `.xlsx`, `.csv`, `.txt`), parses and indexes them into a hybrid vector RAG knowledge base, orchestrates specialized AI agents (Scope, Risk, Blocker, Documentation, and Health agents), and provides an executive analytics dashboard.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Folder & Directory Structure](#-folder--directory-structure)
3. [Technology Stack](#-technology-stack)
4. [Prerequisites](#-prerequisites)
5. [Installation & Local Setup Guide](#-installation--local-setup-guide)
   - [Backend Setup (FastAPI & RAG Pipeline)](#1-backend-setup-fastapi--rag-pipeline)
   - [Frontend Setup (React + TypeScript + Vite)](#2-frontend-v2-setup-react-18--vite)
6. [Core System Capabilities & Workflows](#-core-system-capabilities--workflows)
7. [API Endpoints & Testing](#-api-endpoints--testing)
8. [License & Acknowledgments](#-license--acknowledgments)

---

## ✨ Key Features

- 📁 **Multi-Project Workspaces & Folder Isolation**:
  - Support for creating separate project folders (e.g., `CampusCare Portal`, `ExhibitionPlan`).
  - Switching between project folders dynamically isolates uploaded documents, risk registers, scope matrices, and grounded AI assistant chat history per project.
  
- ⏱️ **Scroll-Triggered Number Counter Animations**:
  - All numerical KPI metrics, health scores, risk counters, and days to milestone count up smoothly using custom `IntersectionObserver` frame animations.

- 📄 **Multi-Format Document Ingestion Engine**:
  - Drag-and-drop batch upload supporting PDF, Word (`.docx`), Excel (`.xlsx`), CSV, and plain text files with extraction progress streaming.

- 🤖 **Multi-Agent Risk & Scope Detection**:
  - **Scope Agent**: Extracts project goals, milestone dates, and owner commitments.
  - **Risk Agent**: Identifies schedule, technical, resource, and scope threats categorized by impact and likelihood (5x5 matrix).
  - **Blocker Agent**: Detects overdue action items, unassigned tasks, and pending decision bottlenecks.
  - **Health Agent**: Computes weighted Health Index scores (0–100) across Scope Clarity, Timeline Risk, and Blocker Resolution dimensions.

- 🧪 **Interactive What-If Simulation Engine**:
  - Adjust project milestone deadlines, resolve hypothetical blockers, and evaluate predicted project health score deltas in real-time.

- 📄 **Executive Downloadable PDF Reports**:
  - Built-in multi-page PDF generation engine with slate header banners, health score gauges, KPI grid cards, formatted risk tables, and page footers.

- 🎨 **Modern Editorial UI System**:
  - Pure Black (`#000000`) and Gold (`#EAB308`) high-contrast Dark Mode with flat Notion/Linear editorial layout and Light/Dark/System theme switching.

---

## 📁 Folder & Directory Structure

```text
AI-Powered-Enterprise-Project-Intelligence/
├── app/                                # FastAPI Backend & RAG AI Core
│   ├── main.py                         # FastAPI app entry point & routes
│   ├── ingestion.py                    # Multi-format document parsers (PDF, DOCX, CSV, TXT)
│   ├── vector_store.py                 # ChromaDB dense vector indexing & hybrid search
│   ├── agents/                         # Multi-agent AI pipelines
│   │   ├── scope_agent.py              # Scope & milestone extractor
│   │   ├── risk_agent.py               # Risk scoring & impact matrix engine
│   │   ├── blocker_agent.py            # Blocker & action item tracker
│   │   ├── health_agent.py             # Weighted Health Score calculator
│   │   └── doc_agent.py                # User story & acceptance criteria generator
│   └── config.py                       # Application configuration & env settings
│
├── data/                               # Sample raw document store & vectors
├── docs/                               # Architecture blueprints & design specifications
├── requirements.txt                    # Python dependencies
├── tests/                              # Pytest automated test suites
│   ├── test_ingestion.py
│   ├── test_rag_pipeline.py
│   └── test_milestone3.py
│
├── frontend-v2/                        # Standalone Component-Based React App (Modern UI)
│   ├── index.html                      # App HTML entry point
│   ├── vite.config.ts                  # Vite build configuration (@tailwindcss/vite)
│   ├── package.json                    # Node dependencies & scripts
│   ├── src/
│   │   ├── main.tsx                    # React app bootstrapping
│   │   ├── App.tsx                     # React Router 7 page routing
│   │   ├── index.css                   # Tailwind v4 import & design system tokens
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces (Project, Risk, Deliverable, etc.)
│   │   ├── context/
│   │   │   ├── ProjectContext.tsx      # Multi-project workspace state & simulation store
│   │   │   └── ThemeContext.tsx        # Light/Dark/System theme manager
│   │   ├── services/
│   │   │   └── mockData.ts             # Initial multi-project datasets (CampusCare, ExhibitionPlan)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AnimatedCounter.tsx      # Scroll-triggered number counter animation
│   │   │   │   ├── CreateProjectModal.tsx   # Modal to create new project folders
│   │   │   │   ├── RiskDetailDrawer.tsx     # Side drawer for deep-dive risk inspection
│   │   │   │   ├── SeverityBadge.tsx        # Color-coded status badges
│   │   │   │   └── SourceCitationChip.tsx   # Grounded document citation snippet button
│   │   │   ├── layout/
│   │   │   │   ├── MainLayout.tsx           # Workspace shell container
│   │   │   │   ├── Sidebar.tsx              # Left navigation sidebar
│   │   │   │   └── TopBar.tsx               # Top header with project switcher dropdown
│   │   │   ├── dashboard/
│   │   │   │   ├── HeroStrip.tsx            # Overall Health score & AI narrative summary
│   │   │   │   ├── KpiTiles.tsx             # Animated KPI metric strip
│   │   │   │   └── AnalysisPanels.tsx       # 5x5 Risk Heatmap & severity breakdowns
│   │   │   └── chat/
│   │   │       └── AssistantPanel.tsx       # Full-screen grounded Q&A AI assistant
│   │   └── pages/
│   │       ├── Dashboard.tsx            # Main analytics dashboard overview
│   │       ├── ScopeDeliverables.tsx    # Scope matrix & deliverable commitments
│   │       ├── Risks.tsx                # Risk register & 5x5 heatmap visualizer
│   │       ├── BlockersActionItems.tsx  # Blocker log & action item tracker
│   │       ├── HealthScoreDetail.tsx    # Health index calculation deep-dive
│   │       ├── SimulationWhatIf.tsx     # Interactive scenario simulation engine
│   │       ├── UploadIngestion.tsx      # Drag-and-drop file ingestion workspace
│   │       ├── DocumentLibrary.tsx      # Knowledge base chunk audit library
│   │       ├── GeneratedDocs.tsx        # User stories & SRS requirements viewer
│   │       ├── ReportsExport.tsx        # Executive PDF report download center
│   │       ├── ProjectsHome.tsx         # Projects workspace overview grid
│   │       └── Settings.tsx             # Application settings & threshold config
│
└── frontend/                           # Legacy frontend (preserved untouched)
```

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Core Library**: React 18 with TypeScript 5
- **Build Tool**: Vite 8 with HMR
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom CSS variable design system
- **Icons**: Lucide React
- **Charts & Visualization**: Recharts 3.x
- **Animations**: Framer Motion & custom `requestAnimationFrame` cubic easing
- **Export & PDF**: jsPDF multi-page canvas drawing
- **State Management**: React Context API with Zustand support

### Backend & AI Architecture
- **Framework**: Python 3.10+ with FastAPI
- **Vector Database**: ChromaDB (dense vector embeddings & hybrid RAG search)
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Document Extractors**: `pypdf`, `python-docx`, `pandas`
- **Testing**: Pytest & HTTPX

---

## ⚙️ Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10 or higher ([Download Python](https://www.python.org/))
- **Git**: Installed for source control

---

## 🚀 Installation & Local Setup Guide

### 1. Backend Setup (FastAPI & RAG Pipeline)

1. Open a terminal in the project root directory:
   ```bash
   cd d:\infosys-ai-track\platform\AI-Powered-Enterprise-Project-Intelligence
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Copy `.env.example` to `.env` and provide your OpenAI API key (optional for cloud LLM features):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   VECTOR_STORE_PATH=./data/chroma_db
   ```

5. Launch the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will run at `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (React 18 + Vite)

1. Navigate to the `frontend-v2` directory:
   ```bash
   cd frontend-v2
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

5. Build for production (verifies TypeScript compilation and creates optimized static bundle):
   ```bash
   npm run build
   ```

---

## ⚡ Core System Capabilities & Workflows

### 1. Project Folder Creation & Switching (`ExhibitionPlan`)
- Click **"+ Create Project Folder"** in the TopBar dropdown or Projects Overview page.
- Enter project details (e.g. Project Name: `ExhibitionPlan`, Description: `Event staging and power vendor management`).
- Switching to `ExhibitionPlan` instantly updates all dashboard metrics, scope deliverables, risks, blockers, document libraries, and Q&A chat context.

### 2. Document Ingestion & AI Agent Pipeline
- Go to **Upload & Ingestion** page (`/upload`).
- Drag and drop `.pdf`, `.docx`, `.xlsx`, `.csv`, or `.txt` files.
- The pipeline streams live stage updates (Parsing → Chunking → Embedding → Agent Analysis).
- Extracted risks, deliverables, and blockers automatically appear in the active project's database.

### 3. What-If Scenario Simulation
- Navigate to **What-If Simulation** (`/simulation`).
- Adjust the deadline shift slider (+/- days) or resolve hypothetical blockers.
- Observe the predicted Health Index score recalculate dynamically with breakdown deltas.

### 4. Executive PDF Report Download
- Navigate to **Reports & Export** (`/reports`).
- Select your template (Executive Summary, Full Comprehensive, Risk Only, or Weekly Status).
- Click **"Download Executive PDF Report"** to generate a formatted PDF with headers, risk tables, KPI boxes, and page numbers.

---

## 🧪 API Endpoints & Testing

### Running Backend Tests
```bash
pytest tests/ -v
```

### Key API Endpoints
- `POST /api/ingest`: Upload document files for parsing and indexing.
- `GET /api/project/{id}`: Retrieve project health score and executive summary.
- `GET /api/risks`: Retrieve extracted risk items and severity matrix.
- `POST /api/chat`: Grounded Q&A endpoint backed by ChromaDB vector search.

---

## 📝 License & Acknowledgments

Built for the **Infosys AI Track Project Intelligence Platform**.  
Designed and developed with modern agentic AI architecture, RAG vector retrieval, and high-contrast editorial UI standards.

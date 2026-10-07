# 💻 AI Project Intelligence & Risk Advisor - Frontend (v2)

Standalone, component-based React 18 + TypeScript + Vite web application built for **AI-Powered Enterprise Project Intelligence & Risk Advisor**.

---

## ⚡ Quick Start

```bash
# 1. Install Node.js dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (compiles TypeScript & bundles Vite assets)
npm run build
```

Application will run at: `http://localhost:5173`

---

## 🎨 Key Features & Components

- ⏱️ **Animated Counter Component** ([`AnimatedCounter.tsx`](file:///d:/infosys-ai-track/platform/AI-Powered-Enterprise-Project-Intelligence/frontend-v2/src/components/common/AnimatedCounter.tsx)):
  - Scroll-triggered cubic easing number counting for all numerical metrics across all pages.

- 📁 **Multi-Project Workspaces** ([`ProjectContext.tsx`](file:///d:/infosys-ai-track/platform/AI-Powered-Enterprise-Project-Intelligence/frontend-v2/src/context/ProjectContext.tsx)):
  - Isolated state management for multiple project folders (e.g. `CampusCare Portal`, `ExhibitionPlan`).
  - Create new project folders via [`CreateProjectModal.tsx`](file:///d:/infosys-ai-track/platform/AI-Powered-Enterprise-Project-Intelligence/frontend-v2/src/components/common/CreateProjectModal.tsx).

- 📄 **Executive PDF Report Generator** ([`ReportsExport.tsx`](file:///d:/infosys-ai-track/platform/AI-Powered-Enterprise-Project-Intelligence/frontend-v2/src/pages/ReportsExport.tsx)):
  - Multi-page PDF drawing engine with dark slate header banners, health score gauges, KPI grid cards, formatted risk tables, and page footers.

- 📊 **Interactive Dashboard & Views**:
  - `Dashboard.tsx`: Main overview with 5x5 Risk Heatmap, Hero Health Score, and KPI tiles.
  - `ScopeDeliverables.tsx`: Deliverables matrix and commitment tracking.
  - `Risks.tsx`: Risk register with severity filtering and detail drawer.
  - `BlockersActionItems.tsx`: Active blockers log with overdue tracking.
  - `HealthScoreDetail.tsx`: Weighted sub-score calculation and historical trends.
  - `SimulationWhatIf.tsx`: Scenario simulation engine with interactive sliders.
  - `UploadIngestion.tsx`: Multi-format document batch upload workspace.
  - `DocumentLibrary.tsx`: Document chunk audit library.
  - `AssistantChat.tsx`: Full-screen grounded Q&A AI assistant.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 18 & TypeScript 5
- **Build Tool**: Vite 8 (`@tailwindcss/vite`)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts 3.x
- **Icons**: Lucide React
- **Export Engine**: jsPDF

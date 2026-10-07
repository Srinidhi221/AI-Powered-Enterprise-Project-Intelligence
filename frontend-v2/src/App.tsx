import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { MainLayout } from './components/layout/MainLayout';

import { ProjectsHome } from './pages/ProjectsHome';
import { UploadIngestion } from './pages/UploadIngestion';
import { Dashboard } from './pages/Dashboard';
import { ScopeDeliverables } from './pages/ScopeDeliverables';
import { Risks } from './pages/Risks';
import { BlockersActionItems } from './pages/BlockersActionItems';
import { GeneratedDocs } from './pages/GeneratedDocs';
import { HealthScoreDetail } from './pages/HealthScoreDetail';
import { AssistantChat } from './pages/AssistantChat';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { SimulationWhatIf } from './pages/SimulationWhatIf';
import { ReportsExport } from './pages/ReportsExport';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<ProjectsHome />} />
              <Route path="upload" element={<UploadIngestion />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="scope" element={<ScopeDeliverables />} />
              <Route path="risks" element={<Risks />} />
              <Route path="blockers" element={<BlockersActionItems />} />
              <Route path="generated-docs" element={<GeneratedDocs />} />
              <Route path="health" element={<HealthScoreDetail />} />
              <Route path="chat" element={<AssistantChat />} />
              <Route path="documents" element={<DocumentLibrary />} />
              <Route path="simulation" element={<SimulationWhatIf />} />
              <Route path="reports" element={<ReportsExport />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;

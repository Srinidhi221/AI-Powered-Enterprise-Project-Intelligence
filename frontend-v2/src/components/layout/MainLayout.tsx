import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { WhatChangedBanner } from '../common/WhatChangedBanner';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { IncrementalUpdateModal } from '../common/IncrementalUpdateModal';
import { RiskDetailDrawer } from '../common/RiskDetailDrawer';
import { AssistantPanel } from '../chat/AssistantPanel';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar Header */}
        <TopBar />

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <WhatChangedBanner />
          <Outlet />
        </main>
      </div>

      {/* Overlay Modals & Drawers */}
      <GlobalSearchModal />
      <IncrementalUpdateModal />
      <RiskDetailDrawer />
      <AssistantPanel />
    </div>
  );
};

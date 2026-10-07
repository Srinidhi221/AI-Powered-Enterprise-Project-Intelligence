import React, { useState } from 'react';
import { HeroStrip } from '../components/dashboard/HeroStrip';
import { KpiTiles } from '../components/dashboard/KpiTiles';
import { AnalysisPanels } from '../components/dashboard/AnalysisPanels';
import { MilestoneTimeline } from '../components/dashboard/MilestoneTimeline';
import { WorkInProgress } from '../components/dashboard/WorkInProgress';
import { SlidersHorizontal, Eye } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const Dashboard: React.FC = () => {
  const { activeProject } = useProject();
  const [dashboardView, setDashboardView] = useState<'overview' | 'executive' | 'detailed'>('overview');

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Strip with View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              {activeProject.name} Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-bold border border-brand-500/20">
              LIVE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time project intelligence summary grounded in 4 uploaded documents.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-card-border shadow-xs text-xs">
          <Eye className="w-3.5 h-3.5 text-text-muted ml-1.5 mr-0.5" />
          <button
            onClick={() => setDashboardView('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              dashboardView === 'overview'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setDashboardView('executive')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              dashboardView === 'executive'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => setDashboardView('detailed')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              dashboardView === 'detailed'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* ZONE 1: HERO STRIP */}
      <HeroStrip />

      {/* ZONE 2: KPI TILES */}
      <KpiTiles />

      {dashboardView !== 'executive' && (
        <>
          {/* ZONE 3: ANALYSIS PANELS */}
          <AnalysisPanels />

          {/* ZONE 4: TIMELINE */}
          <MilestoneTimeline />

          {/* ZONE 5: WORK IN PROGRESS */}
          <WorkInProgress />
        </>
      )}
    </div>
  );
};

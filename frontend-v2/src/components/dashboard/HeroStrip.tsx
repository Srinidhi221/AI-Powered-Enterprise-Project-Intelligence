import React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { SeverityBadge } from '../common/SeverityBadge';

export const HeroStrip: React.FC = () => {
  const { activeProject } = useProject();

  return (
    <div className="w-full p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Health Scorecard */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-600/20 to-brand-500/10 border border-brand-500/30 flex flex-col items-center justify-center p-2 shadow-glow">
              <span className="text-3xl font-extrabold text-brand-500 font-mono tracking-tight">
                {activeProject.healthScore}
              </span>
              <span className="text-[10px] font-mono text-text-muted font-semibold uppercase">
                / 100
              </span>
            </div>
            <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-surface border border-border shadow-xs flex items-center gap-1">
              {activeProject.healthTrend === 'down' ? (
                <ArrowDownRight className="w-3 h-3 text-status-critical" />
              ) : (
                <ArrowUpRight className="w-3 h-3 text-status-healthy" />
              )}
              <span className="text-[10px] font-mono font-bold text-text-secondary">
                {activeProject.healthTrend.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">Project Health Score</h2>
              <SeverityBadge level={activeProject.healthLabel} size="md" />
            </div>
            <p className="text-xs text-text-muted">
              Computed by Multi-Agent Scoring Engine across Scope, Timeline, & Blockers.
            </p>
          </div>
        </div>

        {/* Right: AI Narrative Project Summary */}
        <div className="flex-1 p-4 rounded-xl bg-background border border-border space-y-2">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-500 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Narrative Executive Summary</span>
          </div>
          <p className="text-xs text-text-primary leading-relaxed">
            {activeProject.summary}
          </p>
        </div>
      </div>

      {/* Insight Chips */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mr-1">
          Key Insights:
        </span>
        {activeProject.insightChips.map((chip, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-lg bg-surface-hover border border-border text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-3 h-3 text-status-warning shrink-0" />
            <span>{chip}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

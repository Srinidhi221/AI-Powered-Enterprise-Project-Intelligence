import React from 'react';
import { Sparkles } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { SeverityBadge } from '../common/SeverityBadge';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const HeroStrip: React.FC = () => {
  const { activeProject } = useProject();

  return (
    <div className="py-4 border-b border-border space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Health Score */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-brand-500 font-mono tracking-tight">
              <AnimatedCounter value={activeProject.healthScore} />
            </span>
            <span className="text-[10px] font-mono text-text-muted font-bold uppercase">
              / 100 HEALTH INDEX
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text-primary">Project Health Index</h2>
              <SeverityBadge level={activeProject.healthLabel} size="sm" />
            </div>
            <p className="text-xs text-text-secondary">
              Computed by Multi-Agent Scoring Engine across Scope, Timeline, & Blockers.
            </p>
          </div>
        </div>

        {/* Right: AI Narrative Executive Summary */}
        <div className="flex-1 pl-6 lg:border-l border-border space-y-1">
          <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Narrative Executive Summary</span>
          </span>
          <p className="text-xs text-text-primary leading-relaxed">
            {activeProject.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

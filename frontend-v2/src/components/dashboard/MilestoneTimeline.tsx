import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const MilestoneTimeline: React.FC = () => {
  const { milestones } = useProject();

  return (
    <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-text-primary">Full-Width Milestone Timeline (Gantt View)</h3>
        </div>
        <span className="text-xs text-text-muted font-mono">
          4 Scheduled Milestones
        </span>
      </div>

      {/* Horizontal Gantt Bar Container */}
      <div className="relative pt-6 pb-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0" />

        <div className="grid grid-cols-4 gap-4 relative z-10">
          {milestones.map((ms, idx) => (
            <div
              key={ms.id}
              className={`p-4 rounded-xl border bg-surface transition-all ${
                ms.isAtRisk
                  ? 'border-status-warning shadow-xs'
                  : ms.status === 'completed'
                  ? 'border-status-healthy/40'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                  MS 0{idx + 1}
                </span>
                {ms.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-status-healthy" />
                ) : ms.isAtRisk ? (
                  <AlertTriangle className="w-4 h-4 text-status-warning" />
                ) : (
                  <Clock className="w-4 h-4 text-brand-500" />
                )}
              </div>

              <h4 className="text-xs font-bold text-text-primary leading-snug">
                {ms.name}
              </h4>
              <span className="text-[11px] font-mono text-text-muted mt-1 block">
                Target Date: {ms.date}
              </span>

              {ms.isAtRisk && (
                <div className="mt-2 p-2 rounded bg-status-warningBg border border-status-warning/20 text-[10px] text-status-warning">
                  ⚠️ {ms.riskReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

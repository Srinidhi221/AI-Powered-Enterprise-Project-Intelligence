import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const MilestoneTimeline: React.FC = () => {
  const { milestones } = useProject();

  return (
    <div className="py-4 border-b border-border space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Milestone Schedule Timeline</h3>
        </div>
        <span className="text-xs text-text-muted font-mono">
          4 Scheduled Milestones
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
        {milestones.map((ms, idx) => (
          <div key={ms.id} className="space-y-1.5 pl-3 border-l-2 border-border hover:border-brand-500 transition-colors">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-text-muted">MS 0{idx + 1}</span>
              {ms.status === 'completed' ? (
                <span className="text-status-healthy font-bold">✓ COMPLETED</span>
              ) : ms.isAtRisk ? (
                <span className="text-status-warning font-bold">⚠️ AT RISK</span>
              ) : (
                <span className="text-brand-500 font-bold">IN PROGRESS</span>
              )}
            </div>

            <h4 className="text-xs font-bold text-text-primary leading-snug">
              {ms.name}
            </h4>
            <span className="text-[11px] font-mono text-text-muted block">
              Target: {ms.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

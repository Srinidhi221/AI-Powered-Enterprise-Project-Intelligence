import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { ConfidenceIndicator } from '../common/ConfidenceIndicator';

export const WorkInProgress: React.FC = () => {
  const { blockers, deliverables } = useProject();

  const urgentItems = blockers.filter(b => b.isOverdue || b.status !== 'done');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Widget 1: Action Items Due Soon / Overdue */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-status-warning" />
            <h3 className="text-sm font-bold text-text-primary">Overdue & Urgent Action Items</h3>
          </div>
          <Link to="/blockers" className="text-xs font-semibold text-brand-500 hover:underline">
            View Board
          </Link>
        </div>

        <div className="space-y-2">
          {urgentItems.map(item => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border space-y-1.5 ${
                item.isOverdue ? 'bg-status-criticalBg/40 border-status-critical/30' : 'bg-background border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary truncate">{item.title}</span>
                {item.isOverdue && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-status-critical text-white font-bold">
                    OVERDUE
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Owner: <strong className="text-text-secondary">{item.owner}</strong></span>
                <span className="font-mono">{item.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 2: Scope Summary & Deliverables */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary">Scope Summary</h3>
          </div>
          <Link to="/scope" className="text-xs font-semibold text-brand-500 hover:underline">
            View Scope
          </Link>
        </div>

        <div className="space-y-2.5">
          {deliverables.slice(0, 3).map(del => (
            <div key={del.id} className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">{del.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    del.status === 'completed'
                      ? 'bg-status-healthyBg text-status-healthy'
                      : del.status === 'at_risk'
                      ? 'bg-status-warningBg text-status-warning'
                      : 'bg-brand-50 text-brand-600 dark:text-brand-500'
                  }`}
                >
                  {del.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>Module: {del.module}</span>
                <ConfidenceIndicator confidence={del.confidence} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Recent Activity Feed */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-status-info" />
            <h3 className="text-sm font-bold text-text-primary">Recent Project Activity Feed</h3>
          </div>
          <span className="text-[10px] font-mono text-text-muted">Live Feed</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-text-primary font-medium">Incremental document update ingested: SRS_Document_v2.pdf</p>
              <span className="text-[10px] text-text-muted font-mono">Today at 14:30</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-status-critical mt-1.5 shrink-0" />
            <div>
              <p className="text-text-primary font-medium">Risk flagged: Integration testing ownership unassigned</p>
              <span className="text-[10px] text-text-muted font-mono">Yesterday at 16:45</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-status-healthy mt-1.5 shrink-0" />
            <div>
              <p className="text-text-primary font-medium">Deliverable completed: Vector Store & RAG Indexing</p>
              <span className="text-[10px] text-text-muted font-mono">Oct 04 at 11:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

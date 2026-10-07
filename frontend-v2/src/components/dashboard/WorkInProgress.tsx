import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Target, Activity } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const WorkInProgress: React.FC = () => {
  const { blockers, deliverables } = useProject();

  const urgentItems = blockers.filter(b => b.isOverdue || b.status !== 'done');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-4">
      {/* 1. Action Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-status-warning" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Urgent Action Items</h3>
          </div>
          <Link to="/blockers" className="text-xs font-semibold text-brand-500 hover:underline">
            View Board
          </Link>
        </div>

        <div className="divide-y divide-border text-xs">
          {urgentItems.map(item => (
            <div key={item.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">{item.title}</span>
                {item.isOverdue && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-status-critical text-white font-bold">
                    OVERDUE
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
                <span>Owner: {item.owner}</span>
                <span>{item.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Scope Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Scope Deliverables</h3>
          </div>
          <Link to="/scope" className="text-xs font-semibold text-brand-500 hover:underline">
            View Scope
          </Link>
        </div>

        <div className="divide-y divide-border text-xs">
          {deliverables.slice(0, 3).map(del => (
            <div key={del.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">{del.name}</span>
                <span className="font-mono text-[10px] font-bold uppercase text-brand-500">
                  {del.status}
                </span>
              </div>
              <span className="text-[11px] text-text-muted font-mono block">Module: {del.module}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-status-info" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Activity Stream</h3>
          </div>
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
        </div>
      </div>
    </div>
  );
};

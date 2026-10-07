import React, { useState } from 'react';
import { Target, Users, Calendar, AlertCircle, CheckCircle2, FileText, LayoutList } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SourceCitationChip } from '../components/common/SourceCitationChip';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';

export const ScopeDeliverables: React.FC = () => {
  const { deliverables, activeProject } = useProject();
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');

  const unassignedGaps = deliverables.filter(d => d.owner === 'Unassigned' || !d.dueDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Scope & Deliverables</h1>
          <p className="text-xs text-text-muted mt-1">
            Map of goals, deliverables, ownership matrix, and schedule milestones.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-card-border shadow-xs text-xs">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Deliverables Table</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              viewMode === 'matrix' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Responsibility Matrix</span>
          </button>
        </div>
      </div>

      {/* Gaps Detected Box */}
      {unassignedGaps.length > 0 && (
        <div className="p-4 rounded-xl bg-status-warningBg border border-status-warning/30 space-y-2">
          <div className="flex items-center gap-2 text-status-warning font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Gaps Detected: Deliverables with No Owner or Unclear Target Date</span>
          </div>
          <p className="text-xs text-text-primary">
            Scope agent detected <strong>{unassignedGaps.length} deliverable(s)</strong> with missing ownership or schedule deadlines in SRS.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {unassignedGaps.map(g => (
              <span key={g.id} className="px-2.5 py-1 rounded-lg bg-surface border border-status-warning/40 text-xs font-semibold text-status-warning">
                • {g.name} ({g.owner})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Goals Summary */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Project Goals & Objectives Summary
          </h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-text-secondary">
          <li className="p-3 rounded-xl bg-background border border-border flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-healthy shrink-0 mt-0.5" />
            <span>Build one searchable project knowledge base from all uploaded documents using RAG.</span>
          </li>
          <li className="p-3 rounded-xl bg-background border border-border flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-healthy shrink-0 mt-0.5" />
            <span>Run a multi-agent pipeline that extracts scope, detects risks, and forecasts delivery problems.</span>
          </li>
        </ul>
      </div>

      {/* View Mode: Table or Matrix */}
      {viewMode === 'table' ? (
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Mapped Deliverables Table ({deliverables.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Deliverable Name</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Source Citation</th>
                  <th className="p-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {deliverables.map(del => (
                  <tr key={del.id} className="hover:bg-surface-hover/40 transition-colors">
                    <td className="p-3 text-text-primary font-bold">{del.name}</td>
                    <td className="p-3 font-mono">
                      <span className={del.owner === 'Unassigned' ? 'text-status-critical font-bold' : 'text-text-secondary'}>
                        {del.owner}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-text-muted">{del.dueDate || 'Unset'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          del.status === 'completed'
                            ? 'bg-status-healthyBg text-status-healthy'
                            : del.status === 'at_risk' || del.status === 'delayed'
                            ? 'bg-status-criticalBg text-status-critical'
                            : 'bg-brand-50 text-brand-600 dark:text-brand-500'
                        }`}
                      >
                        {del.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <SourceCitationChip docName={del.sourceDoc} passage={del.sourcePassage} />
                    </td>
                    <td className="p-3">
                      <ConfidenceIndicator confidence={del.confidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Responsibility Matrix (Person x Deliverable) */
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Responsibility Matrix (Team Person x Deliverable)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Deliverable</th>
                  {activeProject.teamMembers.map(m => (
                    <th key={m.name} className="p-3 text-center">{m.name}</th>
                  ))}
                  <th className="p-3 text-center text-status-critical">Unassigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deliverables.map(del => (
                  <tr key={del.id} className="hover:bg-surface-hover/40">
                    <td className="p-3 font-semibold text-text-primary">{del.name}</td>
                    {activeProject.teamMembers.map(m => {
                      const isAssigned = del.owner.toLowerCase().includes(m.name.split(' ')[0].toLowerCase());
                      return (
                        <td key={m.name} className="p-3 text-center font-bold font-mono">
                          {isAssigned ? (
                            <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 border border-brand-500/30">
                              OWNER
                            </span>
                          ) : (
                            <span className="text-text-muted opacity-30">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center font-mono">
                      {del.owner === 'Unassigned' && (
                        <span className="px-2 py-0.5 rounded bg-status-criticalBg text-status-critical font-bold border border-status-critical/30">
                          GAP
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

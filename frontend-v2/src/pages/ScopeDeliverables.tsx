import React, { useState } from 'react';
import { Target, Users, Calendar, AlertTriangle, CheckCircle2, FileText, ArrowRight, Plus, Sparkles, ExternalLink } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SourceCitationChip } from '../components/common/SourceCitationChip';

export const ScopeDeliverables: React.FC = () => {
  const { deliverables, setIsAddUpdateOpen, setIsChatDrawerOpen } = useProject();
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');

  const completedCount = deliverables.filter(d => d.status === 'completed').length;
  const inProgressCount = deliverables.filter(d => d.status === 'on_track' || d.status === 'at_risk').length;
  const unassignedCount = deliverables.filter(d => d.owner === 'Unassigned').length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2 animate-fade-in">
      {/* 1. PAGE TITLE & HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Scope & Deliverables</h1>
          <p className="text-sm text-text-secondary mt-1">
            AI-extracted project scope, ownership and delivery commitments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUpdateOpen(true)}
            className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Update</span>
          </button>
          <button
            onClick={() => setIsChatDrawerOpen(true)}
            className="px-4 py-2 rounded-md border border-brand-500/30 text-brand-600 dark:text-brand-500 hover:bg-brand-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* 2. PROJECT SNAPSHOT (Compact horizontal KPI strip - NO CARDS) */}
      <div className="flex flex-wrap items-center gap-8 py-3 border-y border-border text-xs font-medium text-text-secondary">
        <div>
          <span className="text-[11px] font-semibold text-text-muted uppercase block">Total Deliverables</span>
          <span className="text-xl font-bold text-text-primary font-mono">{deliverables.length}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <span className="text-[11px] font-semibold text-text-muted uppercase block">Completed</span>
          <span className="text-xl font-bold text-status-healthy font-mono">{completedCount}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <span className="text-[11px] font-semibold text-text-muted uppercase block">In Progress</span>
          <span className="text-xl font-bold text-brand-500 font-mono">{inProgressCount}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <span className="text-[11px] font-semibold text-text-muted uppercase block">Unassigned</span>
          <span className="text-xl font-bold text-status-critical font-mono">{unassignedCount}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <span className="text-[11px] font-semibold text-text-muted uppercase block">Next Deadline</span>
          <span className="text-base font-bold text-text-primary font-mono">Oct 10, 2026</span>
        </div>
      </div>

      {/* 3. GAP / WARNING AREA (Compact alert section with left vertical indicator - NO GIANT CONTAINER) */}
      {unassignedCount > 0 && (
        <div className="pl-4 py-3 border-l-4 border-status-warning bg-status-warningBg/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-status-warning uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>ATTENTION REQUIRED</span>
            </span>
            <button
              onClick={() => setIsChatDrawerOpen(true)}
              className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
            >
              <span>Resolve with AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-text-primary">
            <strong>{unassignedCount} deliverable</strong> has unresolved ownership or target schedule information.
          </p>
          <div className="text-xs font-mono text-text-secondary flex flex-wrap items-center gap-4">
            <span className="font-bold text-text-primary">End-to-End Integration & Load Testing</span>
            <span>Owner: <strong className="text-status-critical">Unassigned</strong></span>
            <span>Target: <strong>Not specified</strong></span>
          </div>
        </div>
      )}

      {/* 4. PROJECT OBJECTIVES (Editorial list with large numbers - NO CARDS) */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          PROJECT OBJECTIVES
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-border/60">
            <span className="text-2xl font-black text-brand-500 font-mono">01</span>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-text-primary">Searchable Knowledge Base Construction</h3>
              <p className="text-xs text-text-secondary">
                Build one searchable project knowledge base from all uploaded documents using RAG dense vector indexing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-border/60">
            <span className="text-2xl font-black text-brand-500 font-mono">02</span>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-text-primary">Multi-Agent Intelligence Execution</h3>
              <p className="text-xs text-text-secondary">
                Run a multi-agent pipeline that extracts scope, detects schedule risks, and forecasts delivery problems before code freeze.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MAIN FOCUS: DELIVERABLES FULL-WIDTH TABLE (NO CONTAINER BOX) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            DELIVERABLES CONTROL TABLE ({deliverables.length})
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewMode === 'table' ? 'bg-surface border border-border text-brand-500 font-bold' : 'text-text-muted hover:text-text-primary'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${viewMode === 'matrix' ? 'bg-surface border border-border text-brand-500 font-bold' : 'text-text-muted hover:text-text-primary'}`}
            >
              Matrix View
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full text-xs text-left">
              <thead className="text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="py-3 px-2">DELIVERABLE</th>
                  <th className="py-3 px-2">OWNER</th>
                  <th className="py-3 px-2">DUE</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2">SOURCE EVIDENCE</th>
                  <th className="py-3 px-2">AI CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deliverables.map(del => (
                  <tr key={del.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-text-primary text-sm">
                      {del.name}
                    </td>
                    <td className="py-3.5 px-2 font-mono">
                      <span className={del.owner === 'Unassigned' ? 'text-status-critical font-bold' : 'text-text-secondary'}>
                        {del.owner}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-text-muted">{del.dueDate || 'Unset'}</td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          del.status === 'completed'
                            ? 'bg-status-healthyBg text-status-healthy'
                            : del.status === 'at_risk' || del.status === 'delayed'
                            ? 'bg-status-criticalBg text-status-critical'
                            : 'bg-brand-50 text-brand-600 dark:text-brand-500'
                        }`}
                      >
                        {del.status === 'completed' ? '✓ Completed' : del.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-text-secondary">
                      <SourceCitationChip docName={del.sourceDoc} passage={del.sourcePassage} />
                    </td>
                    <td className="py-3.5 px-2 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full ${del.confidence === 'high' ? 'bg-status-healthy' : del.confidence === 'medium' ? 'bg-status-warning' : 'bg-status-critical'}`}
                            style={{ width: del.confidence === 'high' ? '92%' : del.confidence === 'medium' ? '68%' : '45%' }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-text-secondary">
                          {del.confidence === 'high' ? '92%' : del.confidence === 'medium' ? '68%' : '45%'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Matrix View */
          <div className="border-t border-border pt-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="py-3 px-2">Deliverable</th>
                  <th className="py-3 px-2 text-center">Srinidhi V.</th>
                  <th className="py-3 px-2 text-center">Alex Chen</th>
                  <th className="py-3 px-2 text-center">Priya Sharma</th>
                  <th className="py-3 px-2 text-center text-status-critical">Unassigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deliverables.map(del => (
                  <tr key={del.id} className="hover:bg-surface-hover/60">
                    <td className="py-3 px-2 font-bold text-text-primary">{del.name}</td>
                    <td className="py-3 px-2 text-center font-mono">{del.owner.includes('Srinidhi') ? '✓ OWNER' : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono">{del.owner.includes('Alex') ? '✓ OWNER' : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono">{del.owner.includes('Priya') ? '✓ OWNER' : '-'}</td>
                    <td className="py-3 px-2 text-center font-mono text-status-critical font-bold">
                      {del.owner === 'Unassigned' ? '⚠️ GAP' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

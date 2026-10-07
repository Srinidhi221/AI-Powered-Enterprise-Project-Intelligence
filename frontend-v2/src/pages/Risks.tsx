import React, { useState } from 'react';
import { ShieldAlert, Filter, TrendingUp, GitFork, ArrowRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';
import { SourceCitationChip } from '../components/common/SourceCitationChip';
import { RiskCategory } from '../types';

export const Risks: React.FC = () => {
  const { risks, setSelectedRisk } = useProject();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'matrix' | 'table' | 'dependencies'>('table');

  const filteredRisks = risks.filter(r => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterSeverity === 'high' && r.score < 12) return false;
    if (filterSeverity === 'medium' && (r.score < 6 || r.score >= 12)) return false;
    if (filterSeverity === 'low' && r.score >= 6) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Risk Analysis & Forecasting</h1>
          <p className="text-xs text-text-muted mt-1">
            Scored risks with source document grounding citations, matrix heatmaps, and schedule delay forecasts.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-card-border shadow-xs text-xs">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'table' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Risk Table
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'matrix' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Heatmap Matrix
          </button>
          <button
            onClick={() => setActiveTab('dependencies')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'dependencies' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Dependency View
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-card-border shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-brand-500 shrink-0" />
          <span className="font-semibold text-text-primary">Filter Risks:</span>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-text-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Schedule">Schedule</option>
            <option value="Technical">Technical</option>
            <option value="Resource">Resource</option>
            <option value="Scope">Scope</option>
            <option value="External">External</option>
          </select>

          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-text-primary focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity (Score ≥ 12)</option>
            <option value="medium">Medium Severity (Score 6-11)</option>
            <option value="low">Low Severity (Score &lt; 6)</option>
          </select>
        </div>

        <span className="text-text-muted font-mono">
          Showing {filteredRisks.length} of {risks.length} risks
        </span>
      </div>

      {/* Content based on Tab */}
      {activeTab === 'table' ? (
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Risk Identifier & Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Impact x Likelihood</th>
                  <th className="p-3">Severity Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Source Passage</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredRisks.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRisk(r)}
                    className="hover:bg-surface-hover/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-3">
                      <span className="font-mono text-[10px] text-text-muted block">{r.id}</span>
                      <span className="font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                        {r.title}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-text-secondary">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-text-muted">
                      Imp: {r.impact} | Lik: {r.likelihood}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <SeverityBadge level={r.score >= 12 ? 'High' : r.score >= 6 ? 'Medium' : 'Low'} />
                        <span className="font-mono font-bold text-text-primary">{r.score}/25</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${r.status === 'mitigated' ? 'bg-status-healthyBg text-status-healthy' : 'bg-status-criticalBg text-status-critical'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <SourceCitationChip docName={r.sourceDoc} passage={r.sourcePassage} />
                    </td>
                    <td className="p-3">
                      <ConfidenceIndicator confidence={r.confidence} />
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-brand-500 hover:underline font-semibold text-xs">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'matrix' ? (
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-6">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Standard 5x5 Risk Matrix (Likelihood x Impact)
          </h2>
          <div className="max-w-xl mx-auto space-y-2">
            <div className="grid grid-cols-6 gap-2 text-center text-xs font-mono text-text-muted">
              <span>Impact</span>
              <span>Likelihood 1</span>
              <span>Likelihood 2</span>
              <span>Likelihood 3</span>
              <span>Likelihood 4</span>
              <span>Likelihood 5</span>
            </div>
            {[5, 4, 3, 2, 1].map(imp => (
              <div key={imp} className="grid grid-cols-6 gap-2 text-center items-center">
                <span className="text-xs font-mono font-bold text-text-muted">Imp {imp}</span>
                {[1, 2, 3, 4, 5].map(lik => {
                  const score = imp * lik;
                  const matching = risks.filter(r => r.impact === imp && r.likelihood === lik);
                  return (
                    <div
                      key={lik}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center border text-xs transition-transform hover:scale-105 cursor-pointer ${
                        score >= 16
                          ? 'bg-status-criticalBg border-status-critical/40 text-status-critical font-bold'
                          : score >= 8
                          ? 'bg-status-warningBg border-status-warning/40 text-status-warning font-bold'
                          : 'bg-status-healthyBg border-status-healthy/40 text-status-healthy'
                      }`}
                    >
                      <span className="font-mono font-bold">{matching.length}</span>
                      <span className="text-[9px] opacity-70">Sc {score}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Dependency View */
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Deliverable Dependency Map & Gaps Flagged
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  Multi-Agent Analysis Pipeline (del-3)
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Depends on: Document Ingestion (del-1) & Vector Store Indexing (del-2)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-healthyBg text-status-healthy font-bold">
                SATISFIED
              </span>
            </div>

            <div className="p-4 rounded-xl bg-status-criticalBg/30 border border-status-critical/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">
                  End-to-End Integration & Load Testing (del-4)
                </h4>
                <p className="text-[11px] text-status-critical mt-0.5 font-medium">
                  Depends on: QA Lead Assignment (Unassigned) — MISSING DEPENDENCY FLAGGED
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-critical text-white font-bold">
                BLOCKED
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

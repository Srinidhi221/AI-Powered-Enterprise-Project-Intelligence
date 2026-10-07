import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { SeverityBadge } from '../common/SeverityBadge';
import { SourceCitationChip } from '../common/SourceCitationChip';

export const AnalysisPanels: React.FC = () => {
  const { risks, healthDimensions, setSelectedRisk } = useProject();

  const topRisks = [...risks].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Health Breakdown */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary">Health Score Breakdown</h3>
          </div>
          <Link to="/health" className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1">
            <span>View Detail</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {healthDimensions.map(dim => (
            <div key={dim.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-text-primary">{dim.name}</span>
                <span className="font-mono font-bold text-text-secondary">{dim.score}/100</span>
              </div>
              <div className="w-full bg-surface-hover h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    dim.score >= 80
                      ? 'bg-status-healthy'
                      : dim.score >= 60
                      ? 'bg-status-warning'
                      : 'bg-status-critical'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted">{dim.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2: Risk Heatmap Matrix (5x5) */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-status-critical" />
            <h3 className="text-sm font-bold text-text-primary">Risk Heatmap Matrix (Likelihood x Impact)</h3>
          </div>
          <Link to="/risks" className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1">
            <span>Risk Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 5x5 Heatmap Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-6 gap-1 text-[10px] font-mono text-text-muted text-center">
            <span>Imp \ Lik</span>
            <span>L1</span>
            <span>L2</span>
            <span>L3</span>
            <span>L4</span>
            <span>L5</span>
          </div>
          {[5, 4, 3, 2, 1].map(imp => (
            <div key={imp} className="grid grid-cols-6 gap-1 text-center items-center">
              <span className="text-[10px] font-mono text-text-muted font-bold">I{imp}</span>
              {[1, 2, 3, 4, 5].map(lik => {
                const cellScore = imp * lik;
                const count = risks.filter(r => r.impact === imp && r.likelihood === lik).length;
                let bgCell = 'bg-surface-hover/30 border-border/50 text-text-muted';

                if (cellScore >= 16) bgCell = 'bg-status-criticalBg border-status-critical/30 text-status-critical font-bold';
                else if (cellScore >= 8) bgCell = 'bg-status-warningBg border-status-warning/30 text-status-warning font-bold';
                else if (cellScore >= 1) bgCell = 'bg-status-healthyBg border-status-healthy/30 text-status-healthy';

                return (
                  <div
                    key={lik}
                    className={`h-7 rounded flex items-center justify-center border text-xs font-mono transition-transform hover:scale-105 cursor-pointer ${bgCell}`}
                    title={`Impact ${imp}, Likelihood ${lik}: ${count} risk(s)`}
                  >
                    {count > 0 ? count : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Top 5 Identified Risks */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-warning" />
            <h3 className="text-sm font-bold text-text-primary">Top 5 Critical Risks</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">Max 5 shown</span>
        </div>

        <div className="space-y-2">
          {topRisks.map(r => (
            <div
              key={r.id}
              onClick={() => setSelectedRisk(r)}
              className="p-3 rounded-xl bg-background border border-border hover:border-brand-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge level={r.score >= 12 ? 'High' : r.score >= 6 ? 'Medium' : 'Low'} />
                  <span className="text-xs font-semibold text-text-primary group-hover:text-brand-500 transition-colors">
                    {r.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <span>Owner: <strong className="text-text-secondary">{r.owner}</strong></span>
                  <span>•</span>
                  <SourceCitationChip docName={r.sourceDoc} passage={r.sourcePassage} />
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-status-critical">
                  Score {r.score}/25
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: Delivery Forecast */}
      <div className="p-5 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary">AI Delivery Schedule Forecast</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-warningBg text-status-warning font-semibold">
            PREDICTED DELAY: 4 DAYS
          </span>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border space-y-3">
          <p className="text-xs text-text-primary leading-relaxed">
            Forecasting engine predicts potential 4-day delivery slip in <strong>Milestone 3 (Q&A Assistant & Verification)</strong> due to two converging factors:
          </p>
          <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
            <li>Unassigned load testing suite ownership (David Miller team bandwidth locked until Oct 20).</li>
            <li>Cloud SSL Certificate approval SecOps SLA of 10 business days.</li>
          </ul>
          <div className="p-2.5 rounded-lg bg-brand-50/50 dark:bg-brand-50/10 border border-brand-500/20 text-[11px] text-brand-600 dark:text-brand-500">
            <strong>Recommended Action:</strong> Assign temporary QA coordinator in simulation panel to reclaim 4 days buffer.
          </div>
        </div>
      </div>
    </div>
  );
};

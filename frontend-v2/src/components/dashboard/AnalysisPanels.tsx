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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-4 border-b border-border">
      {/* Panel 1: Health Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Health Score Breakdown</h3>
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
                <span className="text-text-primary font-semibold">{dim.name}</span>
                <span className="font-mono font-bold text-text-secondary">{dim.score}/100</span>
              </div>
              <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    dim.score >= 80 ? 'bg-status-healthy' : dim.score >= 60 ? 'bg-status-warning' : 'bg-status-critical'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted">{dim.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2: Risk Heatmap Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-status-critical" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Risk Matrix (Likelihood x Impact)</h3>
          </div>
          <Link to="/risks" className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1">
            <span>Risk Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-1 pt-1">
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
                let bgCell = 'bg-surface border border-border text-text-muted';

                if (cellScore >= 16) bgCell = 'bg-status-criticalBg border border-status-critical/40 text-status-critical font-bold';
                else if (cellScore >= 8) bgCell = 'bg-status-warningBg border border-status-warning/40 text-status-warning font-bold';
                else if (cellScore >= 1) bgCell = 'bg-status-healthyBg border border-status-healthy/40 text-status-healthy';

                return (
                  <div
                    key={lik}
                    className={`h-7 rounded flex items-center justify-center text-xs font-mono transition-transform hover:scale-105 cursor-pointer ${bgCell}`}
                  >
                    {count > 0 ? count : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Top Critical Risks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-warning" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Top Critical Identified Risks</h3>
          </div>
        </div>

        <div className="divide-y divide-border">
          {topRisks.map(r => (
            <div
              key={r.id}
              onClick={() => setSelectedRisk(r)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-surface-hover/50 px-2 rounded transition-colors cursor-pointer group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <SeverityBadge level={r.score >= 12 ? 'High' : r.score >= 6 ? 'Medium' : 'Low'} />
                  <span className="text-xs font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                    {r.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <span>Owner: <strong className="text-text-secondary">{r.owner}</strong></span>
                  <span>•</span>
                  <SourceCitationChip docName={r.sourceDoc} passage={r.sourcePassage} />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-status-critical shrink-0">
                Score {r.score}/25
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 4: AI Delivery Schedule Forecast */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Delivery Schedule Forecast</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-warningBg text-status-warning font-bold">
            PREDICTED DELAY: 4 DAYS
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <p className="text-text-primary leading-relaxed">
            Forecasting engine predicts potential 4-day delivery slip in <strong>Milestone 3 (Q&A Assistant & Verification)</strong> due to:
          </p>
          <ul className="text-text-secondary space-y-1.5 list-disc pl-4">
            <li>Unassigned load testing suite ownership (David Miller team bandwidth locked until Oct 20).</li>
            <li>Cloud SSL Certificate approval SecOps SLA of 10 business days.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

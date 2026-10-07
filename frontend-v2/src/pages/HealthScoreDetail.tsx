import React from 'react';
import { Activity, TrendingUp, HelpCircle, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const HealthScoreDetail: React.FC = () => {
  const { activeProject, healthDimensions, healthHistory } = useProject();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Health Score Deep-Dive</h1>
        <p className="text-xs text-text-muted mt-1">
          Dimension-wise scoring calculation, historical trend analytics, and ranked improvement recommendations.
        </p>
      </div>

      {/* Hero Score Block */}
      <div className="p-8 rounded-2xl bg-surface border border-card-border shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-brand-600/20 to-brand-500/10 border-2 border-brand-500/40 flex flex-col items-center justify-center shadow-glow">
            <span className="text-4xl font-extrabold text-brand-500 font-mono tracking-tight">
              {activeProject.healthScore}
            </span>
            <span className="text-xs font-mono text-text-muted font-bold uppercase mt-1">
              SCORE / 100
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <SeverityBadge level={activeProject.healthLabel} size="md" />
              <span className="text-xs font-mono font-bold text-text-muted">
                Weighted Calculation Engine v2.0
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-text-primary">
              Overall Status: {activeProject.healthLabel}
            </h2>
            <p className="text-xs text-text-secondary max-w-lg leading-relaxed">
              Calculated using weighted sub-scores: Scope Clarity (30%), Timeline Risk (40%), and Blocker & Action Resolution (30%).
            </p>
          </div>
        </div>

        {/* Historical Chart */}
        <div className="w-full md:w-80 h-36">
          <span className="text-[10px] font-mono font-bold text-text-muted uppercase block mb-2">
            Score History Trend (5 Ingestions)
          </span>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthHistory}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#888" fontSize={10} />
              <YAxis domain={[40, 100]} stroke="#888" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {healthDimensions.map(dim => (
          <div key={dim.id} className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                {dim.name} ({dim.weight * 100}% Weight)
              </span>
              <span className="font-mono font-extrabold text-sm text-brand-500">
                {dim.score}/100
              </span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {dim.explanation}
            </p>

            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                Key Extracted Findings:
              </span>
              {dim.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {f.impact === 'positive' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-healthy shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-status-critical shrink-0 mt-0.5" />
                  )}
                  <span className={f.impact === 'positive' ? 'text-text-primary' : 'text-text-secondary'}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* "Why This Score?" Panel */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <HelpCircle className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-bold text-text-primary">
            "Why This Score?" Ranked Impact Analysis
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-status-criticalBg/40 border border-status-critical/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-status-critical uppercase tracking-wider">
                -12 Points Penalty: Unassigned Integration Testing Suite Owner
              </span>
              <p className="text-xs text-text-primary">
                Extracted from Meeting_Notes_Oct02.txt. David Miller team bandwidth locked until Oct 20.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-status-critical text-white font-mono font-bold text-xs shrink-0">
              HIGH PENALTY
            </span>
          </div>

          <div className="p-4 rounded-xl bg-status-warningBg/40 border border-status-warning/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-status-warning uppercase tracking-wider">
                -8 Points Penalty: Cloud SSL Certificate SecOps SLA Delay
              </span>
              <p className="text-xs text-text-primary">
                Extracted from Progress_Update_Week3.pdf. Potential 4-day delivery delay on Milestone 3.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-status-warning text-black font-mono font-bold text-xs shrink-0">
              MEDIUM PENALTY
            </span>
          </div>

          <div className="p-4 rounded-xl bg-status-healthyBg/40 border border-status-healthy/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-status-healthy uppercase tracking-wider">
                +15 Points Boost: High Scope Clarity & Complete Acceptance Criteria
              </span>
              <p className="text-xs text-text-primary">
                12 core user stories explicitly formatted with Gherkin criteria across SRS_Document_v2.pdf.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-status-healthy text-white font-mono font-bold text-xs shrink-0">
              SCORE BOOST
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

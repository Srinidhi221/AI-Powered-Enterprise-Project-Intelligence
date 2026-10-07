import React, { useEffect, useState } from 'react';
import { Target, ShieldAlert, AlertTriangle, FileCheck, Activity, CheckCircle, Loader2 } from 'lucide-react';
import { LogEvent } from '../../types';

interface StoryLayerProps {
  currentStageIndex: number;
  onComplete?: () => void;
}

const STAGES = [
  { stage: 'File received', message: 'Upload in progress... your documents are on their way' },
  { stage: 'Parsing', message: 'Reading through your documents...' },
  { stage: 'Chunking', message: 'Breaking your project into bite-sized pieces...' },
  { stage: 'Embedding and indexing', message: "Building your project's memory..." },
  { stage: 'Agents starting', message: 'Agents are getting ready...' },
  { stage: 'Scope agent', message: 'Mapping your goals, milestones and deliverables...' },
  { stage: 'Risk agent', message: 'Scanning for risks hiding between the lines...' },
  { stage: 'Blocker agent', message: 'Hunting for blockers and loose ends...' },
  { stage: 'Documentation agent', message: 'Drafting user stories and your risk register...' },
  { stage: 'Health scoring', message: "Taking your project's pulse..." },
  { stage: 'Complete', message: 'All set. Be ready to explore your project.' }
];

export const StoryLayer: React.FC<StoryLayerProps> = ({ currentStageIndex }) => {
  const activeStage = STAGES[Math.min(currentStageIndex, STAGES.length - 1)];

  // Live Discovery Counters
  const deliverablesCount = Math.min(12, Math.floor((currentStageIndex / 9) * 12));
  const risksCount = Math.min(7, Math.floor((currentStageIndex / 9) * 7));
  const blockersCount = Math.min(4, Math.floor((currentStageIndex / 9) * 4));

  const agents = [
    { name: 'Scope Agent', icon: Target, activeIndex: 5 },
    { name: 'Risk Agent', icon: ShieldAlert, activeIndex: 6 },
    { name: 'Blocker Agent', icon: AlertTriangle, activeIndex: 7 },
    { name: 'Doc Agent', icon: FileCheck, activeIndex: 8 },
    { name: 'Health Agent', icon: Activity, activeIndex: 9 }
  ];

  return (
    <div className="w-full p-8 rounded-2xl bg-surface border border-card-border shadow-card space-y-8 animate-fade-in">
      {/* Rotating Friendly Message */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-brand-50 text-brand-500 border border-brand-500/20 mb-2">
          {currentStageIndex < STAGES.length - 1 ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <CheckCircle className="w-8 h-8 text-status-healthy" />
          )}
        </div>
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          {activeStage.message}
        </h2>
        <div className="w-full bg-surface-hover h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-text-muted">
          STAGE {currentStageIndex + 1} OF {STAGES.length}: {activeStage.stage.toUpperCase()}
        </span>
      </div>

      {/* Agent Roster */}
      <div className="space-y-3 pt-2 border-t border-border">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block text-center">
          Multi-Agent Pipeline Roster
        </span>
        <div className="grid grid-cols-5 gap-3">
          {agents.map((ag, i) => {
            const Icon = ag.icon;
            let status: 'waiting' | 'working' | 'done' = 'waiting';
            if (currentStageIndex > ag.activeIndex) status = 'done';
            else if (currentStageIndex === ag.activeIndex) status = 'working';

            return (
              <div
                key={ag.name}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  status === 'working'
                    ? 'bg-brand-50/50 dark:bg-brand-50/20 border-brand-500 shadow-glow scale-105'
                    : status === 'done'
                    ? 'bg-status-healthyBg border-status-healthy/30'
                    : 'bg-surface-hover/40 border-border opacity-60'
                }`}
              >
                <div className="relative mb-2">
                  <Icon
                    className={`w-6 h-6 ${
                      status === 'working'
                        ? 'text-brand-500 animate-bounce'
                        : status === 'done'
                        ? 'text-status-healthy'
                        : 'text-text-muted'
                    }`}
                  />
                  {status === 'working' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                  )}
                </div>
                <span className="text-xs font-semibold text-text-primary">{ag.name}</span>
                <span className="text-[10px] font-mono mt-1 capitalize text-text-muted">
                  {status === 'working' ? 'Processing...' : status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Discovery Counters */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-center">
        <div className="p-3 rounded-xl bg-background border border-border">
          <span className="text-2xl font-extrabold text-brand-500 font-mono">{deliverablesCount}</span>
          <span className="text-xs text-text-secondary block font-medium">Deliverables Mapped</span>
        </div>
        <div className="p-3 rounded-xl bg-background border border-border">
          <span className="text-2xl font-extrabold text-status-warning font-mono">{risksCount}</span>
          <span className="text-xs text-text-secondary block font-medium">Risks Spotted</span>
        </div>
        <div className="p-3 rounded-xl bg-background border border-border">
          <span className="text-2xl font-extrabold text-status-critical font-mono">{blockersCount}</span>
          <span className="text-xs text-text-secondary block font-medium">Blockers Flagged</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, ArrowUpRight, ArrowDownRight, X, Sparkles, Copy } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const WhatChangedBanner: React.FC = () => {
  const { whatChangedSummary, dismissWhatChanged } = useProject();

  if (!whatChangedSummary) return null;

  const scoreDiff = whatChangedSummary.newHealthScore - whatChangedSummary.prevHealthScore;

  return (
    <div className="w-full mb-6 p-4 rounded-xl bg-brand-50/80 dark:bg-brand-50/20 border border-brand-500/30 shadow-card animate-slide-down relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-500 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-500 uppercase tracking-wider">
                Incremental Update Analysis: "What Changed"
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-500 text-white font-bold">
                NEW
              </span>
            </div>
            <p className="text-xs text-text-primary">
              Incremental ingestion finished successfully. Project knowledge base updated without rebuilding existing vectors.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1 text-status-critical">
                <span className="font-mono font-bold">+{whatChangedSummary.newRisksCount}</span>
                <span>New Risks Detected</span>
              </div>
              <div className="flex items-center gap-1 text-status-healthy">
                <span className="font-mono font-bold">{whatChangedSummary.resolvedRisksCount}</span>
                <span>Risks Resolved</span>
              </div>
              <div className="flex items-center gap-1 text-status-warning">
                <span className="font-mono font-bold">+{whatChangedSummary.newActionItemsCount}</span>
                <span>Action Items Created</span>
              </div>
              <div className="flex items-center gap-1 font-mono font-bold">
                <span>Health Score:</span>
                <span className="text-text-secondary">{whatChangedSummary.prevHealthScore}</span>
                <span>→</span>
                <span className={scoreDiff < 0 ? 'text-status-critical' : 'text-status-healthy'}>
                  {whatChangedSummary.newHealthScore}
                </span>
                {scoreDiff < 0 ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-status-critical" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-status-healthy" />
                )}
              </div>
            </div>

            {/* Possible Duplicates Review */}
            {whatChangedSummary.possibleDuplicates.length > 0 && (
              <div className="mt-3 p-2.5 rounded-lg bg-surface border border-border text-xs space-y-1">
                <span className="font-semibold text-text-secondary flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5 text-status-warning" />
                  <span>Possible Duplicates Merged & Offered for Review:</span>
                </span>
                {whatChangedSummary.possibleDuplicates.map(dup => (
                  <p key={dup.id} className="text-text-muted font-mono text-[11px]">
                    • "{dup.title}" matches existing item "{dup.existingTitle}" (Merged)
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={dismissWhatChanged}
          className="p-1 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

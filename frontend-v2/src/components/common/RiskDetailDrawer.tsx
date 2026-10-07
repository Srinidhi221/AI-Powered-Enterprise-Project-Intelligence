import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle, Trash2, Edit3, User, Calendar, FileText } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { SeverityBadge } from './SeverityBadge';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { SourceCitationChip } from './SourceCitationChip';

export const RiskDetailDrawer: React.FC = () => {
  const { selectedRisk, setSelectedRisk, risks, setRisks } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedMitigation, setEditedMitigation] = useState('');

  if (!selectedRisk) return null;

  const handleClose = () => {
    setSelectedRisk(null);
    setIsEditing(false);
  };

  const handleResolve = () => {
    setRisks(prev =>
      prev.map(r => (r.id === selectedRisk.id ? { ...r, status: 'mitigated' } : r))
    );
    handleClose();
  };

  const handleDismiss = () => {
    setRisks(prev => prev.filter(r => r.id !== selectedRisk.id));
    handleClose();
  };

  const handleSaveEdit = () => {
    setRisks(prev =>
      prev.map(r =>
        r.id === selectedRisk.id
          ? {
              ...r,
              title: editedTitle || r.title,
              suggestedMitigation: editedMitigation || r.suggestedMitigation
            }
          : r
      )
    );
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-surface border-l border-border shadow-dropdown flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-border bg-surface-hover/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-status-criticalBg border border-status-critical/30">
                  <ShieldAlert className="w-5 h-5 text-status-critical" />
                </div>
                <div>
                  <span className="text-xs font-mono font-medium text-text-muted">RISK IDENTIFIER #{selectedRisk.id}</span>
                  <h3 className="text-base font-semibold text-text-primary mt-0.5 leading-tight">
                    {selectedRisk.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SeverityBadge level={selectedRisk.score >= 12 ? 'High' : selectedRisk.score >= 6 ? 'Medium' : 'Low'} />
              <ConfidenceIndicator confidence={selectedRisk.confidence} />
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-surface-hover text-text-secondary border border-border">
                Category: {selectedRisk.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-brand-50 text-brand-600 dark:text-brand-500 border border-brand-500/20">
                Score: {selectedRisk.score}/25
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* AI Explanation */}
            <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-50/10 border border-brand-500/20 space-y-2">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-500 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Why AI Flagged This Risk</span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">
                {selectedRisk.explanation}
              </p>
            </div>

            {/* Source Reference Excerpt */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-text-muted" />
                <span>Source Document & Passage</span>
              </span>
              <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                <SourceCitationChip docName={selectedRisk.sourceDoc} passage={selectedRisk.sourcePassage} />
                <p className="text-xs font-mono text-text-secondary italic leading-relaxed pt-1">
                  "{selectedRisk.sourcePassage}"
                </p>
              </div>
            </div>

            {/* Owner & Impact Matrix */}
            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-surface-hover/50 border border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted uppercase">Owner</span>
                  <p className="text-xs font-semibold text-text-primary">{selectedRisk.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted uppercase">Impact / Likelihood</span>
                  <p className="text-xs font-semibold text-text-primary">
                    Impact: {selectedRisk.impact}/5 | Likelihood: {selectedRisk.likelihood}/5
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Mitigation */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                AI Suggested Mitigation Strategy
              </span>
              {isEditing ? (
                <textarea
                  className="w-full p-3 rounded-lg bg-background border border-brand-500 text-sm text-text-primary focus:outline-none"
                  rows={3}
                  defaultValue={selectedRisk.suggestedMitigation}
                  onChange={e => setEditedMitigation(e.target.value)}
                />
              ) : (
                <div className="p-3.5 rounded-lg bg-surface-hover/80 border border-border text-sm text-text-primary leading-relaxed">
                  {selectedRisk.suggestedMitigation}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-surface-hover/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg border border-status-critical/30 text-status-critical hover:bg-status-criticalBg text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Dismiss from active risk list"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>

              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedTitle(selectedRisk.title);
                    setEditedMitigation(selectedRisk.suggestedMitigation);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-surface-hover text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <button
              onClick={handleResolve}
              className="px-4 py-2 rounded-lg bg-status-healthy text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Mitigated</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

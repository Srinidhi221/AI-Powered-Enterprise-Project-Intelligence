import React, { useState } from 'react';
import { Upload, X, FileText, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useProject } from '../../context/ProjectContext';
import { DocumentType } from '../../types';
import { StoryLayer } from '../processing/StoryLayer';
import { LiveLogTerminal } from '../processing/LiveLogTerminal';
import { MOCK_PROGRESS_EVENTS } from '../../services/mockData';

export const IncrementalUpdateModal: React.FC = () => {
  const { isAddUpdateOpen, setIsAddUpdateOpen, setWhatChangedSummary } = useProject();
  const [docType, setDocType] = useState<DocumentType>('Progress Update');
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const handleStartAnalysis = () => {
    setIsProcessing(true);
    setStageIndex(0);

    // Simulate progress stages
    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setIsAddUpdateOpen(false);
            // Trigger What Changed summary
            setWhatChangedSummary({
              newRisksCount: 2,
              resolvedRisksCount: 1,
              newActionItemsCount: 3,
              prevHealthScore: 72,
              newHealthScore: 68,
              possibleDuplicates: [
                { id: 'dup-1', title: 'QA Load Testing Bandwidth Bottleneck', existingTitle: 'Unassigned Ownership for Integration Testing Suite' }
              ]
            });
          }, 1500);
          return 10;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <Dialog.Root open={isAddUpdateOpen} onOpenChange={setIsAddUpdateOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-surface border border-card-border rounded-2xl p-6 shadow-dropdown z-50 animate-slide-up focus:outline-none max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-500 border border-brand-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-text-primary">
                  Incremental Document Update & Ingestion
                </Dialog.Title>
                <p className="text-xs text-text-muted">
                  Add meeting notes, progress updates or SRS revisions without rebuilding the vector store.
                </p>
              </div>
            </div>
            {!isProcessing && (
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            )}
          </div>

          {/* Form / Processing Area */}
          <div className="mt-6 space-y-6">
            {isProcessing ? (
              <div className="space-y-6">
                <StoryLayer currentStageIndex={stageIndex} />
                <LiveLogTerminal logs={MOCK_PROGRESS_EVENTS.slice(0, stageIndex + 2)} />
              </div>
            ) : (
              <>
                {/* Document Type Selector */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                      Document Type Tag
                    </label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value as DocumentType)}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-primary focus:outline-none focus:border-brand-500"
                    >
                      <option value="Progress Update">Progress Update</option>
                      <option value="Meeting Notes">Meeting Notes</option>
                      <option value="SRS">SRS / Requirements Document</option>
                      <option value="Proposal">Project Proposal</option>
                      <option value="Task List">Task List</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                      Update Date
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-primary focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>
                </div>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand-500/50 hover:bg-brand-50/10 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-text-muted group-hover:text-brand-500 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-semibold text-text-primary">
                    Click or drag PDF, DOCX, CSV or TXT file here
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Incremental indexing will deduplicate entries against existing knowledge base.
                  </p>
                </div>

                {/* Paste Text Area */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                    Or Paste Quick Notes / Updates Directly
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste meeting transcript, Slack summary, or updated task notes here..."
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 rounded-lg border border-border text-text-secondary text-xs font-medium hover:bg-surface-hover transition-colors">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleStartAnalysis}
                    className="px-5 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-glow transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Incremental Analysis</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

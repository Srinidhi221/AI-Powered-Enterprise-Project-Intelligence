import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { DocumentType } from '../types';
import { StoryLayer } from '../components/processing/StoryLayer';
import { LiveLogTerminal } from '../components/processing/LiveLogTerminal';
import { MOCK_PROGRESS_EVENTS } from '../services/mockData';

export const UploadIngestion: React.FC = () => {
  const [docType, setDocType] = useState<DocumentType>('SRS');
  const [pastedNotes, setPastedNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    setIsProcessing(true);
    setIsComplete(false);
    setStageIndex(0);

    const interval = setInterval(() => {
      setStageIndex(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsComplete(true);
          return 10;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Document Upload & Pipeline Ingestion
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Upload project documents to construct the RAG vector store and execute the multi-agent risk intelligence pipeline.
        </p>
      </div>

      {isProcessing || isComplete ? (
        <div className="space-y-6">
          <StoryLayer currentStageIndex={stageIndex} />

          {isComplete && (
            <div className="p-6 rounded-2xl bg-status-healthyBg border border-status-healthy/30 flex items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-status-healthy shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Analysis Completed Successfully!
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Extracted 12 deliverables, 7 risks, 4 blockers, and 12 user stories with grounding citations.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-status-healthy text-white font-semibold text-xs shadow-glow hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <LiveLogTerminal logs={MOCK_PROGRESS_EVENTS.slice(0, stageIndex + 2)} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Upload Zone */}
          <div className="p-8 rounded-2xl bg-surface border border-card-border shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                1. Upload Files or Drag Multi-Format Documents
              </h2>
              <span className="text-xs text-text-muted font-mono">Supports PDF, DOCX, CSV, TXT</span>
            </div>

            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-brand-500/50 hover:bg-brand-50/10 transition-colors cursor-pointer group">
              <Upload className="w-10 h-10 text-text-muted group-hover:text-brand-500 mx-auto mb-3 transition-colors" />
              <p className="text-sm font-bold text-text-primary">
                Drag and drop your project documents here
              </p>
              <p className="text-xs text-text-muted mt-1">
                Or click to browse files from your computer (e.g. SRS_v2.pdf, Meeting_Notes.txt)
              </p>
            </div>

            {/* Document Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Document Type Tag
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-text-primary focus:outline-none focus:border-brand-500"
                >
                  <option value="SRS">SRS / Requirements Document</option>
                  <option value="Proposal">Project Proposal</option>
                  <option value="Meeting Notes">Meeting Notes</option>
                  <option value="Progress Update">Progress Update</option>
                  <option value="Task List">Task List</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paste Quick Notes */}
          <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              2. Or Paste Quick Notes / Updates
            </h2>
            <textarea
              rows={5}
              placeholder="Paste raw meeting transcripts, progress updates or task list items directly..."
              value={pastedNotes}
              onChange={e => setPastedNotes(e.target.value)}
              className="w-full p-4 rounded-xl bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end">
            <button
              onClick={handleStartAnalysis}
              className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Pipeline & Multi-Agent Analysis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

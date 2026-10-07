import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, X, Trash2, Plus, FileCode, Layers } from 'lucide-react';
import { DocumentType } from '../types';
import { StoryLayer } from '../components/processing/StoryLayer';
import { LiveLogTerminal } from '../components/processing/LiveLogTerminal';
import { MOCK_PROGRESS_EVENTS } from '../services/mockData';
import { useDropzone } from 'react-dropzone';

interface SelectedFile {
  id: string;
  name: string;
  size: string;
  type: DocumentType;
  rawFile?: File;
}

const DEFAULT_FILES: SelectedFile[] = [
  { id: 'f-1', name: 'SRS_Document_v2.pdf', size: '2.4 MB', type: 'SRS' },
  { id: 'f-2', name: 'Architecture_Spec.docx', size: '1.1 MB', type: 'Proposal' },
  { id: 'f-3', name: 'Meeting_Notes_Oct02.txt', size: '18 KB', type: 'Meeting Notes' },
  { id: 'f-4', name: 'Progress_Update_Week3.pdf', size: '850 KB', type: 'Progress Update' }
];

export const UploadIngestion: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>(DEFAULT_FILES);
  const [pastedNotes, setPastedNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    const newItems: SelectedFile[] = acceptedFiles.map(file => {
      let suggestedType: DocumentType = 'Progress Update';
      const fname = file.name.toLowerCase();
      if (fname.includes('srs') || fname.includes('requirement')) suggestedType = 'SRS';
      else if (fname.includes('prop') || fname.includes('arch') || fname.includes('spec')) suggestedType = 'Proposal';
      else if (fname.includes('meet') || fname.includes('notes')) suggestedType = 'Meeting Notes';
      else if (fname.includes('task')) suggestedType = 'Task List';

      return {
        id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: suggestedType,
        rawFile: file
      };
    });

    setSelectedFiles(prev => [...prev, ...newItems]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    }
  });

  const handleRemoveFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleTypeChange = (id: string, type: DocumentType) => {
    setSelectedFiles(prev => prev.map(f => (f.id === id ? { ...f, type } : f)));
  };

  const handleStartAnalysis = () => {
    if (selectedFiles.length === 0 && !pastedNotes.trim()) {
      alert('Please upload at least one document or paste project notes to analyze.');
      return;
    }

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
    <div className="space-y-8 max-w-5xl mx-auto py-2 animate-fade-in">
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Multi-Document Ingestion & Pipeline Run
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Upload single or multiple PDF, DOCX, CSV, and TXT files simultaneously. Auto-detects tags and builds vector index.
        </p>
      </div>

      {isProcessing || isComplete ? (
        <div className="space-y-6">
          <StoryLayer currentStageIndex={stageIndex} />

          {isComplete && (
            <div className="p-6 rounded-xl bg-status-healthyBg border border-status-healthy/30 flex items-center justify-between gap-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-status-healthy shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Multi-Document Analysis Completed!
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Processed {selectedFiles.length} files. Extracted 12 deliverables, 7 risks, 4 blockers, and 12 user stories with grounding citations.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-md bg-status-healthy text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <LiveLogTerminal logs={MOCK_PROGRESS_EVENTS.slice(0, stageIndex + 2)} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Multi-File Drag and Drop Zone */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                1. Multi-File Drag & Drop Upload Zone
              </h2>
              <span className="text-xs text-text-muted font-mono">PDF, DOCX, CSV, TXT (Multiple files allowed)</span>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                isDragActive ? 'border-brand-500 bg-brand-50/20' : 'border-border hover:border-brand-500/50 hover:bg-surface-hover/40'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-brand-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-text-primary">
                {isDragActive ? 'Drop your files here now...' : 'Drag & drop MULTIPLE project documents here'}
              </p>
              <p className="text-xs text-text-muted mt-1">
                Or click to browse and select multiple files simultaneously from your computer
              </p>
            </div>
          </div>

          {/* Uploaded File Queue List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Queued Documents ({selectedFiles.length} Selected)
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-status-critical font-medium hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-border border-y border-border">
                {selectedFiles.map(file => (
                  <div key={file.id} className="py-3 flex items-center justify-between gap-4 hover:bg-surface-hover/30 px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-text-primary font-mono">{file.name}</h4>
                        <span className="text-[11px] text-text-muted font-mono">{file.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={file.type}
                        onChange={e => handleTypeChange(file.id, e.target.value as DocumentType)}
                        className="px-2.5 py-1 rounded bg-surface border border-border text-xs font-mono text-text-primary focus:outline-none"
                      >
                        <option value="SRS">SRS Document</option>
                        <option value="Proposal">Proposal / Spec</option>
                        <option value="Meeting Notes">Meeting Notes</option>
                        <option value="Progress Update">Progress Update</option>
                        <option value="Task List">Task List</option>
                      </select>

                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1 rounded text-text-muted hover:text-status-critical transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paste Notes */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              2. Or Paste Quick Notes / Transcripts
            </h2>
            <textarea
              rows={4}
              placeholder="Paste additional raw meeting notes or progress updates to combine with uploaded files..."
              value={pastedNotes}
              onChange={e => setPastedNotes(e.target.value)}
              className="w-full p-3.5 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Execute Button */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={handleStartAnalysis}
              className="px-6 py-3 rounded-md bg-brand-500 text-white font-bold text-xs shadow-xs hover:bg-brand-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Pipeline & Multi-Agent Analysis ({selectedFiles.length} Files)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

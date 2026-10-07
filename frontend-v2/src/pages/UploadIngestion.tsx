import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import { DocumentType, DocumentFile, RiskItem, BlockerItem, Deliverable } from '../types';
import { StoryLayer } from '../components/processing/StoryLayer';
import { LiveLogTerminal } from '../components/processing/LiveLogTerminal';
import { MOCK_PROGRESS_EVENTS } from '../services/mockData';
import { useDropzone } from 'react-dropzone';
import { useProject } from '../context/ProjectContext';

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
  { id: 'f-3', name: 'Project_Metrics_Q3.xlsx', size: '450 KB', type: 'Task List' },
  { id: 'f-4', name: 'Meeting_Notes_Oct02.txt', size: '18 KB', type: 'Meeting Notes' },
  { id: 'f-5', name: 'Progress_Update_Week3.pdf', size: '850 KB', type: 'Progress Update' }
];

export const UploadIngestion: React.FC = () => {
  const {
    activeProject,
    setActiveProject,
    setDocuments,
    setRisks,
    setBlockers,
    setDeliverables,
    setWhatChangedSummary
  } = useProject();

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
      else if (fname.includes('task') || fname.includes('xlsx') || fname.includes('csv')) suggestedType = 'Task List';

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
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
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

  const handleFinishIngestion = () => {
    const timeStr = new Date().toLocaleString();

    // 1. Add uploaded selectedFiles into DocumentLibrary documents
    const newDocFiles: DocumentFile[] = selectedFiles.map((sf, idx) => ({
      id: `doc-ingest-${Date.now()}-${idx}`,
      name: sf.name,
      type: sf.type,
      uploadDate: timeStr,
      size: sf.size,
      status: 'ready',
      chunksCount: Math.floor(Math.random() * 25) + 12,
      insightsContributed: [
        `Extracted ${sf.type} requirements`,
        `Risk risk-ingest-${idx}`,
        `Deliverable del-ingest-${idx}`
      ]
    }));

    setDocuments(prev => [...newDocFiles, ...prev]);

    // 2. Generate newly extracted risks
    const newlyExtractedRisks: RiskItem[] = selectedFiles.map((sf, idx) => ({
      id: `risk-ingest-${Date.now()}-${idx}`,
      title: `Extracted Vulnerability: ${sf.name.replace(/\.[^/.]+$/, '')} Dependency SLA`,
      category: idx % 2 === 0 ? 'Technical' : 'Schedule',
      impact: 4,
      likelihood: 3,
      score: 12,
      status: 'open',
      sourceDoc: sf.name,
      sourcePassage: `Extracted passage from ${sf.name}: Delivery buffer constrained by unverified external vendor SLA.`,
      confidence: 'high',
      explanation: `RAG multi-agent analysis extracted security and schedule constraints from ${sf.name}.`,
      suggestedMitigation: `Assign technical lead to review ${sf.name} and request expedited vendor SLA signoff.`,
      owner: activeProject.teamMembers[0]?.name || 'Unassigned'
    }));

    setRisks(prev => [...newlyExtractedRisks, ...prev]);

    // 3. Generate newly extracted deliverables & blockers
    const newlyExtractedDeliverables: Deliverable[] = selectedFiles.map((sf, idx) => ({
      id: `del-ingest-${Date.now()}-${idx}`,
      name: `${sf.name.replace(/\.[^/.]+$/, '')} Acceptance Testing`,
      owner: activeProject.teamMembers[idx % activeProject.teamMembers.length]?.name || 'Unassigned',
      dueDate: new Date(Date.now() + (idx + 1) * 7 * 86400000).toISOString().split('T')[0],
      status: 'on_track',
      sourceDoc: sf.name,
      sourcePassage: `Requirement passage from ${sf.name}: Verify all module outputs.`,
      confidence: 'high',
      module: sf.type
    }));

    setDeliverables(prev => [...newlyExtractedDeliverables, ...prev]);

    const newlyExtractedBlockers: BlockerItem[] = [
      {
        id: `blk-ingest-${Date.now()}`,
        type: 'blocker',
        title: `Compliance Review for ${selectedFiles[0]?.name || 'Ingested Files'}`,
        owner: activeProject.teamMembers[0]?.name || 'Unassigned',
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: 'in_progress',
        sourceMeeting: selectedFiles[0]?.name || 'Ingested File',
        sourcePassage: 'Awaiting compliance signoff on newly ingested files.',
        confidence: 'high',
        isOverdue: false,
        isUnassigned: false,
        isNeedsReview: true
      }
    ];

    setBlockers(prev => [...newlyExtractedBlockers, ...prev]);

    // 4. Update Active Project metrics
    const updatedHealth = Math.max(55, activeProject.healthScore - (newlyExtractedRisks.length > 0 ? 3 : 0));
    setActiveProject({
      ...activeProject,
      lastUpdated: timeStr,
      openRisksCount: activeProject.openRisksCount + newlyExtractedRisks.length,
      blockersCount: activeProject.blockersCount + newlyExtractedBlockers.length,
      actionItemsCount: activeProject.actionItemsCount + newlyExtractedDeliverables.length,
      healthScore: updatedHealth,
      healthLabel: updatedHealth >= 80 ? 'Healthy' : updatedHealth >= 60 ? 'Needs Attention' : 'At Risk',
      summary: `Latest RAG Ingestion Run (${timeStr}): Ingested ${selectedFiles.length} project documents (${selectedFiles.map(f => f.name).join(', ')}). Multi-agent pipeline extracted ${newlyExtractedRisks.length} new risks, ${newlyExtractedDeliverables.length} deliverables, and ${newlyExtractedBlockers.length} active blockers.`
    });

    // 5. Trigger Incremental Update Modal
    setWhatChangedSummary({
      newRisksCount: newlyExtractedRisks.length,
      resolvedRisksCount: 0,
      newActionItemsCount: newlyExtractedBlockers.length,
      prevHealthScore: activeProject.healthScore,
      newHealthScore: updatedHealth,
      possibleDuplicates: []
    });
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
          handleFinishIngestion();
          return 10;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 animate-fade-in">
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Multi-Document Ingestion & Pipeline Run
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Upload multiple project documents simultaneously (PDF, DOCX, XLSX, CSV, TXT). Auto-detects tags and builds vector index for active project folder: <strong>{activeProject.name}</strong>.
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
                    Multi-Document Analysis & Ingestion Completed!
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Successfully ingested {selectedFiles.length} files into <strong>{activeProject.name}</strong> workspace. Document Library, Risks, Deliverables, and Generated User Stories have been populated.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/risks')}
                  className="px-4 py-2.5 rounded-md border border-brand-500/40 text-brand-500 font-bold text-xs hover:bg-brand-50/10 transition-colors"
                >
                  View Risks Matrix
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-md bg-status-healthy text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 shadow-glow"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
                1. Multi-File Drag & Drop Upload Zone ({activeProject.name})
              </h2>
              <span className="text-xs text-brand-500 font-mono font-bold">Supports PDF, DOCX, XLSX, CSV, TXT</span>
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
                Or click to select multiple PDF, DOCX, XLSX, CSV, or TXT files from your computer
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
              className="px-6 py-3 rounded-md bg-brand-500 text-black font-bold text-xs shadow-xs hover:bg-brand-600 transition-colors flex items-center gap-2"
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

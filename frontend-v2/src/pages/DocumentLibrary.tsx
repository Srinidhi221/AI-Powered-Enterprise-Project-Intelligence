import React, { useState } from 'react';
import { FileText, Trash2, RefreshCw, Eye, Sparkles, Layers, History, Upload } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { DocumentFile } from '../types';
import * as Dialog from '@radix-ui/react-dialog';

export const DocumentLibrary: React.FC = () => {
  const { documents, setDocuments } = useProject();
  const [selectedDoc, setSelectedDoc] = useState<DocumentFile | null>(null);

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Project Document Library</h1>
        <p className="text-xs text-text-muted mt-1">
          View indexed document vectors, chunk statistics, and contribution lineage across project insights.
        </p>
      </div>

      {/* Upload Timeline Graph / Growth Banner */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Knowledge Base Growth Timeline
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Total Chunks Indexed: 90
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {documents.map((doc, idx) => (
            <div key={doc.id} className="p-4 rounded-xl bg-background border border-border space-y-2 relative">
              <span className="text-[10px] font-mono font-bold text-brand-500 uppercase">
                STEP 0{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-text-primary truncate">{doc.name}</h4>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>{doc.chunksCount} Chunks</span>
                <span>{doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Library Table */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Indexed Documents ({documents.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
              <tr>
                <th className="p-3">Document Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Upload Date</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Vector Chunks</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-surface-hover/40 transition-colors">
                  <td className="p-3 text-text-primary font-bold font-mono">{doc.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-text-secondary">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-text-muted">{doc.uploadDate}</td>
                  <td className="p-3 font-mono text-text-muted">{doc.size}</td>
                  <td className="p-3 font-mono text-brand-500 font-bold">{doc.chunksCount} chunks</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-healthyBg text-status-healthy font-bold uppercase">
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-2.5 py-1 rounded bg-surface border border-border text-text-secondary hover:text-brand-500 hover:border-brand-500/50 text-[11px] font-medium"
                    >
                      Preview & Chunks
                    </button>
                    <button
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="px-2 py-1 rounded bg-status-criticalBg text-status-critical hover:opacity-80 text-[11px] font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Chunks Preview Modal */}
      {selectedDoc && (
        <Dialog.Root open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border border-card-border rounded-2xl p-6 shadow-dropdown z-50 animate-slide-up focus:outline-none max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-500" />
                  <Dialog.Title className="text-base font-bold text-text-primary">
                    Document Vector Chunks: {selectedDoc.name}
                  </Dialog.Title>
                </div>
                <Dialog.Close asChild>
                  <button className="p-1 rounded text-text-muted hover:text-text-primary">
                    ✕
                  </button>
                </Dialog.Close>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-50/10 border border-brand-500/20">
                  <span className="font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-wider text-[10px]">
                    Insights Contributed by this File:
                  </span>
                  <ul className="mt-1 space-y-1 text-text-primary font-mono text-[11px]">
                    {selectedDoc.insightsContributed.map((ins, i) => (
                      <li key={i}>• {ins}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-text-muted uppercase tracking-wider text-[10px]">
                    Sample Chunks (Overlap size 50):
                  </span>
                  <div className="p-3 rounded-xl bg-background border border-border font-mono text-[11px] text-text-secondary leading-relaxed max-h-48 overflow-y-auto">
                    [Chunk 01] Section 3.1 Requirements: System shall ingest PDF, DOCX, CSV, TXT files and generate ChromaDB embeddings.
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border font-mono text-[11px] text-text-secondary leading-relaxed max-h-48 overflow-y-auto">
                    [Chunk 02] Section 4.2 Multi-Agent Pipeline: Scope, Risk, Blocker, and Documentation agents run sequentially.
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-border">
                  <span className="text-[11px] text-status-warning font-medium">
                    ⚠️ Removing this file will automatically update dependent project insights.
                  </span>
                  <button
                    onClick={() => handleRemoveDoc(selectedDoc.id)}
                    className="px-4 py-2 rounded-lg bg-status-critical text-white text-xs font-semibold hover:opacity-90"
                  >
                    Confirm Removal
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};

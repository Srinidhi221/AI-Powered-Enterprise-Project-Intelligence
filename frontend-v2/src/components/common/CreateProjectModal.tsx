import React, { useState } from 'react';
import { FolderPlus, X, Sparkles, Folder, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Event & Exhibition');
  const [nextMilestoneName, setNextMilestoneName] = useState('');
  const [daysToMilestone, setDaysToMilestone] = useState<number>(30);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name: name.trim(),
      description: description.trim() || `Dedicated workspace and risk intelligence folder for ${name.trim()}`,
      category,
      nextMilestoneName: nextMilestoneName.trim() || 'Phase 1 - Kickoff & Initial Scope',
      daysToMilestone: Number(daysToMilestone) || 30
    });

    setSuccessMsg(`Project folder "${name.trim()}" created successfully! Switching workspace...`);
    setTimeout(() => {
      setSuccessMsg('');
      setName('');
      setDescription('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-surface border border-card-border rounded-2xl shadow-2xl p-6 space-y-6 relative text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-500">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Create New Project Folder</h2>
              <p className="text-[11px] text-text-muted">
                Initialize a separate project workspace to upload documents and isolate risk intelligence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg ? (
          <div className="p-4 rounded-xl bg-status-healthyBg border border-status-healthy/30 text-status-healthy flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-brand-500" />
                <span>Project Name / Folder Title *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ExhibitionPlan or SupplyChain AI"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-brand-500 font-medium"
              />
              <p className="text-[10px] text-text-muted">
                This creates a separate isolated folder context for document uploads and risk scoring.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                Description & Goals
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of project objectives, scope, or event details..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-brand-500"
              />
            </div>

            {/* Category & Days to Milestone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-text-muted" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-brand-500"
                >
                  <option value="Event & Exhibition">Event & Exhibition</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Logistics & Supply">Logistics & Supply</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span>Days to Key Milestone</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={daysToMilestone}
                  onChange={e => setDaysToMilestone(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            {/* Next Milestone Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                First Target Milestone Name
              </label>
              <input
                type="text"
                placeholder="e.g. Hall 3 Blueprint Approval & Security License"
                value={nextMilestoneName}
                onChange={e => setNextMilestoneName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-brand-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border hover:bg-background text-text-secondary font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create & Switch Project</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Sliders, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const Settings: React.FC = () => {
  const { activeProject } = useProject();
  const [projName, setProjName] = useState(activeProject.name);
  const [projDesc, setProjDesc] = useState(activeProject.description);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Project Settings & Configuration</h1>
          <p className="text-xs text-text-muted mt-1">
            Manage project details, team owner matching, risk thresholds, and knowledge base data management.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{savedMsg ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Section 1: Project Metadata */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          1. Project Overview & Identity
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-text-secondary uppercase block mb-1">Project Name</label>
            <input
              type="text"
              value={projName}
              onChange={e => setProjName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text-primary focus:outline-none focus:border-brand-500 font-bold"
            />
          </div>

          <div>
            <label className="font-semibold text-text-secondary uppercase block mb-1">Description</label>
            <textarea
              rows={3}
              value={projDesc}
              onChange={e => setProjDesc(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-border text-text-primary focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Team Members & Role Owner Matching */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              2. Team Members & Owner Matching Rules
            </h2>
          </div>
          <span className="text-xs font-mono text-text-muted">4 Team Members</span>
        </div>

        <div className="space-y-2">
          {activeProject.teamMembers.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-background border border-border flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-text-primary">{m.name}</span>
                <span className="text-text-muted ml-2">({m.email})</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface border border-border text-text-secondary font-mono">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Health Score Weightings */}
      <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Sliders className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            3. Health Score Dimension Weightings
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-background border border-border text-center">
            <span className="text-text-muted block">Scope Clarity</span>
            <span className="font-bold text-brand-500 text-lg">30%</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border text-center">
            <span className="text-text-muted block">Timeline Risk</span>
            <span className="font-bold text-brand-500 text-lg">40%</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border text-center">
            <span className="text-text-muted block">Blocker Resolution</span>
            <span className="font-bold text-brand-500 text-lg">30%</span>
          </div>
        </div>
      </div>

      {/* Section 4: Data Management */}
      <div className="p-6 rounded-2xl bg-status-criticalBg/20 border border-status-critical/30 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-status-critical font-bold text-sm uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone: Knowledge Base & Project Data</span>
        </div>

        <p className="text-xs text-text-primary">
          Clearing the project knowledge base will delete all ChromaDB dense vector embeddings and reset agent extractions.
        </p>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-status-critical text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Knowledge Base Vectors</span>
          </button>
          <button className="px-4 py-2 rounded-xl border border-status-critical text-status-critical font-bold text-xs hover:bg-status-criticalBg transition-colors">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpRight, ShieldAlert, FolderPlus } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

export const ProjectsHome: React.FC = () => {
  const { projects, setActiveProject, setIsCreateProjectOpen } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(
    p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProject = (proj: typeof projects[0]) => {
    setActiveProject(proj);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Projects Workspace Overview</h1>
          <p className="text-sm text-text-secondary mt-1">
            Enterprise project folders with isolated document upload spaces and AI risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2 rounded-md bg-brand-500 text-white font-semibold text-xs shadow-glow hover:bg-brand-600 transition-colors flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Project Folder</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project folders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
          />
        </div>

        <span className="text-xs font-mono text-text-muted">
          Showing {filteredProjects.length} Active Project Workspaces
        </span>
      </div>

      {/* Project Rows List (No heavy rounded cards) */}
      <div className="divide-y divide-border">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            onClick={() => handleOpenProject(proj)}
            className="py-5 px-2 hover:bg-surface-hover/50 transition-colors cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                  {proj.name}
                </h3>
                <SeverityBadge level={proj.healthLabel} size="sm" />
                <span className="font-mono text-xs font-bold text-text-secondary">
                  <AnimatedCounter value={proj.healthScore} suffix="/100" />
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {proj.description}
              </p>

              <span className="text-[11px] font-mono text-text-muted block">
                Last updated · {proj.lastUpdated}
              </span>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-mono text-status-critical font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span><AnimatedCounter value={proj.openRisksCount} /> Open Risks</span>
              </div>

              <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-brand-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

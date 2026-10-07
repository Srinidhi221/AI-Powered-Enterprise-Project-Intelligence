import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search, ArrowUpRight, Activity, ShieldAlert, ArrowUpDown } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SeverityBadge } from '../components/common/SeverityBadge';

export const ProjectsHome: React.FC = () => {
  const { projects, setActiveProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'health' | 'recent'>('recent');
  const navigate = useNavigate();

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

  const handleOpenProject = (proj: typeof projects[0]) => {
    setActiveProject(proj);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Projects Overview</h1>
          <p className="text-xs text-text-muted mt-1">
            Manage enterprise projects, monitor real-time AI health scores, and inspect risk intelligence.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Analysis</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-card-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort by:</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${sortBy === 'recent' ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'hover:bg-surface-hover'}`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setSortBy('health')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${sortBy === 'health' ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'hover:bg-surface-hover'}`}
          >
            Health Score
          </button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            onClick={() => handleOpenProject(proj)}
            className="p-6 rounded-2xl bg-surface border border-card-border shadow-card hover:border-brand-500/50 hover:shadow-glow transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-500 border border-brand-500/20">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary group-hover:text-brand-500 transition-colors">
                      {proj.name}
                    </h3>
                    <span className="text-[11px] font-mono text-text-muted">
                      Updated {proj.lastUpdated}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand-500 transition-colors" />
              </div>

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {proj.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SeverityBadge level={proj.healthLabel} />
                <span className="text-xs font-mono font-bold text-text-primary">
                  {proj.healthScore}/100
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-status-critical">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{proj.openRisksCount} Open Risks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

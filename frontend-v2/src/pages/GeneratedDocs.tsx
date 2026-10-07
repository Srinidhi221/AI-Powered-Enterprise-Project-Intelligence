import React, { useState } from 'react';
import { FileText, Download, RefreshCw, Filter, Edit3, CheckCircle2, ShieldAlert, CheckSquare } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SourceCitationChip } from '../components/common/SourceCitationChip';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { jsPDF } from 'jspdf';

export const GeneratedDocs: React.FC = () => {
  const { userStories, risks, blockers, documents } = useProject();
  const [activeTab, setActiveTab] = useState<'stories' | 'risks' | 'actions'>('stories');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const filteredStories = userStories.filter(s => {
    if (filterPriority !== 'all' && s.priority !== filterPriority) return false;
    return true;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AI Project Intelligence - Generated Document Export', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated from ${documents.length} active documents as of ${new Date().toLocaleDateString()}`, 14, 28);

    if (activeTab === 'stories') {
      let y = 40;
      userStories.forEach((st, i) => {
        doc.setFontSize(12);
        doc.text(`${st.id}: ${st.title}`, 14, y);
        doc.setFontSize(9);
        doc.text(`Story: ${st.storyText}`, 14, y + 6);
        y += 20;
      });
    } else if (activeTab === 'risks') {
      let y = 40;
      risks.forEach((r, i) => {
        doc.setFontSize(10);
        doc.text(`${r.id} - ${r.title} (Score: ${r.score}/25)`, 14, y);
        doc.setFontSize(8);
        doc.text(`Mitigation: ${r.suggestedMitigation}`, 14, y + 5);
        y += 15;
      });
    }

    doc.save(`project_export_${activeTab}_${Date.now()}.pdf`);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title & Version Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
              Generated Documentation Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-bold border border-brand-500/20">
              MILESTONE 4 EXPORT
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Version indicator: generated from {documents.length} documents as of {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-secondary text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-500 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Section'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-glow transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to PDF / DOCX / CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-medium">
        <button
          onClick={() => setActiveTab('stories')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'stories'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4 text-brand-500" />
          <span>User Stories & Acceptance Criteria ({userStories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'risks'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-status-critical" />
          <span>Formal Risk Register ({risks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'actions'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-status-warning" />
          <span>Action Item List ({blockers.length})</span>
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'stories' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-card-border shadow-xs text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-brand-500" />
              <span>Filter Priority:</span>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="px-2.5 py-1 rounded bg-background border border-border text-text-primary focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <span className="text-text-muted font-mono">
              Auto-formatted with Gherkin acceptance criteria
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map(st => (
              <div key={st.id} className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-500 uppercase">{st.id} • {st.module}</span>
                    <h3 className="text-sm font-bold text-text-primary mt-0.5 leading-snug">{st.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${st.priority === 'High' ? 'bg-status-criticalBg text-status-critical' : 'bg-status-warningBg text-status-warning'}`}>
                    {st.priority}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-background border border-border text-xs text-text-secondary leading-relaxed font-mono">
                  "{st.storyText}"
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                    Acceptance Criteria:
                  </span>
                  <ul className="space-y-1.5 text-xs text-text-primary">
                    {st.acceptanceCriteria.map((ac, i) => (
                      <li key={i} className="flex items-start gap-2 p-2 rounded bg-surface-hover/40 border border-border/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-healthy shrink-0 mt-0.5" />
                        <span>{ac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <SourceCitationChip docName={st.sourceDoc} />
                  <button className="text-[11px] font-medium text-brand-500 hover:underline flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Criteria</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'risks' ? (
        /* Formal Risk Register Table */
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Formal Risk Register (ID, Impact, Likelihood, Mitigation, Owner, Status)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Risk ID</th>
                  <th className="p-3">Risk Title & Description</th>
                  <th className="p-3">Impact</th>
                  <th className="p-3">Likelihood</th>
                  <th className="p-3">Suggested Mitigation</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {risks.map(r => (
                  <tr key={r.id} className="hover:bg-surface-hover/40">
                    <td className="p-3 font-mono font-bold text-brand-500">{r.id}</td>
                    <td className="p-3 font-bold text-text-primary">{r.title}</td>
                    <td className="p-3 font-mono text-center">{r.impact}</td>
                    <td className="p-3 font-mono text-center">{r.likelihood}</td>
                    <td className="p-3 text-text-secondary">{r.suggestedMitigation}</td>
                    <td className="p-3 font-mono">{r.owner}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${r.status === 'mitigated' ? 'bg-status-healthyBg text-status-healthy' : 'bg-status-criticalBg text-status-critical'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Action Item List */
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Extracted Action Items List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Action Item Title</th>
                  <th className="p-3">Assigned Owner</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {blockers.map(b => (
                  <tr key={b.id} className="hover:bg-surface-hover/40">
                    <td className="p-3 font-mono text-text-muted">{b.id}</td>
                    <td className="p-3 font-bold text-text-primary">{b.title}</td>
                    <td className="p-3 font-mono">{b.owner}</td>
                    <td className="p-3 font-mono text-text-muted">{b.dueDate}</td>
                    <td className="p-3 font-mono text-text-secondary uppercase">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

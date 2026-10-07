import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Eye, FileSpreadsheet, FileCode } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { jsPDF } from 'jspdf';

export const ReportsExport: React.FC = () => {
  const { activeProject, risks, blockers, deliverables, documents } = useProject();
  const [selectedTemplate, setSelectedTemplate] = useState<'exec' | 'full' | 'risk' | 'weekly'>('exec');
  const [sections, setSections] = useState({
    executiveSummary: true,
    healthBreakdown: true,
    riskRegister: true,
    actionItems: true,
    scopeMatrix: false
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${activeProject.name} - ${selectedTemplate.toUpperCase()} REPORT`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleString()} from RAG Knowledge Base`, 14, 28);

    let y = 40;
    if (sections.executiveSummary) {
      doc.setFontSize(12);
      doc.text('Executive Summary & Health Score', 14, y);
      doc.setFontSize(9);
      doc.text(`Health Score: ${activeProject.healthScore}/100 (${activeProject.healthLabel})`, 14, y + 6);
      doc.text(activeProject.summary, 14, y + 12);
      y += 30;
    }

    if (sections.riskRegister) {
      doc.setFontSize(12);
      doc.text('Identified Risks Summary', 14, y);
      y += 8;
      risks.slice(0, 4).forEach(r => {
        doc.setFontSize(9);
        doc.text(`- ${r.title} (Severity: ${r.score}/25)`, 14, y);
        y += 6;
      });
    }

    doc.save(`${activeProject.name.toLowerCase().replace(/\s+/g, '_')}_${selectedTemplate}_report.pdf`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Reports & Document Export</h1>
        <p className="text-xs text-text-muted mt-1">
          Generate formal executive summaries, weekly status reports, and risk registers formatted for client export.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Selection */}
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            1. Select Report Template
          </h2>

          <div className="space-y-2">
            {[
              { id: 'exec', name: 'Executive Summary Report', desc: 'Hero score, KPI tiles, and narrative summary' },
              { id: 'full', name: 'Full Project Comprehensive Report', desc: 'Complete breakdown of scope, risks, blockers, and docs' },
              { id: 'risk', name: 'Risk & Vulnerability Only Report', desc: 'Focus strictly on 5x5 heatmap, severity scores and mitigations' },
              { id: 'weekly', name: 'Weekly Status Update Briefing', desc: 'Work in progress, recent activity, and upcoming milestones' }
            ].map(tpl => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === tpl.id
                    ? 'bg-brand-50/50 dark:bg-brand-50/20 border-brand-500 shadow-xs'
                    : 'bg-background border-border hover:border-brand-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">{tpl.name}</span>
                  {selectedTemplate === tpl.id && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                </div>
                <p className="text-[11px] text-text-muted mt-1">{tpl.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider pt-2 border-t border-border">
            2. Configurable Included Sections
          </h3>

          <div className="space-y-2 text-xs">
            {Object.keys(sections).map(key => (
              <label key={key} className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={(sections as any)[key]}
                  onChange={e => setSections(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="rounded border-border text-brand-500"
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Live Report Document Preview
                </h3>
              </div>
              <span className="text-xs font-mono text-text-muted">
                Format: PDF / DOCX / CSV
              </span>
            </div>

            {/* Paper Preview Box */}
            <div className="p-8 rounded-xl bg-background border border-border font-serif space-y-4 text-xs shadow-inner max-h-[420px] overflow-y-auto">
              <div className="border-b border-border pb-3">
                <h1 className="text-lg font-bold font-sans text-text-primary">{activeProject.name}</h1>
                <span className="text-xs font-mono text-text-muted">
                  Report Type: {selectedTemplate.toUpperCase()} • Date: {new Date().toLocaleDateString()}
                </span>
              </div>

              {sections.executiveSummary && (
                <div className="space-y-1 font-sans">
                  <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider">
                    Executive Summary
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{activeProject.summary}</p>
                </div>
              )}

              {sections.healthBreakdown && (
                <div className="space-y-1 font-sans">
                  <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider">
                    Project Health Score: {activeProject.healthScore}/100 ({activeProject.healthLabel})
                  </h3>
                  <p className="text-text-muted text-xs">
                    Overall project delivery index computed across 3 dimensions.
                  </p>
                </div>
              )}

              {sections.riskRegister && (
                <div className="space-y-1 font-sans">
                  <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider">
                    Top Identified Risks ({risks.length})
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary text-xs">
                    {risks.slice(0, 3).map(r => (
                      <li key={r.id}>
                        <strong>{r.title}</strong> (Score: {r.score}/25) — {r.suggestedMitigation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Eye, ShieldAlert, Sparkles, Table, Calendar, User, FileCheck } from 'lucide-react';
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
    scopeMatrix: true
  });

  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth(); // 595.28
    const pageHeight = doc.internal.pageSize.getHeight(); // 841.89
    const margin = 36;
    const contentWidth = pageWidth - margin * 2; // 523.28

    let y = 36;

    const checkPageBreak = (heightNeeded: number) => {
      if (y + heightNeeded > pageHeight - margin - 25) {
        doc.addPage();
        y = 36;
      }
    };

    // 1. TOP HEADER BANNER (Dark Slate Bar)
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 54, 'F');

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(234, 179, 8); // Gold #EAB308
    doc.text(activeProject.name.toUpperCase(), margin + 14, y + 22);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text(`${selectedTemplate.toUpperCase()} REPORT • RAG INTELLIGENCE SUMMARY • GENERATED: ${new Date().toLocaleDateString()}`, margin + 14, y + 38);

    // Right Tag Badge
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(pageWidth - margin - 150, y + 12, 136, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(234, 179, 8);
    doc.text('EXECUTIVE INTELLIGENCE', pageWidth - margin - 142, y + 26);

    y += 66;

    // 2. EXECUTIVE SUMMARY BOX
    if (sections.executiveSummary) {
      checkPageBreak(90);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'FD');

      // Health Score Badge Left
      doc.setFillColor(activeProject.healthScore >= 80 ? 220 : activeProject.healthScore >= 60 ? 254 : 254, activeProject.healthScore >= 80 ? 252 : activeProject.healthScore >= 60 ? 243 : 226, activeProject.healthScore >= 80 ? 231 : activeProject.healthScore >= 60 ? 199 : 226);
      doc.roundedRect(margin + 12, y + 12, 60, 56, 6, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(activeProject.healthScore >= 80 ? 21 : activeProject.healthScore >= 60 ? 161 : 185, activeProject.healthScore >= 80 ? 128 : activeProject.healthScore >= 60 ? 98 : 28, activeProject.healthScore >= 80 ? 61 : activeProject.healthScore >= 60 ? 7 : 28);
      doc.text(String(activeProject.healthScore), margin + 26, y + 42);
      doc.setFontSize(7);
      doc.text('/100 HEALTH', margin + 18, y + 54);

      // Summary Text Right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('EXECUTIVE NARRATIVE SUMMARY', margin + 84, y + 24);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(activeProject.summary, contentWidth - 98);
      doc.text(summaryLines, margin + 84, y + 38);

      y += 94;
    }

    // 3. KPI TILES STRIP
    if (sections.healthBreakdown) {
      checkPageBreak(50);
      const tileW = (contentWidth - 18) / 4;
      const kpis = [
        { label: 'HEALTH INDEX', val: `${activeProject.healthScore}/100`, sub: activeProject.healthLabel },
        { label: 'OPEN RISKS', val: `${activeProject.openRisksCount} Items`, sub: `${risks.filter(r => r.score >= 12).length} High Severity` },
        { label: 'ACTIVE BLOCKERS', val: `${activeProject.blockersCount} Items`, sub: `${blockers.filter(b => b.isOverdue).length} Overdue` },
        { label: 'NEXT MILESTONE', val: `${activeProject.daysToMilestone} Days`, sub: activeProject.nextMilestoneName.slice(0, 18) + '...' }
      ];

      kpis.forEach((kpi, idx) => {
        const kx = margin + idx * (tileW + 6);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(kx, y, tileW, 46, 4, 4, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label, kx + 8, y + 14);

        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(kpi.val, kx + 8, y + 28);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.sub, kx + 8, y + 39);
      });

      y += 60;
    }

    // 4. RISK REGISTER TABLE
    if (sections.riskRegister && risks.length > 0) {
      checkPageBreak(120);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('IDENTIFIED RISK REGISTER & MITIGATIONS', margin, y);
      doc.setFillColor(234, 179, 8);
      doc.rect(margin, y + 4, 200, 2, 'F');

      y += 16;

      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 20, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Risk Title & Description', margin + 8, y + 13);
      doc.text('Category', margin + 220, y + 13);
      doc.text('Impact/Like', margin + 285, y + 13);
      doc.text('Score', margin + 345, y + 13);
      doc.text('Owner', margin + 385, y + 13);
      doc.text('Mitigation Strategy', margin + 435, y + 13);

      y += 20;

      risks.forEach((r, idx) => {
        const titleLines = doc.splitTextToSize(r.title, 200);
        const mitLines = doc.splitTextToSize(r.suggestedMitigation || 'None specified', 80);
        const rowHeight = Math.max(titleLines.length, mitLines.length) * 11 + 10;

        checkPageBreak(rowHeight);

        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, contentWidth, rowHeight, 'F');
        }

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(titleLines, margin + 8, y + 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(r.category, margin + 220, y + 12);
        doc.text(`${r.impact}/5 × ${r.likelihood}/5`, margin + 285, y + 12);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(r.score >= 12 ? 185 : 100, r.score >= 12 ? 28 : 116, r.score >= 12 ? 28 : 139);
        doc.text(`${r.score}/25`, margin + 345, y + 12);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(r.owner.slice(0, 8), margin + 385, y + 12);
        doc.text(mitLines, margin + 435, y + 12);

        y += rowHeight;
      });

      y += 20;
    }

    // 5. BLOCKERS & ACTION ITEMS
    if (sections.actionItems && blockers.length > 0) {
      checkPageBreak(100);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('ACTIVE BLOCKERS & ACTION ITEMS', margin, y);
      doc.setFillColor(234, 179, 8);
      doc.rect(margin, y + 4, 180, 2, 'F');

      y += 16;

      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 20, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Item Description', margin + 8, y + 13);
      doc.text('Type', margin + 270, y + 13);
      doc.text('Status', margin + 330, y + 13);
      doc.text('Due Date', margin + 400, y + 13);
      doc.text('Owner', margin + 465, y + 13);

      y += 20;

      blockers.forEach((b, idx) => {
        checkPageBreak(24);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y, contentWidth, 22, 'F');
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + 22, margin + contentWidth, y + 22);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(b.title.slice(0, 45), margin + 8, y + 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(b.type.toUpperCase(), margin + 270, y + 14);
        doc.text(b.status.replace('_', ' ').toUpperCase(), margin + 330, y + 14);
        doc.text(b.dueDate, margin + 400, y + 14);
        doc.text(b.owner.slice(0, 10), margin + 465, y + 14);

        y += 22;
      });

      y += 20;
    }

    // 6. SCOPE DELIVERABLES MATRIX
    if (sections.scopeMatrix && deliverables.length > 0) {
      checkPageBreak(100);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('SCOPE DELIVERABLES BREAKDOWN', margin, y);
      doc.setFillColor(234, 179, 8);
      doc.rect(margin, y + 4, 180, 2, 'F');

      y += 16;

      deliverables.forEach(d => {
        checkPageBreak(28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`• ${d.name}`, margin + 8, y + 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`[Module: ${d.module} | Owner: ${d.owner} | Status: ${d.status.toUpperCase()} | Source: ${d.sourceDoc}]`, margin + 20, y + 23);
        y += 26;
      });

      y += 15;
    }

    // FOOTER PAGE NUMBERING LOOP
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 30, margin + contentWidth, pageHeight - 30);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('AI Project Intelligence & Risk Advisor • Executive Report', margin, pageHeight - 16);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 45, pageHeight - 16);
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
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-6">
          <div>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
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
          </div>

          <div>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider pt-4 border-t border-border mb-3">
              2. Configurable Included Sections
            </h3>

            <div className="space-y-2 text-xs">
              {Object.keys(sections).map(key => (
                <label key={key} className="flex items-center gap-2 text-text-secondary cursor-pointer hover:text-text-primary">
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
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Live Report Document Preview ({activeProject.name})
                </h3>
              </div>
              <span className="text-xs font-mono text-text-muted">
                Executive PDF Format
              </span>
            </div>

            {/* Paper Preview Box */}
            <div className="p-6 rounded-xl bg-background border border-border space-y-6 text-xs shadow-inner max-h-[460px] overflow-y-auto">
              {/* Document Header Band */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-white">
                <div>
                  <h1 className="text-base font-extrabold text-brand-500">{activeProject.name.toUpperCase()}</h1>
                  <span className="text-[10px] font-mono text-slate-300">
                    {selectedTemplate.toUpperCase()} REPORT • GENERATED: {new Date().toLocaleDateString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-bold text-brand-500 border border-brand-500/30">
                  CONFIDENTIAL EXECUTIVE REPORT
                </span>
              </div>

              {/* Executive Summary */}
              {sections.executiveSummary && (
                <div className="p-4 rounded-xl bg-surface border border-card-border space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <span>Executive Narrative Summary</span>
                    </h3>
                    <span className="font-mono text-xs font-bold text-brand-500">
                      Health Index: {activeProject.healthScore}/100 ({activeProject.healthLabel})
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">{activeProject.summary}</p>
                </div>
              )}

              {/* KPI Strip */}
              {sections.healthBreakdown && (
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-surface border border-card-border">
                    <span className="text-[10px] text-text-muted font-bold block">HEALTH</span>
                    <span className="text-base font-mono font-bold text-brand-500">{activeProject.healthScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-card-border">
                    <span className="text-[10px] text-text-muted font-bold block">OPEN RISKS</span>
                    <span className="text-base font-mono font-bold text-status-critical">{activeProject.openRisksCount}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-card-border">
                    <span className="text-[10px] text-text-muted font-bold block">BLOCKERS</span>
                    <span className="text-base font-mono font-bold text-status-warning">{activeProject.blockersCount}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border border-card-border">
                    <span className="text-[10px] text-text-muted font-bold block">DAYS TO GO</span>
                    <span className="text-base font-mono font-bold text-text-primary">{activeProject.daysToMilestone}</span>
                  </div>
                </div>
              )}

              {/* Risk Register Table Preview */}
              {sections.riskRegister && (
                <div className="space-y-2">
                  <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-status-critical" />
                    <span>Risk Register ({risks.length} Extracted Risks)</span>
                  </h3>
                  <div className="border border-card-border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2">Title</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Severity</th>
                          <th className="p-2">Mitigation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {risks.slice(0, 3).map(r => (
                          <tr key={r.id} className="hover:bg-surface-hover/40">
                            <td className="p-2 font-semibold text-text-primary">{r.title}</td>
                            <td className="p-2 text-text-muted">{r.category}</td>
                            <td className="p-2 font-mono font-bold text-status-critical">{r.score}/25</td>
                            <td className="p-2 text-text-secondary truncate max-w-[140px]">{r.suggestedMitigation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Executive PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

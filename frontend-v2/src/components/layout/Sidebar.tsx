import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderKanban,
  Upload,
  LayoutDashboard,
  Target,
  ShieldAlert,
  CheckSquare,
  FileText,
  Activity,
  MessageSquare,
  FileSpreadsheet,
  Sliders,
  Download,
  Settings,
  Sparkles
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'PROJECT',
    items: [
      { name: 'Projects Home', path: '/', icon: FolderKanban },
      { name: 'Upload / Setup', path: '/upload', icon: Upload },
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Scope & Deliverables', path: '/scope', icon: Target }
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'Risks', path: '/risks', icon: ShieldAlert },
      { name: 'Blockers & Actions', path: '/blockers', icon: CheckSquare },
      { name: 'Health Score', path: '/health', icon: Activity },
      { name: 'Assistant (Chat)', path: '/chat', icon: MessageSquare }
    ]
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { name: 'Document Library', path: '/documents', icon: FileSpreadsheet },
      { name: 'Generated Docs', path: '/generated-docs', icon: FileText }
    ]
  },
  {
    title: 'ANALYSIS',
    items: [
      { name: 'Simulation / What-If', path: '/simulation', icon: Sliders },
      { name: 'Reports & Export', path: '/reports', icon: Download },
      { name: 'Settings', path: '/settings', icon: Settings }
    ]
  }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Header Branding */}
        <div className="h-16 px-5 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500 text-black font-bold flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-text-primary tracking-tight leading-tight">
              AI Project Intelligence
            </h1>
            <span className="text-[10px] font-mono text-brand-500 font-bold tracking-wider block">
              RISK ADVISOR v2.0
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-130px)]">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-0.5">
              <span className="px-3 text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                {group.title}
              </span>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50/20 text-brand-500 font-bold border-l-2 border-brand-500'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-3.5 border-t border-border text-[11px] text-text-muted flex items-center justify-between">
        <span>Grounded RAG v2</span>
        <span className="font-mono text-[10px] text-brand-500 font-bold">4 Documents</span>
      </div>
    </aside>
  );
};

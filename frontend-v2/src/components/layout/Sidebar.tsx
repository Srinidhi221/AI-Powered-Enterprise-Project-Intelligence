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

const NAV_ITEMS = [
  { group: 'Overview', items: [
    { name: 'Projects Home', path: '/', icon: FolderKanban, tier: 'Must' },
    { name: 'Upload / Setup', path: '/upload', icon: Upload, tier: 'Must' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, tier: 'Must' },
  ]},
  { group: 'Intelligence Modules', items: [
    { name: 'Scope & Deliverables', path: '/scope', icon: Target, tier: 'Should' },
    { name: 'Risks', path: '/risks', icon: ShieldAlert, tier: 'Must' },
    { name: 'Blockers & Actions', path: '/blockers', icon: CheckSquare, tier: 'Must' },
    { name: 'Generated Docs', path: '/generated-docs', icon: FileText, tier: 'Must' },
    { name: 'Health Score Detail', path: '/health', icon: Activity, tier: 'Should' },
    { name: 'Assistant (Chat)', path: '/chat', icon: MessageSquare, tier: 'Must' },
  ]},
  { group: 'Tools & Management', items: [
    { name: 'Document Library', path: '/documents', icon: FileSpreadsheet, tier: 'Should' },
    { name: 'Simulation / What-If', path: '/simulation', icon: Sliders, tier: 'Nice' },
    { name: 'Reports & Export', path: '/reports', icon: Download, tier: 'Nice' },
    { name: 'Settings', path: '/settings', icon: Settings, tier: 'Nice' },
  ]}
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-text-primary leading-tight tracking-tight">
              AI Project Intelligence
            </h1>
            <span className="text-[10px] font-mono text-brand-600 dark:text-brand-500 font-semibold tracking-wider">
              RISK ADVISOR v2.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAV_ITEMS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                {group.group}
              </span>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-50/20 text-brand-600 dark:text-brand-500 font-semibold shadow-xs'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.tier === 'Must' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500" title="Must Have Tier" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-surface-hover/30 text-[11px] text-text-muted flex items-center justify-between">
        <span>Milestone 4 Ready</span>
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">
          RAG + 4 AGENTS
        </span>
      </div>
    </aside>
  );
};

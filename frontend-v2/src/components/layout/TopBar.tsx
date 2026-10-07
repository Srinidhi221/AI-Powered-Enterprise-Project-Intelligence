import React from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Settings,
  Sparkles
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    projects,
    activeProject,
    setActiveProject,
    setIsCreateProjectOpen,
    setIsAddUpdateOpen,
    setIsChatDrawerOpen,
    setIsSearchOpen
  } = useProject();
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Project Selector & Metadata */}
      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-brand-500 transition-colors focus:outline-none">
              <span>{activeProject.name}</span>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </button>
          </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-64 bg-surface border border-border rounded-lg p-1 shadow-dropdown z-50 focus:outline-none">
              <DropdownMenu.Label className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Select Active Project Workspace
              </DropdownMenu.Label>
              {projects.map(p => (
                <DropdownMenu.Item
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                    p.id === activeProject.id ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-[10px] text-text-muted">{p.healthScore}/100</span>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item
                onClick={() => setIsCreateProjectOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-bold text-brand-500 hover:bg-brand-50/10 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New Project Folder</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>

        <span className="text-xs text-text-muted hidden md:inline font-mono">
          Last updated · {activeProject.lastUpdated}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1 text-[10px] font-mono border border-border rounded">⌘K</kbd>
        </button>

        {/* Add Update */}
        <button
          onClick={() => setIsAddUpdateOpen(true)}
          className="px-3 py-1.5 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Update</span>
        </button>

        {/* Ask AI */}
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="px-3 py-1.5 rounded-md border border-brand-500/30 text-brand-600 dark:text-brand-500 hover:bg-brand-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Notifications */}
        <button
          className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors focus:outline-none">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-32 bg-surface border border-border rounded-lg p-1 shadow-dropdown z-50">
              <DropdownMenu.Item onClick={() => setTheme('light')} className="px-2 py-1 text-xs text-text-primary hover:bg-surface-hover cursor-pointer">
                Light Mode
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme('dark')} className="px-2 py-1 text-xs text-text-primary hover:bg-surface-hover cursor-pointer">
                Dark Mode
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme('system')} className="px-2 py-1 text-xs text-text-primary hover:bg-surface-hover cursor-pointer">
                System Mode
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

import React from 'react';
import {
  Search,
  PlusCircle,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from '../../context/ThemeContext';
import { useProject } from '../../context/ProjectContext';

export const TopBar: React.FC = () => {
  const { theme, setTheme, density, setDensity } = useTheme();
  const {
    projects,
    activeProject,
    setActiveProject,
    setIsAddUpdateOpen,
    setIsChatDrawerOpen,
    setIsSearchOpen
  } = useProject();

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Project Switcher */}
      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-primary text-xs font-semibold transition-colors focus:outline-none">
              <div className="w-2.5 h-2.5 rounded-full bg-status-warning animate-pulse" />
              <span>{activeProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-64 bg-surface border border-card-border rounded-xl p-1.5 shadow-dropdown z-50 animate-slide-up focus:outline-none">
              <DropdownMenu.Label className="px-2 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Select Active Project
              </DropdownMenu.Label>
              {projects.map(p => (
                <DropdownMenu.Item
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    p.id === activeProject.id
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold'
                      : 'text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate">{p.name}</span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface border border-border">
                    {p.healthScore}/100
                  </span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <span className="text-xs text-text-muted hidden md:inline-flex items-center gap-1.5">
          <span>Last updated:</span>
          <span className="font-mono text-text-secondary">{activeProject.lastUpdated}</span>
        </span>
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-2.5">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-muted hover:text-text-primary text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-brand-500" />
          <span className="hidden sm:inline">Global Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-surface border border-border rounded text-text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Add Update Button */}
        <button
          onClick={() => setIsAddUpdateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Update</span>
        </button>

        {/* Ask AI Chat Button */}
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-500/30 bg-brand-50 dark:bg-brand-50/10 text-brand-600 dark:text-brand-500 hover:bg-brand-100 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-critical" />
        </button>

        {/* Layout Density Toggle */}
        <button
          onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
          className="p-2 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
          title={`Density mode: ${density}. Click to toggle.`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Theme Switcher Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors focus:outline-none">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-brand-500" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-status-warning" />
              ) : (
                <Laptop className="w-4 h-4 text-brand-500" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-36 bg-surface border border-card-border rounded-xl p-1 shadow-dropdown z-50 animate-slide-up focus:outline-none">
              <DropdownMenu.Item
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  theme === 'light' ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-status-warning" />
                <span>Light</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  theme === 'dark' ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-brand-500" />
                <span>Dark</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  theme === 'system' ? 'bg-brand-50 text-brand-600 dark:bg-brand-50/20 dark:text-brand-500 font-semibold' : 'text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-text-muted" />
                <span>System</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, AlertTriangle, CheckSquare, Clock, ArrowUpRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const KpiTiles: React.FC = () => {
  const { activeProject } = useProject();

  const tiles = [
    {
      label: 'Overall Health',
      value: `${activeProject.healthScore}/100`,
      sub: activeProject.healthLabel,
      color: 'text-brand-500',
      bg: 'bg-brand-50/50 dark:bg-brand-50/10 border-brand-500/20',
      icon: Activity,
      path: '/health'
    },
    {
      label: 'Open Risks',
      value: activeProject.openRisksCount,
      sub: '2 High Severity',
      color: 'text-status-critical',
      bg: 'bg-status-criticalBg border-status-critical/20',
      icon: ShieldAlert,
      path: '/risks'
    },
    {
      label: 'Active Blockers',
      value: activeProject.blockersCount,
      sub: '1 Overdue Item',
      color: 'text-status-warning',
      bg: 'bg-status-warningBg border-status-warning/20',
      icon: AlertTriangle,
      path: '/blockers'
    },
    {
      label: 'Action Items',
      value: activeProject.actionItemsCount,
      sub: '12 Total Items',
      color: 'text-status-info',
      bg: 'bg-status-infoBg border-status-info/20',
      icon: CheckSquare,
      path: '/blockers'
    },
    {
      label: 'Next Milestone',
      value: `${activeProject.daysToMilestone} Days`,
      sub: activeProject.nextMilestoneName,
      color: 'text-text-primary',
      bg: 'bg-surface-hover/50 border-border',
      icon: Clock,
      path: '/scope'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {tiles.map((tile, i) => {
        const Icon = tile.icon;
        return (
          <Link
            key={i}
            to={tile.path}
            className={`p-4 rounded-xl border ${tile.bg} hover:scale-[1.02] transition-all group flex flex-col justify-between shadow-xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-muted">{tile.label}</span>
              <div className="p-1.5 rounded-lg bg-surface border border-border group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-white" />
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${tile.color}`}>
                {tile.value}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-text-secondary truncate">{tile.sub}</span>
                <ArrowUpRight className="w-3 h-3 text-text-muted group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

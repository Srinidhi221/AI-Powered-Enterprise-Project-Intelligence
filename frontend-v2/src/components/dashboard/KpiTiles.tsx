import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const KpiTiles: React.FC = () => {
  const { activeProject } = useProject();

  const tiles = [
    {
      label: 'Overall Health',
      value: `${activeProject.healthScore}/100`,
      sub: activeProject.healthLabel,
      color: 'text-brand-500',
      path: '/health'
    },
    {
      label: 'Open Risks',
      value: activeProject.openRisksCount,
      sub: '2 High Severity',
      color: 'text-status-critical',
      path: '/risks'
    },
    {
      label: 'Active Blockers',
      value: activeProject.blockersCount,
      sub: '1 Overdue Item',
      color: 'text-status-warning',
      path: '/blockers'
    },
    {
      label: 'Action Items',
      value: activeProject.actionItemsCount,
      sub: '12 Total Items',
      color: 'text-status-info',
      path: '/blockers'
    },
    {
      label: 'Next Milestone',
      value: `${activeProject.daysToMilestone} Days`,
      sub: activeProject.nextMilestoneName,
      color: 'text-text-primary',
      path: '/scope'
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-b border-border text-xs">
      {tiles.map((tile, i) => (
        <React.Fragment key={i}>
          <Link to={tile.path} className="flex-1 min-w-[140px] group hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{tile.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-500 transition-colors" />
            </div>
            <span className={`text-4xl font-extrabold font-mono tracking-tight block mt-2.5 ${tile.color}`}>
              {tile.value}
            </span>
            <span className="text-xs text-text-secondary truncate block mt-1 font-medium">{tile.sub}</span>
          </Link>
          {i < tiles.length - 1 && <div className="h-14 w-px bg-border hidden lg:block" />}
        </React.Fragment>
      ))}
    </div>
  );
};

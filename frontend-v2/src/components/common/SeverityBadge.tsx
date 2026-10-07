import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface SeverityBadgeProps {
  level: 'High' | 'Medium' | 'Low' | 'Critical' | 'Healthy' | 'Needs Attention' | 'At Risk';
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ level, showIcon = true, size = 'sm' }) => {
  const getStyles = () => {
    switch (level) {
      case 'Critical':
      case 'High':
      case 'At Risk':
        return {
          bg: 'bg-status-criticalBg text-status-critical border-status-critical/30',
          icon: <ShieldAlert className="w-3 h-3 text-status-critical" />
        };
      case 'Medium':
      case 'Needs Attention':
        return {
          bg: 'bg-status-warningBg text-status-warning border-status-warning/30',
          icon: <AlertTriangle className="w-3 h-3 text-status-warning" />
        };
      case 'Low':
      case 'Healthy':
        return {
          bg: 'bg-status-healthyBg text-status-healthy border-status-healthy/30',
          icon: <CheckCircle2 className="w-3 h-3 text-status-healthy" />
        };
      default:
        return {
          bg: 'bg-status-infoBg text-status-info border-status-info/30',
          icon: <Info className="w-3 h-3 text-status-info" />
        };
    }
  };

  const { bg, icon } = getStyles();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${bg} ${padding}`}>
      {showIcon && icon}
      <span>{level}</span>
    </span>
  );
};

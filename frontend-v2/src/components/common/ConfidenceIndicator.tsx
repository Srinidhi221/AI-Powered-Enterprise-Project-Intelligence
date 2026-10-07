import React from 'react';
import { Sparkles } from 'lucide-react';
import { ConfidenceLevel } from '../../types';

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence }) => {
  const getConfig = () => {
    switch (confidence) {
      case 'high':
        return { label: 'High Confidence', color: 'text-confidence-high bg-confidence-high/10 border-confidence-high/30' };
      case 'medium':
        return { label: 'Medium Confidence', color: 'text-confidence-medium bg-confidence-medium/10 border-confidence-medium/30' };
      case 'low':
        return { label: 'Needs Review', color: 'text-confidence-low bg-confidence-low/10 border-confidence-low/30' };
    }
  };

  const { label, color } = getConfig();

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${color}`}
      title={`AI Extraction Certainty: ${label}`}
    >
      <Sparkles className="w-2.5 h-2.5 shrink-0" />
      <span>{confidence.toUpperCase()} CONF</span>
    </span>
  );
};

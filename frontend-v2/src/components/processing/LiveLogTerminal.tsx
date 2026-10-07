import React, { useState } from 'react';
import { Terminal, Copy, Download, Pause, Play, Filter, AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { LogEvent } from '../../types';

interface LiveLogTerminalProps {
  logs: LogEvent[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const LiveLogTerminal: React.FC<LiveLogTerminalProps> = ({
  logs,
  isExpanded = true,
  onToggleExpand
}) => {
  const [filter, setFilter] = useState<'all' | 'agent' | 'warning' | 'error'>('all');
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filter === 'agent') return !!log.agent;
    if (filter === 'warning') return log.level === 'warning';
    if (filter === 'error') return log.level === 'error';
    return true;
  });

  const handleCopy = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.stage.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.stage.toUpperCase()}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline_log_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#0D1117] border border-gray-800 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-gray-800 text-gray-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <Terminal className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-gray-200">Run Analysis Live Pipeline Log</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse">
            STREAMING
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded border border-gray-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${filter === 'all' ? 'bg-brand-500 text-white font-semibold' : 'hover:text-gray-200'}`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('agent')}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${filter === 'agent' ? 'bg-brand-500 text-white font-semibold' : 'hover:text-gray-200'}`}
            >
              Agents
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${filter === 'warning' ? 'bg-yellow-500 text-black font-semibold' : 'hover:text-gray-200'}`}
            >
              Warnings
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => setIsAutoScrollPaused(!isAutoScrollPaused)}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title={isAutoScrollPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
          >
            {isAutoScrollPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title="Copy Log to Clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            title="Download Log File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 ml-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      {isExpanded && (
        <div className="p-4 max-h-72 overflow-y-auto space-y-1.5 leading-relaxed bg-[#0D1117] text-gray-300 select-text">
          {filteredLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-gray-900/50 p-1 rounded transition-colors">
              <span className="text-gray-500 shrink-0 select-none">{log.timestamp}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-gray-800 text-gray-400 border border-gray-700 shrink-0">
                {log.stage}
              </span>
              <span
                className={`flex-1 ${
                  log.level === 'warning'
                    ? 'text-yellow-400 font-semibold'
                    : log.level === 'error'
                    ? 'text-red-400 font-semibold'
                    : log.level === 'success'
                    ? 'text-emerald-400'
                    : 'text-gray-300'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

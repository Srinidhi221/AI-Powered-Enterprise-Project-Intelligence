import React, { useState } from 'react';
import { CheckSquare, AlertTriangle, HelpCircle, Columns, List, Edit3, User, Calendar, Sparkles } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { BlockerItem } from '../types';
import { ConfidenceIndicator } from '../components/common/ConfidenceIndicator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const BlockersActionItems: React.FC = () => {
  const { blockers, setBlockers } = useProject();
  const [activeTab, setActiveTab] = useState<'blocker' | 'decision' | 'action'>('blocker');
  const [viewStyle, setViewStyle] = useState<'board' | 'list'>('board');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredItems = blockers.filter(b => b.type === activeTab);
  const needsReviewItems = blockers.filter(b => b.isNeedsReview);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as 'todo' | 'in_progress' | 'done';

    setBlockers(prev =>
      prev.map(item => (item.id === draggableId ? { ...item, status: newStatus } : item))
    );
  };

  const handleUpdateItem = (id: string, updates: Partial<BlockerItem>) => {
    setBlockers(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Blockers & Action Items</h1>
          <p className="text-xs text-text-muted mt-1">
            Track unresolved issues, pending decisions, and assigned task items with Kanban drag-and-drop.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-card-border shadow-xs text-xs">
          <button
            onClick={() => setViewStyle('board')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              viewStyle === 'board' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Board View</span>
          </button>
          <button
            onClick={() => setViewStyle('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
              viewStyle === 'list' ? 'bg-brand-500 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Needs Review Queue Banner */}
      {needsReviewItems.length > 0 && (
        <div className="p-4 rounded-xl bg-status-warningBg border border-status-warning/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-status-warning shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-status-warning uppercase tracking-wider">
                Needs Your Review Queue ({needsReviewItems.length} Low Confidence Extraction)
              </h4>
              <p className="text-xs text-text-primary">
                Human-in-the-loop review needed for auto-extracted action items with low confidence rating.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('action')}
            className="px-3 py-1.5 rounded-lg bg-status-warning text-black text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Review Items
          </button>
        </div>
      )}

      {/* Item Type Tabs */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-medium">
        <button
          onClick={() => setActiveTab('blocker')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'blocker'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-status-critical" />
          <span>Active Blockers ({blockers.filter(b => b.type === 'blocker').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('decision')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'decision'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-status-warning" />
          <span>Pending Decisions ({blockers.filter(b => b.type === 'decision').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('action')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'action'
              ? 'border-brand-500 text-brand-500 font-bold'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-brand-500" />
          <span>Action Items List ({blockers.filter(b => b.type === 'action').length})</span>
        </button>
      </div>

      {/* Board View or List View */}
      {viewStyle === 'board' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['todo', 'in_progress', 'done'] as const).map(statusCol => {
              const colItems = filteredItems.filter(i => i.status === statusCol);
              const colTitle =
                statusCol === 'todo' ? 'To Do' : statusCol === 'in_progress' ? 'In Progress' : 'Completed';

              return (
                <div key={statusCol} className="p-4 rounded-2xl bg-surface border border-card-border shadow-card flex flex-col justify-between space-y-3 min-h-[400px]">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {colTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-border font-bold">
                      {colItems.length}
                    </span>
                  </div>

                  <Droppable droppableId={statusCol}>
                    {provided => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 flex-1 overflow-y-auto"
                      >
                        {colItems.map((item, idx) => (
                          <Draggable key={item.id} draggableId={item.id} index={idx}>
                            {providedDrag => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                className={`p-4 rounded-xl border bg-background space-y-2 hover:border-brand-500/50 transition-all shadow-xs ${
                                  item.isOverdue ? 'border-status-critical/50 bg-status-criticalBg/20' : 'border-border'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xs font-bold text-text-primary leading-snug">
                                    {item.title}
                                  </h4>
                                  {item.isOverdue && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-status-critical text-white font-bold shrink-0">
                                      OVERDUE
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/50">
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3 text-brand-500" />
                                    <strong className="text-text-secondary">{item.owner}</strong>
                                  </span>
                                  <span className="font-mono">{item.dueDate}</span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <ConfidenceIndicator confidence={item.confidence} />
                                  <button
                                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                                    className="p-1 rounded text-text-muted hover:text-text-primary"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        /* List View */
        <div className="p-6 rounded-2xl bg-surface border border-card-border shadow-card space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-hover/50 text-text-muted uppercase font-mono text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Source Meeting</th>
                  <th className="p-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-surface-hover/40">
                    <td className="p-3 font-bold text-text-primary">{item.title}</td>
                    <td className="p-3 font-mono">{item.owner}</td>
                    <td className="p-3 font-mono text-text-muted">{item.dueDate}</td>
                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={e => handleUpdateItem(item.id, { status: e.target.value as any })}
                        className="px-2 py-1 rounded bg-background border border-border text-[11px] font-mono text-text-primary focus:outline-none"
                      >
                        <option value="todo">TO DO</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="done">DONE</option>
                      </select>
                    </td>
                    <td className="p-3 font-mono text-text-muted">{item.sourceMeeting}</td>
                    <td className="p-3">
                      <ConfidenceIndicator confidence={item.confidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

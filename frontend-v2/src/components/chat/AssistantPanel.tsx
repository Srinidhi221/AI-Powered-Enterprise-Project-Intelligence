import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Copy,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { ChatMessage } from '../../types';
import { MOCK_CHAT_MESSAGES } from '../../services/mockData';
import { SourceCitationChip } from '../common/SourceCitationChip';

interface AssistantPanelProps {
  isFullPage?: boolean;
}

const STARTER_QUESTIONS = [
  'Are we on track for Milestone 3 delivery?',
  'What are our biggest high-severity risks?',
  'Who owns the integration testing phase?',
  'What decisions are currently pending?'
];

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ isFullPage = false }) => {
  const { isChatDrawerOpen, setIsChatDrawerOpen, activeProject, setRisks, setBlockers } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const [filterDoc, setFilterDoc] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isFullPage && !isChatDrawerOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate RAG grounded answer
    setTimeout(() => {
      let reply: ChatMessage;
      if (text.toLowerCase().includes('risk')) {
        reply = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: 'Based on uploaded SRS and Meeting notes, there are **7 identified risks** (2 High, 3 Medium, 2 Low). The top critical risk is **Unassigned Ownership for Integration Testing Suite** with an impact score of 16/25.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: [
            { docName: 'Meeting_Notes_Oct02.txt', passage: 'QA team bandwidth is locked until Oct 20. Ownership of load test suite remains unassigned.' }
          ],
          groundingInfo: 'Grounded in Meeting_Notes_Oct02.txt'
        };
      } else if (text.toLowerCase().includes('decision') || text.toLowerCase().includes('pending')) {
        reply = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: 'There is **1 pending architectural decision**:\n- **Health Score Weighting Allocation**: Deciding whether Scope Clarity should be weighted at 35% vs Timeline Risk at 40%.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: [
            { docName: 'SRS_Document_v2.pdf', passage: 'Pending decision: Weighting ratio suggested is Scope Clarity 35%, Timeline Risk 40%.' }
          ],
          groundingInfo: 'Grounded in SRS_Document_v2.pdf'
        };
      } else if (text.toLowerCase().includes('budget') || text.toLowerCase().includes('revenue')) {
        reply = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: 'Information regarding revenue/budget financial forecasts was **not found in your uploaded project documents**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNotFoundInDocs: true,
          groundingInfo: 'Search performed across 4 active documents (0 matches)'
        };
      } else {
        reply = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: `According to project specifications for **${activeProject.name}**, overall health score is **${activeProject.healthScore}/100**. Milestone 3 is currently in progress with 4 open blockers.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: [
            { docName: 'Progress_Update_Week3.pdf', passage: 'Overall project health score calculated at 68/100.' }
          ],
          groundingInfo: 'Grounded in Progress_Update_Week3.pdf'
        };
      }
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddToActionItems = (msg: ChatMessage) => {
    setBlockers(prev => [
      ...prev,
      {
        id: `blk-${Date.now()}`,
        type: 'action',
        title: `Action from Chat: ${msg.text.slice(0, 45)}...`,
        owner: 'Srinidhi V.',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'todo',
        sourceMeeting: 'RAG Assistant Chat',
        confidence: 'high',
        isOverdue: false,
        isUnassigned: false,
        isNeedsReview: false
      }
    ]);
  };

  const content = (
    <div className={`flex flex-col justify-between bg-surface border-l border-border h-full ${isFullPage ? 'rounded-2xl border' : 'w-screen max-w-md shadow-dropdown'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-hover/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-500 border border-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Conversational RAG Assistant</h3>
            <span className="text-[10px] text-brand-600 dark:text-brand-500 font-mono">GROUNDED Q&A ENGINE</span>
          </div>
        </div>
        {!isFullPage && (
          <button
            onClick={() => setIsChatDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scope Filter */}
      <div className="px-4 py-2 border-b border-border bg-background flex items-center justify-between text-xs">
        <span className="text-text-muted font-medium flex items-center gap-1">
          <Filter className="w-3 h-3 text-brand-500" />
          <span>Scope Filter:</span>
        </span>
        <select
          value={filterDoc}
          onChange={e => setFilterDoc(e.target.value)}
          className="bg-transparent text-text-secondary font-mono text-[11px] focus:outline-none cursor-pointer"
        >
          <option value="all">All 4 Documents</option>
          <option value="SRS_Document_v2.pdf">SRS Document</option>
          <option value="Architecture_Spec.docx">Architecture Spec</option>
          <option value="Meeting_Notes_Oct02.txt">Meeting Notes</option>
        </select>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-500 text-white rounded-br-none'
                  : 'bg-surface-hover border border-border text-text-primary rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/40 space-y-1">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                    Source Citations:
                  </span>
                  {msg.citations.map((c, i) => (
                    <SourceCitationChip key={i} docName={c.docName} passage={c.passage} />
                  ))}
                </div>
              )}

              {/* Not Found Warning */}
              {msg.isNotFoundInDocs && (
                <div className="mt-2 p-2 rounded-lg bg-status-warningBg border border-status-warning/30 text-status-warning text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Clear "not found in your documents" policy enforced.</span>
                </div>
              )}
            </div>

            {/* Grounding Info & Quick Actions */}
            <div className="flex items-center gap-2 text-[10px] text-text-muted px-1">
              <span>{msg.timestamp}</span>
              {msg.groundingInfo && (
                <>
                  <span>•</span>
                  <span className="font-mono">{msg.groundingInfo}</span>
                </>
              )}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => handleCopy(msg)}
                    className="hover:text-brand-500"
                    title="Copy response"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleAddToActionItems(msg)}
                    className="hover:text-brand-500 flex items-center gap-0.5"
                    title="Add as Action Item"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Action</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Starter Prompts */}
      <div className="p-3 border-t border-border bg-background space-y-1.5">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
          Suggested Starters
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STARTER_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-surface border border-border text-text-secondary hover:text-brand-500 hover:border-brand-500/50 text-[11px] transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-border bg-surface flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask anything grounded in your documents..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isFullPage) return content;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={() => setIsChatDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {content}
      </div>
    </div>
  );
};

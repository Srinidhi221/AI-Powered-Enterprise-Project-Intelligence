import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Copy,
  PlusCircle,
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
  const { isChatDrawerOpen, setIsChatDrawerOpen, activeProject, setBlockers } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const [filterDoc, setFilterDoc] = useState<string>('all');

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
    <div className={`flex flex-col justify-between h-full ${isFullPage ? 'w-full max-w-4xl mx-auto py-2' : 'w-screen max-w-md bg-surface border-l border-border shadow-dropdown'}`}>
      {/* Header */}
      <div className={`py-3 px-4 border-b border-border flex items-center justify-between ${isFullPage ? '' : 'bg-surface-hover/30'}`}>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <div>
            <h3 className="text-base font-bold text-text-primary">Conversational RAG Assistant</h3>
            <span className="text-[11px] text-text-muted font-mono">Grounded Q&A Engine • Grounded in 4 documents</span>
          </div>
        </div>
        {!isFullPage && (
          <button
            onClick={() => setIsChatDrawerOpen(false)}
            className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scope Filter */}
      <div className="py-2.5 px-4 border-b border-border flex items-center justify-between text-xs text-text-secondary">
        <span className="font-semibold flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-brand-500" />
          <span>Document Scope Filter:</span>
        </span>
        <select
          value={filterDoc}
          onChange={e => setFilterDoc(e.target.value)}
          className="bg-transparent text-text-primary font-mono text-xs focus:outline-none cursor-pointer"
        >
          <option value="all">All 4 Uploaded Documents</option>
          <option value="SRS_Document_v2.pdf">SRS_Document_v2.pdf</option>
          <option value="Architecture_Spec.docx">Architecture_Spec.docx</option>
          <option value="Meeting_Notes_Oct02.txt">Meeting_Notes_Oct02.txt</option>
        </select>
      </div>

      {/* Chat Messages List */}
      <div className="py-4 space-y-6 overflow-y-auto flex-1 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div
              className={`p-4 rounded-lg max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-500 text-white font-medium'
                  : 'bg-surface border border-border text-text-primary'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{msg.text}</p>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/40 space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    SOURCE EVIDENCE CITATIONS:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {msg.citations.map((c, i) => (
                      <SourceCitationChip key={i} docName={c.docName} passage={c.passage} />
                    ))}
                  </div>
                </div>
              )}

              {/* Not Found Warning */}
              {msg.isNotFoundInDocs && (
                <div className="mt-2 p-2 rounded bg-status-warningBg border border-status-warning/30 text-status-warning text-[11px] flex items-center gap-1.5 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>"Not found in your documents" policy enforced.</span>
                </div>
              )}
            </div>

            {/* Grounding Info & Quick Actions */}
            <div className="flex items-center gap-2 text-[11px] text-text-muted px-1">
              <span className="font-mono">{msg.timestamp}</span>
              {msg.groundingInfo && (
                <>
                  <span>•</span>
                  <span className="font-mono text-text-secondary">{msg.groundingInfo}</span>
                </>
              )}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-2 ml-2 font-medium">
                  <button
                    onClick={() => handleCopy(msg)}
                    className="hover:text-brand-500 text-text-secondary"
                  >
                    Copy
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleAddToActionItems(msg)}
                    className="hover:text-brand-500 text-brand-500 flex items-center gap-0.5"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Action Item</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Starters */}
      <div className="py-3 border-t border-border space-y-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
          SUGGESTED GROUNDED QUESTIONS
        </span>
        <div className="flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-md bg-surface border border-border text-text-secondary hover:text-brand-500 hover:border-brand-500 text-xs transition-colors text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask any question grounded in your uploaded project documents..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="w-full px-4 py-2.5 rounded-md bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
        />
        <button
          onClick={() => handleSend()}
          className="px-4 py-2.5 rounded-md bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );

  if (isFullPage) return content;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setIsChatDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {content}
      </div>
    </div>
  );
};

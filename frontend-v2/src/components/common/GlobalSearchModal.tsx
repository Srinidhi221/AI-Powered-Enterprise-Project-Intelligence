import React, { useState } from 'react';
import { Search, X, ShieldAlert, CheckSquare, FileText, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useProject } from '../../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, risks, blockers, deliverables, documents } = useProject();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredRisks = risks.filter(
    r => r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBlockers = blockers.filter(
    b => b.title.toLowerCase().includes(query.toLowerCase()) || b.owner.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDeliverables = deliverables.filter(
    d => d.name.toLowerCase().includes(query.toLowerCase()) || d.owner.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter(
    d => d.name.toLowerCase().includes(query.toLowerCase()) || d.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setIsSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <Dialog.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-surface border border-border rounded-xl shadow-dropdown z-50 overflow-hidden animate-slide-up focus:outline-none">
          {/* Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-border bg-surface-hover/30 gap-3">
            <Search className="w-5 h-5 text-brand-500 shrink-0" />
            <input
              type="text"
              placeholder="Search risks, tasks, deliverables, documents..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-background rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!query ? (
              <div className="text-center py-8 text-text-muted text-xs space-y-1">
                <p className="font-medium text-text-secondary">Type to search project intelligence</p>
                <p>Search across 7 risks, 4 blockers, 5 deliverables and 4 uploaded documents</p>
              </div>
            ) : (
              <>
                {/* Risks */}
                {filteredRisks.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2">Risks</span>
                    <div className="mt-1 space-y-1">
                      {filteredRisks.slice(0, 3).map(risk => (
                        <button
                          key={risk.id}
                          onClick={() => handleSelect('/risks')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover text-left transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-status-critical shrink-0" />
                            <span className="text-xs font-medium text-text-primary group-hover:text-brand-500">
                              {risk.title}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blockers */}
                {filteredBlockers.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2">Blockers & Actions</span>
                    <div className="mt-1 space-y-1">
                      {filteredBlockers.slice(0, 3).map(blk => (
                        <button
                          key={blk.id}
                          onClick={() => handleSelect('/blockers')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover text-left transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckSquare className="w-4 h-4 text-status-warning shrink-0" />
                            <span className="text-xs font-medium text-text-primary group-hover:text-brand-500">
                              {blk.title} ({blk.owner})
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {filteredDeliverables.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2">Deliverables</span>
                    <div className="mt-1 space-y-1">
                      {filteredDeliverables.slice(0, 3).map(del => (
                        <button
                          key={del.id}
                          onClick={() => handleSelect('/scope')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover text-left transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                            <span className="text-xs font-medium text-text-primary group-hover:text-brand-500">
                              {del.name}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {filteredDocs.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2">Document Library</span>
                    <div className="mt-1 space-y-1">
                      {filteredDocs.slice(0, 3).map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => handleSelect('/documents')}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-hover text-left transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-status-info shrink-0" />
                            <span className="text-xs font-mono text-text-primary group-hover:text-brand-500">
                              {doc.name}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredRisks.length === 0 && filteredBlockers.length === 0 && filteredDeliverables.length === 0 && filteredDocs.length === 0 && (
                  <div className="text-center py-6 text-text-muted text-xs">
                    No matching results found for "{query}"
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

import React, { useState } from 'react';
import { FileText, ExternalLink, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface SourceCitationChipProps {
  docName: string;
  passage?: string;
  className?: string;
}

export const SourceCitationChip: React.FC<SourceCitationChipProps> = ({ docName, passage, className = '' }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-surface-hover text-text-secondary hover:text-brand-500 hover:bg-brand-50 transition-colors border border-border ${className}`}
          title="Click to view source document passage"
        >
          <FileText className="w-3 h-3 text-brand-500 shrink-0" />
          <span className="truncate max-w-[140px]">{docName}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-card-border rounded-xl p-6 shadow-dropdown z-50 animate-slide-up focus:outline-none">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              <Dialog.Title className="text-base font-semibold text-text-primary">
                Source Document Reference
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Document Name</span>
              <p className="text-sm font-mono font-medium text-brand-600 dark:text-brand-500 mt-0.5">{docName}</p>
            </div>

            <div>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Extracted Passage</span>
              <div className="mt-1.5 p-3 rounded-lg bg-background border border-border font-mono text-xs text-text-secondary leading-relaxed max-h-48 overflow-y-auto">
                {passage || 'Standard extraction passage from uploaded project file.'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg bg-surface-hover text-text-primary text-xs font-medium hover:bg-surface-active transition-colors">
                  Close Preview
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

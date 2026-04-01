import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed lg:relative z-40 top-0 left-0 h-full w-72 bg-card border-r border-border flex flex-col transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Conversations</h2>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onNew}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 lg:hidden" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => { onSelect(conv.id); onClose(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group',
                    activeId === conv.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                  <span className="truncate flex-1">{conv.title || 'New Chat'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {conversations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat!</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

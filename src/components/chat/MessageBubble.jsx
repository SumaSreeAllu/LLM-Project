import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import ConfidenceBadge from './ConfidenceBadge';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2 w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'bg-primary text-primary-foreground rounded-br-sm'
          : 'bg-card border border-border rounded-bl-sm'
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <ReactMarkdown
              className="prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>
                  ) : (
                    <pre className="bg-muted rounded p-2 overflow-x-auto my-1">
                      <code className="text-xs font-mono">{children}</code>
                    </pre>
                  ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.confidence != null && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <ConfidenceBadge confidence={message.confidence} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Zap } from 'lucide-react';

const suggestions = [
  "Latest AI news?",
  "What is quantum computing?",
  "React vs Vue 2026",
  "How does HTTPS work?",
];

export default function EmptyState({ onSuggestion }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center space-y-2">
        <Zap className="w-8 h-8 text-primary mx-auto" />
        <h2 className="font-semibold text-lg">Ask anything</h2>
        <p className="text-muted-foreground text-sm">Short, accurate answers with web search & memory.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

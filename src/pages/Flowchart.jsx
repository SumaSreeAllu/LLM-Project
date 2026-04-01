import React from 'react';

const Arrow = ({ direction = 'down', label }) => {
  if (direction === 'down') return (
    <div className="flex flex-col items-center my-1">
      {label && <span className="text-xs text-muted-foreground mb-1">{label}</span>}
      <div className="w-0.5 h-6 bg-border" />
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-border" style={{ borderTopWidth: 8 }} />
    </div>
  );
  if (direction === 'right') return (
    <div className="flex items-center mx-2">
      {label && <span className="text-xs text-muted-foreground mr-1">{label}</span>}
      <div className="h-0.5 w-8 bg-border" />
      <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-border" />
    </div>
  );
};

const Node = ({ label, sublabel, color = 'bg-card', textColor = 'text-foreground', icon, borderColor = 'border-border', shape = 'rect', className = '' }) => {
  const base = `border ${borderColor} ${color} ${textColor} px-4 py-2.5 shadow-sm flex flex-col items-center justify-center text-center min-w-[140px] ${className}`;
  const rounded = shape === 'diamond' ? 'rotate-45' : shape === 'rounded' ? 'rounded-2xl' : 'rounded-xl';

  if (shape === 'diamond') {
    return (
      <div className="flex items-center justify-center my-1">
        <div className={`${base} rounded-lg w-32 h-16 rotate-45 flex items-center justify-center`}>
          <div className="-rotate-45 text-xs font-medium leading-tight">{label}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} ${rounded}`}>
      {icon && <span className="text-lg mb-1">{icon}</span>}
      <span className="text-xs font-semibold leading-tight">{label}</span>
      {sublabel && <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{sublabel}</span>}
    </div>
  );
};

const Section = ({ title, children, accent }) => (
  <div className={`rounded-2xl border ${accent} bg-card/60 p-5 flex flex-col items-center gap-1`}>
    <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${accent.replace('border-', 'text-').replace('/30', '')}`}>{title}</div>
    {children}
  </div>
);

export default function Flowchart() {
  return (
    <div className="min-h-screen bg-background p-6 overflow-auto">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-foreground">Smart Chat — Project Flowchart</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete architecture & user flow</p>
        </div>

        {/* Top-level: User Entry */}
        <div className="flex flex-col items-center gap-0">

          {/* USER */}
          <Node label="User Opens App" icon="👤" color="bg-primary/10" borderColor="border-primary/40" textColor="text-primary" shape="rounded" className="w-48" />
          <Arrow />

          {/* AUTH */}
          <Node label="Auth Check" sublabel="AuthProvider / Base44" icon="🔒" color="bg-secondary" borderColor="border-border" shape="rounded" className="w-48" />
          <Arrow />

          {/* MAIN LAYOUT */}
          <div className="w-full rounded-2xl border border-border bg-muted/30 p-6 mt-1">
            <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">pages/Chat.jsx — Main Layout</div>

            <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">

              {/* SIDEBAR */}
              <Section title="Sidebar" accent="border-blue-400/30">
                <Node label="ConversationList" sublabel="components/chat" icon="💬" color="bg-blue-50 dark:bg-blue-950/30" borderColor="border-blue-300/50" className="w-44" />
                <Arrow />
                <Node label="Select / New / Delete" sublabel="Conversation" color="bg-card" borderColor="border-border" className="w-44" />
                <Arrow />
                <Node label="Base44 Entity" sublabel="Conversation.list()" color="bg-blue-100/50 dark:bg-blue-900/20" borderColor="border-blue-300/30" className="w-44" />
              </Section>

              {/* CENTER: CHAT FLOW */}
              <div className="flex flex-col items-center gap-0 flex-1">
                <Section title="Message Area" accent="border-orange-400/30">
                  <div className="flex gap-4 items-start">

                    {/* Empty State */}
                    <div className="flex flex-col items-center gap-1">
                      <Node label="EmptyState" sublabel="No messages yet" icon="✨" color="bg-orange-50 dark:bg-orange-950/20" borderColor="border-orange-300/40" className="w-36" />
                      <div className="text-[10px] text-muted-foreground">Suggestion prompts</div>
                    </div>

                    <Arrow direction="right" label="or" />

                    {/* Messages */}
                    <div className="flex flex-col items-center gap-1">
                      <Node label="MessageBubble" sublabel="User / Assistant" icon="💬" color="bg-orange-50 dark:bg-orange-950/20" borderColor="border-orange-300/40" className="w-36" />
                      <Arrow />
                      <Node label="ConfidenceBadge" sublabel="Score 0–100" icon="📊" color="bg-card" borderColor="border-border" className="w-36" />
                      <Arrow />
                      <Node label="TypingIndicator" sublabel="Loading state" icon="⏳" color="bg-card" borderColor="border-border" className="w-36" />
                    </div>
                  </div>
                </Section>

                <Arrow />

                {/* INPUT */}
                <Section title="Chat Input" accent="border-green-400/30">
                  <Node label="ChatInput.jsx" sublabel="components/chat" icon="⌨️" color="bg-green-50 dark:bg-green-950/20" borderColor="border-green-300/40" className="w-52" />
                  <Arrow />
                  <div className="flex gap-3 items-center">
                    <Node label="Text Input" icon="✏️" color="bg-card" borderColor="border-border" className="w-28" />
                    <Node label="File Upload" sublabel="img, pdf, txt…" icon="📎" color="bg-card" borderColor="border-border" className="w-28" />
                    <Node label="Link Attach" icon="🔗" color="bg-card" borderColor="border-border" className="w-28" />
                  </div>
                  <Arrow />
                  <Node label="Validate File Type" sublabel="SUPPORTED_TYPES filter" icon="✅" color="bg-green-100/50 dark:bg-green-900/20" borderColor="border-green-300/40" className="w-52" />
                  <Arrow />
                  <Node label="UploadFile Integration" sublabel="Base44 Core" icon="☁️" color="bg-card" borderColor="border-border" className="w-52" />
                </Section>

                <Arrow />

                {/* SEND MESSAGE FLOW */}
                <Section title="sendMessage() — pages/Chat.jsx" accent="border-purple-400/30">
                  <Node label="Auto-create Conversation" sublabel="if none active" icon="🆕" color="bg-purple-50 dark:bg-purple-950/20" borderColor="border-purple-300/40" className="w-60" />
                  <Arrow />
                  <Node label="Add User Message" sublabel="Optimistic update" icon="📨" color="bg-purple-50 dark:bg-purple-950/20" borderColor="border-purple-300/40" className="w-60" />
                  <Arrow />
                  <Node label="Build History Prompt" sublabel="All prior messages" icon="🧠" color="bg-purple-50 dark:bg-purple-950/20" borderColor="border-purple-300/40" className="w-60" />
                  <Arrow />
                  <Node label="InvokeLLM" sublabel="add_context_from_internet + file_urls" icon="🤖" color="bg-purple-100/60 dark:bg-purple-900/30" borderColor="border-purple-400/50" className="w-60" />
                  <Arrow />
                  <Node label="Parse Response" sublabel="answer · confidence · sources" icon="📋" color="bg-purple-50 dark:bg-purple-950/20" borderColor="border-purple-300/40" className="w-60" />
                  <Arrow />
                  <Node label="Save to Conversation" sublabel="Conversation.update()" icon="💾" color="bg-purple-50 dark:bg-purple-950/20" borderColor="border-purple-300/40" className="w-60" />
                </Section>
              </div>

              {/* DATABASE */}
              <Section title="Database" accent="border-slate-400/30">
                <Node label="Conversation Entity" sublabel="Base44 DB" icon="🗄️" color="bg-slate-100 dark:bg-slate-800/40" borderColor="border-slate-300/50" className="w-44" />
                <Arrow />
                <Node label="title" color="bg-card" borderColor="border-border" className="w-44" />
                <Node label="messages[ ]" sublabel="role · content · confidence · sources · timestamp" color="bg-card" borderColor="border-border" className="w-44 mt-1" />
                <Arrow />
                <Node label="React Query Cache" sublabel="invalidateQueries" color="bg-slate-100 dark:bg-slate-800/30" borderColor="border-slate-300/30" className="w-44" />
              </Section>

            </div>
          </div>

          <Arrow />

          {/* OUTPUT */}
          <Node label="Updated UI Rendered" icon="🖥️" color="bg-primary/10" borderColor="border-primary/40" textColor="text-primary" shape="rounded" className="w-48" />

        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          {[
            { color: 'bg-primary/10 border-primary/40 text-primary', label: 'Entry / Output' },
            { color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-300/50', label: 'Sidebar / Navigation' },
            { color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-300/40', label: 'Message Display' },
            { color: 'bg-green-50 dark:bg-green-950/20 border-green-300/40', label: 'Input & Upload' },
            { color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-300/40', label: 'AI Processing' },
            { color: 'bg-slate-100 dark:bg-slate-800/40 border-slate-300/50', label: 'Database / Cache' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

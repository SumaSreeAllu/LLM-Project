import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import EmptyState from '../components/chat/EmptyState';
import TypingIndicator from '../components/chat/TypingIndicator';

export default function Chat() {
  const [activeConvId, setActiveConvId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch all conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-updated_date'),
  });

  // Active conversation
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = activeConv?.messages || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  // Create new conversation
  const createConv = async () => {
    const conv = await base44.entities.Conversation.create({
      title: 'New Chat',
      messages: [],
    });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    setActiveConvId(conv.id);
    setSidebarOpen(false);
  };

  // Delete conversation
  const deleteConv = async (id) => {
    await base44.entities.Conversation.delete(id);
    if (activeConvId === id) setActiveConvId(null);
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  // Send message
  const sendMessage = async (text, fileUrls = []) => {
    let convId = activeConvId;
    let currentMessages = [...messages];

    // Auto-create conversation if none active
    if (!convId) {
      const conv = await base44.entities.Conversation.create({
        title: text.slice(0, 60),
        messages: [],
      });
      convId = conv.id;
      setActiveConvId(conv.id);
      currentMessages = [];
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }

    // Add user message
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...currentMessages, userMsg];

    // Optimistic update
    await base44.entities.Conversation.update(convId, { messages: updatedMessages });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });

    setIsLoading(true);

    // Build conversation history for context/memory
    const historyPrompt = updatedMessages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const systemPrompt = `You are a friendly, conversational AI assistant — like a knowledgeable friend. You have access to web search for current information.

CONVERSATION HISTORY (your memory — every message is stored, use ALL of it):
${historyPrompt}

INSTRUCTIONS:
1. For greetings like "hi", "hello", "hey" — respond warmly and naturally (e.g. "Hi! How are you? What can I help you with today?").
2. Match the tone of the user — casual if they're casual, detailed if they ask something technical.
3. Answer questions accurately using web search context and conversation history.
4. CRITICAL: If the user refers back to anything from earlier in the conversation (e.g. "what was that thing you said?", "explain that more", "go back to X"), look through the full conversation history above and answer based on it. Never say you don't remember — you have the full history.
5. If the user's question is vague or seems to reference a previous topic, infer from the conversation history what they mean.
6. Never give inappropriate, offensive, or out-of-context replies.
7. Use markdown formatting for readability when helpful.
8. Rate your confidence honestly from 0-100 based on how certain you are. For simple facts: 85-95. For opinions/predictions: 60-80. For unclear or ambiguous questions: 40-65. For well-known facts: 90-100. VARY the score realistically — never always give 95 or 100. Rate based on the actual difficulty and certainty of the answer.

Respond ONLY with valid JSON matching the schema.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: systemPrompt,
      add_context_from_internet: true,
      ...(fileUrls.length > 0 && { file_urls: fileUrls }),
      response_json_schema: {
        type: 'object',
        properties: {
          answer: { type: 'string', description: 'The answer in markdown' },
          confidence: { type: 'number', description: 'Confidence score 0-100' },
          sources: { type: 'array', items: { type: 'string' }, description: 'Source topics' },
        },
        required: ['answer', 'confidence'],
      },
    });

    const assistantMsg = {
      role: 'assistant',
      content: res.answer,
      confidence: Math.round(res.confidence),
      sources: res.sources || [],
      timestamp: new Date().toISOString(),
    };

    const finalMessages = [...updatedMessages, assistantMsg];

    // Update title on first message
    const titleUpdate = currentMessages.length === 0 ? { title: text.slice(0, 60) } : {};

    await base44.entities.Conversation.update(convId, {
      messages: finalMessages,
      ...titleUpdate,
    });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ConversationList
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={createConv}
        onDelete={deleteConv}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold text-sm truncate">
            {activeConv?.title || 'Smart Chat'}
          </h1>
          {activeConv && messages.length > 0 && (
            <span className="text-[11px] text-muted-foreground ml-auto">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          )}
        </header>

        {/* Messages or Empty State */}
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSuggestion={sendMessage} />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

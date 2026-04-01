import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip, X, Image, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]); // {type: 'file'|'link', url, name}
  const [linkInput, setLinkInput] = useState('');
  const [showLinkBox, setShowLinkBox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if ((!trimmed && attachments.length === 0) || isLoading) return;

    // Build message with attachments info
    let fullText = trimmed;
    if (attachments.length > 0) {
      const attachInfo = attachments.map(a =>
        a.type === 'link' ? `[Link: ${a.url}]` : `[File: ${a.name}]`
      ).join(' ');
      fullText = trimmed ? `${trimmed}\n\n${attachInfo}` : attachInfo;
    }

    onSend(fullText, attachments.map(a => a.url));
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const unsupported = files.filter(f => !SUPPORTED_TYPES.includes(f.type));
    if (unsupported.length > 0) {
      alert(`Unsupported file type(s): ${unsupported.map(f => f.name).join(', ')}\n\nSupported: images, PDF, TXT, CSV, XLSX, DOCX`);
      e.target.value = '';
      return;
    }
    setUploading(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAttachments(prev => [...prev, { type: 'file', url: file_url, name: file.name }]);
    }
    setUploading(false);
    e.target.value = '';
  };

  const addLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    setAttachments(prev => [...prev, { type: 'link', url, name: url }]);
    setLinkInput('');
    setShowLinkBox(false);
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border-t border-border p-3">
      <div className="max-w-2xl mx-auto space-y-2">

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1 text-xs text-foreground max-w-[200px]">
                {a.type === 'link' ? <Link className="w-3 h-3 shrink-0" /> : <Image className="w-3 h-3 shrink-0" />}
                <span className="truncate">{a.name}</span>
                <button onClick={() => removeAttachment(i)} className="shrink-0 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Link input box */}
        {showLinkBox && (
          <div className="flex gap-2">
            <input
              autoFocus
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLink()}
              placeholder="Paste a URL..."
              className="flex-1 text-sm rounded-lg border border-border bg-background px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Button size="sm" onClick={addLink}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowLinkBox(false)}><X className="w-3 h-3" /></Button>
          </div>
        )}

        {/* Main input row */}
        <div className="flex items-end gap-2">
          {/* Attach file */}
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.csv,.xlsx,.docx" className="hidden" onChange={handleFileChange} />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-xl shrink-0 text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Attach file or image"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </Button>

          {/* Link button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-xl shrink-0 text-muted-foreground"
            onClick={() => setShowLinkBox(v => !v)}
            title="Add a link"
          >
            <Link className="w-4 h-4" />
          </Button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, paste a link, attach a file..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              placeholder:text-muted-foreground/40 transition-all"
          />
          <Button
            onClick={handleSubmit}
            disabled={(!text.trim() && attachments.length === 0) || isLoading}
            size="icon"
            className="h-10 w-10 rounded-xl shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

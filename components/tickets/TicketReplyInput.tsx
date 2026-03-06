"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";

interface TicketReplyInputProps {
  onSend: (message: string, attachments: { url: string; name: string; size: number; mimeType: string }[]) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  accessToken?: string | null;
}

export function TicketReplyInput({ onSend, disabled, placeholder = "Type your reply..." }: TicketReplyInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{ url: string; name: string; size: number; mimeType: string }[]>([]);

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending || disabled) return;
    setSending(true);
    try {
      await onSend(trimmed, attachments);
      setMessage("");
      setAttachments([]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-xl border border-white/10 p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className="w-full resize-none rounded-lg px-3 py-2 text-sm text-snow placeholder:text-slate outline-none bg-white/[0.04] border border-white/10 disabled:opacity-50"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files?.length) return;
              for (let i = 0; i < Math.min(files.length, 5 - attachments.length); i++) {
                const file = files[i];
                if (file.size > 10 * 1024 * 1024) continue;
                const formData = new FormData();
                formData.append("file", file);
                const token = accessToken || "";
                const res = await fetch("/api/upload", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                });
                const d = await res.json();
                if (d.file) setAttachments((a) => [...a, { url: d.file.url, name: d.file.name, size: d.file.size, mimeType: d.file.mimeType }]);
              }
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || attachments.length >= 5}
            className="p-2 rounded-lg text-slate hover:text-snow hover:bg-white/5 disabled:opacity-50"
          >
            <Paperclip size={16} />
          </button>
          {attachments.length > 0 && (
            <span className="text-xs text-slate">{attachments.length} file(s)</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || sending || disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6366F1,#7C3AED)" }}
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Send
        </button>
      </div>
    </div>
  );
}

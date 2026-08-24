"use client";

import { useState } from "react";
import { IconSend } from "@tabler/icons-react";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function MessageInput({ onSend }: { onSend: (content: string) => void }) {
  const [value, setValue] = useState("");
  const { dict } = useClientLanguage();

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-3 border-t border-white/10 p-4">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={dict.messaging.inputPlaceholder}
        className="max-h-32 flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label={dict.messaging.sendAriaLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple to-purple-light text-white transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconSend size={17} />
      </button>
    </div>
  );
}

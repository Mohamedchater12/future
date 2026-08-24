"use client";

import { useEffect, useRef, useState } from "react";
import { IconSend } from "@tabler/icons-react";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { messagerieTranslations } from "@/lib/i18n/admin/messagerie";
import type { Message } from "@prisma/client";

export default function AdminChatWindow({
  clientName,
  messages,
  onSend,
}: {
  clientName: string;
  messages: Message[];
  onSend: (content: string) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = messagerieTranslations[lang];
  const [value, setValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

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
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-semibold text-white">{clientName}</p>
        <p className="text-xs text-base-gray">{dict.chatWindow.clientConversation}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-base-gray">{dict.chatWindow.noMessages}</p>
        ) : (
          messages.map((message) => {
            const isAdmin = message.sender === "ADMIN";
            return (
              <div key={message.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isAdmin ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={
                      isAdmin
                        ? "rounded-2xl rounded-br-sm bg-gradient-to-r from-purple to-purple-light px-4 py-2.5 text-sm text-white"
                        : "rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white"
                    }
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-base-gray">
                    {formatRelativeTime(new Date(message.createdAt), lang)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-3 border-t border-white/10 p-4">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={dict.chatWindow.inputPlaceholder}
          className="max-h-32 flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          aria-label={dict.chatWindow.sendAriaLabel}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple to-purple-light text-white transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconSend size={17} />
        </button>
      </div>
    </div>
  );
}

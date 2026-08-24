"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "@/components/client-space/messagerie/MessageBubble";
import MessageInput from "@/components/client-space/messagerie/MessageInput";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { Message } from "@prisma/client";

export default function ChatWindow({
  messages,
  onSend,
}: {
  messages: Message[];
  onSend: (content: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { dict } = useClientLanguage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple/20 font-heading text-xs font-bold text-purple-light">
          F
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{dict.messaging.teamName}</p>
          <p className="text-xs text-base-gray">{dict.messaging.teamRole}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}

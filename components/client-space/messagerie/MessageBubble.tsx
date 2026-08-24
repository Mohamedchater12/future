"use client";

import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { Message } from "@prisma/client";

export default function MessageBubble({ message }: { message: Message }) {
  const { lang } = useClientLanguage();
  const isClient = message.sender === "CLIENT";

  return (
    <div className={`flex ${isClient ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isClient ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={
            isClient
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
}

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useClientMessages } from "@/lib/client-space/useClientMessages";
import { useClientSummary } from "@/lib/client-space/useClientSummary";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import ChatWindow from "@/components/client-space/messagerie/ChatWindow";

export default function MessageriePage() {
  const { messages, mutate } = useClientMessages();
  const { mutate: mutateSummary } = useClientSummary();
  const { dict } = useClientLanguage();

  useEffect(() => {
    fetch("/api/client/messages/mark-read", { method: "POST" }).then(() => mutateSummary());
    // Only once when the conversation is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend(content: string) {
    try {
      await fetch("/api/client/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      mutate();
    } catch {
      toast.error(dict.messaging.sendError);
    }
  }

  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0"
      >
        <h1 className="font-heading text-2xl font-bold text-white">{dict.messaging.title}</h1>
        <p className="mt-1 text-sm text-base-gray">{dict.messaging.subtitle}</p>
      </motion.div>

      <div className="mt-6 min-h-0 flex-1">
        <ChatWindow messages={messages} onSend={handleSend} />
      </div>
    </div>
  );
}

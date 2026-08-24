"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import ConversationList from "@/components/admin/messagerie/ConversationList";
import AdminChatWindow from "@/components/admin/messagerie/AdminChatWindow";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { messagerieTranslations } from "@/lib/i18n/admin/messagerie";
import type { ConversationSummary } from "@/types/admin";
import type { Message } from "@prisma/client";

export default function MessagesPageClient() {
  const { lang } = useAdminLanguage();
  const dict = messagerieTranslations[lang];
  const searchParams = useSearchParams();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: conversationsData, mutate: mutateConversations } = useSWR<{
    conversations: ConversationSummary[];
  }>("/api/admin/messages", fetcher, { refreshInterval: 15000 });
  const conversations = conversationsData?.conversations ?? [];

  useEffect(() => {
    const clientIdFromLink = searchParams.get("clientId");
    if (clientIdFromLink) {
      setSelectedClientId(clientIdFromLink);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedClientId && conversations.length > 0) {
      setSelectedClientId(conversations[0].client.id);
    }
  }, [conversations, selectedClientId]);

  const { data: messagesData, mutate: mutateMessages } = useSWR<{ messages: Message[] }>(
    selectedClientId ? `/api/admin/messages/${selectedClientId}` : null,
    fetcher,
    { refreshInterval: 8000 }
  );
  const messages = messagesData?.messages ?? [];

  useEffect(() => {
    if (!selectedClientId) return;
    fetch(`/api/admin/messages/${selectedClientId}/mark-read`, { method: "POST" }).then(() =>
      mutateConversations()
    );
    // Only when the selected conversation changes — not on every poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  const selectedClient = conversations.find((c) => c.client.id === selectedClientId)?.client;

  async function handleSend(content: string) {
    if (!selectedClientId) return;
    try {
      await fetch(`/api/admin/messages/${selectedClientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      mutateMessages();
      mutateConversations();
    } catch {
      toast.error(dict.errors.sendFailed);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-6 sm:p-8">
      <div className="shrink-0">
        <h1 className="font-heading text-2xl font-bold text-white">{dict.page.title}</h1>
        <p className="mt-1 text-sm text-base-gray">{dict.page.subtitle}</p>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10">
        <div className="w-72 shrink-0 overflow-hidden border-r border-white/10">
          <ConversationList
            conversations={conversations}
            selectedClientId={selectedClientId}
            onSelect={setSelectedClientId}
          />
        </div>

        <div className="min-w-0 flex-1">
          {selectedClient ? (
            <AdminChatWindow
              clientName={selectedClient.name}
              messages={messages}
              onSend={handleSend}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-base-gray">
              {dict.emptyState.selectConversation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

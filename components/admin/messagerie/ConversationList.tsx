"use client";

import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { messagerieTranslations } from "@/lib/i18n/admin/messagerie";
import type { ConversationSummary } from "@/types/admin";

export default function ConversationList({
  conversations,
  selectedClientId,
  onSelect,
}: {
  conversations: ConversationSummary[];
  selectedClientId: string | null;
  onSelect: (clientId: string) => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = messagerieTranslations[lang];

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-base-gray">
        {dict.conversationList.empty}
      </div>
    );
  }

  return (
    <ul className="h-full divide-y divide-white/5 overflow-y-auto">
      {conversations.map(({ client, lastMessage, unreadCount }) => (
        <li key={client.id}>
          <button
            type="button"
            onClick={() => onSelect(client.id)}
            className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
              selectedClientId === client.id ? "bg-purple/10" : "hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple/20 font-heading text-xs font-bold text-purple-light">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-white">{client.name}</p>
                {lastMessage && (
                  <span className="shrink-0 text-[11px] text-base-gray">
                    {formatRelativeTime(new Date(lastMessage.createdAt), lang)}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-base-gray">
                {lastMessage ? lastMessage.content : dict.conversationList.noMessagesYet}
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="mt-1 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-purple px-1.5 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

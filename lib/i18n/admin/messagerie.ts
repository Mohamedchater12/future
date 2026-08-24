import type { AdminLanguage } from "@/lib/i18n/admin/context";

export interface MessagerieDictionary {
  page: {
    title: string;
    subtitle: string;
  };
  conversationList: {
    empty: string;
    noMessagesYet: string;
  };
  chatWindow: {
    clientConversation: string;
    noMessages: string;
    inputPlaceholder: string;
    sendAriaLabel: string;
  };
  emptyState: {
    selectConversation: string;
  };
  errors: {
    sendFailed: string;
  };
}

export const messagerieTranslations: Record<AdminLanguage, MessagerieDictionary> = {
  en: {
    page: {
      title: "Messages",
      subtitle: "Chat directly with your portal clients.",
    },
    conversationList: {
      empty: "No client accounts yet. Conversations appear once a client creates a portal account.",
      noMessagesYet: "No messages yet",
    },
    chatWindow: {
      clientConversation: "Client conversation",
      noMessages: "No messages yet — say hello.",
      inputPlaceholder: "Write a message… (Enter to send)",
      sendAriaLabel: "Send message",
    },
    emptyState: {
      selectConversation: "Select a conversation to get started.",
    },
    errors: {
      sendFailed: "Unable to send this message",
    },
  },
  ar: {
    page: {
      title: "الرسائل",
      subtitle: "تواصل مباشرة مع عملاء منصتك.",
    },
    conversationList: {
      empty: "لا توجد حسابات عملاء حتى الآن. تظهر المحادثات بعد إنشاء العميل لحساب في البوابة.",
      noMessagesYet: "لا توجد رسائل حتى الآن",
    },
    chatWindow: {
      clientConversation: "محادثة مع العميل",
      noMessages: "لا توجد رسائل حتى الآن — ابدأ بالتحية.",
      inputPlaceholder: "اكتب رسالة… (اضغط Enter للإرسال)",
      sendAriaLabel: "إرسال الرسالة",
    },
    emptyState: {
      selectConversation: "اختر محادثة للبدء.",
    },
    errors: {
      sendFailed: "تعذر إرسال هذه الرسالة",
    },
  },
};

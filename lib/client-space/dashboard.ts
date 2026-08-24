import { prisma } from "@/lib/prisma";
import {
  clientSpaceTranslations,
  formatMessage,
  type ClientSpaceLanguage,
} from "@/lib/i18n/clientSpace/translations";
import type { Mission, MissionStep, MissionFile } from "@prisma/client";

export type ClientMissionWithRelations = Mission & {
  steps: MissionStep[];
  files: MissionFile[];
};

export async function getClientMissions(clientId: string) {
  return prisma.mission.findMany({
    where: { clientId },
    include: {
      steps: { orderBy: { order: "asc" } },
      files: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getClientReviews(clientId: string) {
  return prisma.avis.findMany({ where: { clientId }, orderBy: { createdAt: "desc" } });
}

export async function getClientMessages(clientId: string) {
  return prisma.message.findMany({ where: { clientId }, orderBy: { createdAt: "asc" } });
}

type NotificationDraft = {
  id: string;
  type: "mission" | "message" | "avis";
  message: string;
  date: Date;
  href: string;
};

export type ClientNotification = {
  id: string;
  type: "mission" | "message" | "avis";
  message: string;
  date: string;
  href: string;
  read: boolean;
};

export type ClientSummary = {
  counts: {
    enCours: number;
    terminees: number;
    unreadMessages: number;
    reviews: number;
  };
  notifications: ClientNotification[];
  unreadNotificationsCount: number;
};

const MISSION_STATUS_TEMPLATE: Record<string, keyof (typeof clientSpaceTranslations)["en"]["notifications"]> = {
  EN_ATTENTE: "missionPending",
  EN_COURS: "missionInProgress",
  TERMINE: "missionDone",
};

// Notifications are derived on the fly from Mission/Message/Avis rather than
// stored in a dedicated table — "read" = older than Client.notificationsSeenAt
// (updated via POST /api/client/notifications/mark-seen).
export async function getClientSummary(
  clientId: string,
  lang: ClientSpaceLanguage = "en"
): Promise<ClientSummary> {
  const dict = clientSpaceTranslations[lang].notifications;
  const [client, missions, messages, avis] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId }, select: { notificationsSeenAt: true } }),
    prisma.mission.findMany({ where: { clientId } }),
    prisma.message.findMany({ where: { clientId, sender: "ADMIN" } }),
    prisma.avis.findMany({ where: { clientId } }),
  ]);

  const enCours = missions.filter((m) => m.status === "EN_COURS").length;
  const terminees = missions.filter((m) => m.status === "TERMINE").length;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const drafts: NotificationDraft[] = [];

  for (const mission of missions) {
    drafts.push({
      id: `mission-${mission.id}`,
      type: "mission",
      message: formatMessage(dict[MISSION_STATUS_TEMPLATE[mission.status]], {
        title: mission.title,
      }),
      date: mission.updatedAt,
      href: "/espace-client/demandes",
    });
  }

  for (const message of messages.filter((m) => !m.read)) {
    drafts.push({
      id: `message-${message.id}`,
      type: "message",
      message: dict.newMessage,
      date: message.createdAt,
      href: "/espace-client/messagerie",
    });
  }

  for (const review of avis.filter((a) => a.status !== "EN_ATTENTE")) {
    drafts.push({
      id: `avis-${review.id}`,
      type: "avis",
      message: review.status === "PUBLIE" ? dict.reviewPublished : dict.reviewRejected,
      date: review.updatedAt,
      href: "/espace-client/avis",
    });
  }

  const seenAt = client?.notificationsSeenAt ?? null;
  const notifications = drafts
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)
    .map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      date: n.date.toISOString(),
      href: n.href,
      read: seenAt ? n.date <= seenAt : false,
    }));

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return {
    counts: {
      enCours,
      terminees,
      unreadMessages: unreadMessagesCount,
      reviews: avis.length,
    },
    notifications,
    unreadNotificationsCount,
  };
}

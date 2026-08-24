import type { Demande, Client, Mission, MissionStep, MissionFile, Message, Avis } from "@prisma/client";

export type DemandeWithClient = Demande & {
  client: Pick<Client, "id" | "name"> | null;
};

export type AvisWithClient = Avis & {
  client: Pick<Client, "id" | "name"> | null;
};

export type MissionWithRelations = Mission & {
  client: Pick<Client, "id" | "name" | "company">;
  steps: MissionStep[];
  files: MissionFile[];
};

export type ConversationSummary = {
  client: Pick<Client, "id" | "name" | "company" | "email">;
  lastMessage: Message | null;
  unreadCount: number;
};

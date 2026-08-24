import { prisma } from "@/lib/prisma";
import { dashboardTranslations } from "@/lib/i18n/admin/dashboard";
import { formatMessage } from "@/lib/i18n/formatMessage";
import type { AdminLanguage } from "@/lib/i18n/admin/context";

export type DashboardStats = {
  totalDemandes: number;
  demandesNonTraitees: number;
  totalClients: number;
  servicesActifs: number;
  avisPublies: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalDemandes, demandesNonTraitees, totalClients, servicesActifs, avisPublies] =
    await Promise.all([
      prisma.demande.count(),
      prisma.demande.count({ where: { status: { in: ["NOUVEAU", "EN_COURS"] } } }),
      prisma.client.count(),
      prisma.service.count({ where: { visible: true } }),
      prisma.avis.count({ where: { status: "PUBLIE" } }),
    ]);

  return { totalDemandes, demandesNonTraitees, totalClients, servicesActifs, avisPublies };
}

export type ActivityItem = {
  id: string;
  type: "demande" | "client";
  title: string;
  subtitle?: string;
  date: Date;
  href: string;
};

export async function getRecentActivity(
  limit = 8,
  lang: AdminLanguage = "en"
): Promise<ActivityItem[]> {
  const dict = dashboardTranslations[lang].activity;
  const [demandes, clients] = await Promise.all([
    prisma.demande.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.client.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
  ]);

  const items: ActivityItem[] = [
    ...demandes.map((d) => ({
      id: `demande-${d.id}`,
      type: "demande" as const,
      title: formatMessage(dict.newRequestFrom, { name: `${d.firstName} ${d.lastName}` }),
      subtitle: d.service,
      date: d.createdAt,
      href: `/admin/demandes?id=${d.id}`,
    })),
    ...clients.map((c) => ({
      id: `client-${c.id}`,
      type: "client" as const,
      title: formatMessage(dict.newClient, { name: c.name }),
      subtitle: c.company ?? undefined,
      date: c.createdAt,
      href: `/admin/clients?id=${c.id}`,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export type WeeklyDemandeCount = { week: string; demandes: number };

export async function getDemandesPerWeek(
  weeksBack = 8,
  lang: AdminLanguage = "en"
): Promise<WeeklyDemandeCount[]> {
  const rangeStart = startOfWeekMonday(new Date());
  rangeStart.setDate(rangeStart.getDate() - (weeksBack - 1) * 7);

  const demandes = await prisma.demande.findMany({
    where: { createdAt: { gte: rangeStart } },
    select: { createdAt: true },
  });

  const weekStarts = Array.from({ length: weeksBack }, (_, i) => {
    const start = new Date(rangeStart);
    start.setDate(start.getDate() + i * 7);
    return start;
  });

  const counts = new Array(weeksBack).fill(0);
  for (const { createdAt } of demandes) {
    for (let i = weekStarts.length - 1; i >= 0; i--) {
      if (createdAt >= weekStarts[i]) {
        counts[i]++;
        break;
      }
    }
  }

  return weekStarts.map((start, i) => ({
    week: start.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "2-digit",
    }),
    demandes: counts[i],
  }));
}

"use client";

import { useSession } from "next-auth/react";
import { IconInbox, IconUsers, IconBriefcase, IconStarFilled } from "@tabler/icons-react";
import { useDashboard } from "@/lib/admin/useDashboard";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { dashboardTranslations } from "@/lib/i18n/admin/dashboard";
import { formatMessage } from "@/lib/i18n/formatMessage";
import StatCard from "@/components/admin/dashboard/StatCard";
import DemandesChart from "@/components/admin/dashboard/DemandesChart";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data } = useDashboard();
  const { lang } = useAdminLanguage();
  const dict = dashboardTranslations[lang];

  const stats = data?.stats;
  const activity = data?.activity ?? [];
  const weeklyDemandes = data?.weeklyDemandes ?? [];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-heading text-2xl font-bold text-white">{dict.title}</h1>
      <p className="mt-1 text-sm text-base-gray">
        {formatMessage(dict.welcome, { name: session?.user?.name ?? "" })}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={dict.stats.requestsReceived}
          value={stats?.totalDemandes ?? 0}
          icon={IconInbox}
          highlight={
            stats && stats.demandesNonTraitees > 0
              ? formatMessage(dict.stats.unhandled, { count: stats.demandesNonTraitees })
              : undefined
          }
          href="/admin/demandes"
        />
        <StatCard
          label={dict.stats.clients}
          value={stats?.totalClients ?? 0}
          icon={IconUsers}
          href="/admin/clients"
        />
        <StatCard
          label={dict.stats.activeServices}
          value={stats?.servicesActifs ?? 0}
          icon={IconBriefcase}
          href="/admin/services"
        />
        <StatCard
          label={dict.stats.publishedReviews}
          value={stats?.avisPublies ?? 0}
          icon={IconStarFilled}
          href="/admin/avis"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DemandesChart data={weeklyDemandes} />
        <RecentActivity items={activity} />
      </div>
    </div>
  );
}

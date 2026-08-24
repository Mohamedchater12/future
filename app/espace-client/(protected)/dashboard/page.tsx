"use client";

import { motion } from "framer-motion";
import {
  IconClipboardList,
  IconClockHour4,
  IconMessageCircle,
  IconStarFilled,
} from "@tabler/icons-react";
import { useClientProfile } from "@/lib/client-space/useClientProfile";
import { useClientSummary } from "@/lib/client-space/useClientSummary";
import { useClientMissions } from "@/lib/client-space/useClientMissions";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import { formatMessage } from "@/lib/i18n/clientSpace/translations";
import StatCard from "@/components/client-space/dashboard/StatCard";
import ActiveRequestCard from "@/components/client-space/dashboard/ActiveRequestCard";
import RecentNotifications from "@/components/client-space/dashboard/RecentNotifications";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ClientDashboardPage() {
  const { client } = useClientProfile();
  const { summary, mutate: mutateSummary } = useClientSummary();
  const { missions } = useClientMissions();
  const { dict } = useClientLanguage();

  const firstName = client?.name.split(" ")[0] ?? "";
  const enCours = summary?.counts.enCours ?? 0;
  const terminees = summary?.counts.terminees ?? 0;
  const unreadMessages = summary?.counts.unreadMessages ?? 0;
  const reviews = summary?.counts.reviews ?? 0;
  const notifications = summary?.notifications ?? [];

  const activeRequests = [...missions]
    .sort((a, b) => {
      const rank = (status: string) => (status === "TERMINE" ? 1 : 0);
      const rankDiff = rank(a.status) - rank(b.status);
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 3);

  async function handleNotificationClick() {
    await fetch("/api/client/notifications/mark-seen", { method: "POST" });
    mutateSummary();
  }

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold text-white">
          {formatMessage(dict.dashboard.greeting, { name: firstName })}
        </h1>
        <p className="mt-1 text-sm text-base-gray">{dict.dashboard.subtitle}</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        custom={1}
        variants={fadeUp}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label={dict.dashboard.stats.activeRequests}
          value={enCours}
          icon={IconClockHour4}
          href="/espace-client/demandes"
        />
        <StatCard
          label={dict.dashboard.stats.completedRequests}
          value={terminees}
          icon={IconClipboardList}
          href="/espace-client/demandes"
        />
        <StatCard
          label={dict.dashboard.stats.unreadMessages}
          value={unreadMessages}
          icon={IconMessageCircle}
          highlight={unreadMessages > 0 ? dict.dashboard.stats.newBadge : undefined}
          href="/espace-client/messagerie"
        />
        <StatCard
          label={dict.dashboard.stats.reviewsGiven}
          value={reviews}
          icon={IconStarFilled}
          href="/espace-client/avis"
        />
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <motion.div initial="hidden" animate="show" custom={2} variants={fadeUp}>
          <h2 className="font-heading text-base font-semibold text-white">
            {dict.dashboard.activeRequestsTitle}
          </h2>
          <div className="mt-4 space-y-4">
            {activeRequests.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-base-gray">
                {dict.dashboard.noActiveRequests}
              </p>
            ) : (
              activeRequests.map((mission) => (
                <ActiveRequestCard key={mission.id} mission={mission} />
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp}>
          <RecentNotifications
            items={notifications.slice(0, 5)}
            onItemClick={handleNotificationClick}
          />
        </motion.div>
      </div>
    </div>
  );
}

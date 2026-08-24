"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyDemandeCount } from "@/lib/dashboard";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { dashboardTranslations } from "@/lib/i18n/admin/dashboard";

export default function DemandesChart({ data }: { data: WeeklyDemandeCount[] }) {
  const { lang } = useAdminLanguage();
  const dict = dashboardTranslations[lang];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="font-heading text-base font-semibold text-white">{dict.chart.title}</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="demandesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="#A1A1AA"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke="#A1A1AA"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "#0d0a1e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 13,
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#A855F7" }}
            />
            <Area
              type="monotone"
              dataKey="demandes"
              name={dict.chart.seriesName}
              stroke="#A855F7"
              strokeWidth={2}
              fill="url(#demandesFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

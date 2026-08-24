"use client";

import { IconCheck } from "@tabler/icons-react";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { MissionStep } from "@prisma/client";

export default function DemandeTimeline({ steps }: { steps: MissionStep[] }) {
  const { dict, lang } = useClientLanguage();

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isDone = step.status === "TERMINE";
        const isCurrent = step.status === "EN_COURS";
        return (
          <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[11px] top-6 h-full w-px ${
                  isDone ? "bg-emerald-400/50" : "bg-white/10"
                }`}
              />
            )}
            <span
              className={`z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                isDone
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                  : isCurrent
                    ? "animate-pulse border-amber-400 bg-amber-400/10 text-amber-300"
                    : "border-white/15 bg-white/[0.03] text-transparent"
              }`}
            >
              {isDone ? (
                <IconCheck size={12} stroke={3} />
              ) : (
                isCurrent && <span className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className={`text-sm font-medium ${
                  isDone || isCurrent ? "text-white" : "text-base-gray"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="mt-0.5 text-xs font-medium text-amber-300">
                  {dict.requests.detail.inProgress}
                </p>
              )}
              {step.note && (
                <p className="mt-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-base-gray">
                  {step.note}
                </p>
              )}
              {step.imageUrl && (
                <a
                  href={step.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-lg border border-white/10 object-cover transition-opacity hover:opacity-80"
                  />
                </a>
              )}
              {isDone && (
                <p className="mt-0.5 text-xs text-base-gray">
                  {new Date(step.updatedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

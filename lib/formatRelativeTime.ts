import type { AdminLanguage } from "@/lib/i18n/admin/context";

const RELATIVE_TIME: Record<AdminLanguage, { now: string; min: string; h: string; d: string }> = {
  en: { now: "just now", min: "{n} min ago", h: "{n} h ago", d: "{n} d ago" },
  ar: { now: "الآن", min: "منذ {n} دقيقة", h: "منذ {n} ساعة", d: "منذ {n} يوم" },
};

export function formatRelativeTime(date: Date, lang: AdminLanguage = "en"): string {
  const t = RELATIVE_TIME[lang];
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return t.now;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t.min.replace("{n}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.h.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  if (days < 7) return t.d.replace("{n}", String(days));

  return date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

import {
  clientSpaceTranslations,
  formatMessage,
  type ClientSpaceLanguage,
} from "@/lib/i18n/clientSpace/translations";

export function formatRelativeTime(date: Date, lang: ClientSpaceLanguage = "en"): string {
  const dict = clientSpaceTranslations[lang].relativeTime;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return dict.now;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return formatMessage(dict.minutesAgo, { value: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return formatMessage(dict.hoursAgo, { value: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return formatMessage(dict.daysAgo, { value: days });

  return date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

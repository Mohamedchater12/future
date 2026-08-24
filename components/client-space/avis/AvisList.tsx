"use client";

import Badge from "@/components/admin/Badge";
import StarsDisplay from "@/components/admin/avis/StarsDisplay";
import { getReviewStatusLabels, REVIEW_STATUS_STYLES } from "@/lib/client-space/reviewStatus";
import { formatRelativeTime } from "@/lib/client-space/formatRelativeTime";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";
import type { Avis } from "@prisma/client";

export default function AvisList({ reviews }: { reviews: Avis[] }) {
  const { dict, lang } = useClientLanguage();
  const statusLabels = getReviewStatusLabels(dict);

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-base-gray">
        {dict.reviews.noReviews}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StarsDisplay rating={review.rating} />
            <Badge className={REVIEW_STATUS_STYLES[review.status]}>
              {statusLabels[review.status]}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-white">{review.quote}</p>
          <p className="mt-2 text-xs text-base-gray">
            {formatRelativeTime(new Date(review.createdAt), lang)}
          </p>
        </li>
      ))}
    </ul>
  );
}

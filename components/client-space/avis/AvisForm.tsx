"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconLoader2, IconSend } from "@tabler/icons-react";
import StarRatingInput from "@/components/admin/avis/StarRatingInput";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function AvisForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dict } = useClientLanguage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError(dict.reviews.errors.ratingRequired);
      return;
    }
    if (comment.trim().length < 5) {
      setError(dict.reviews.errors.commentTooShort);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, quote: comment.trim() }),
      });
      if (!response.ok) throw new Error("submit_failed");

      setRating(0);
      setComment("");
      onSubmitted();
      toast.success(dict.reviews.success);
    } catch {
      toast.error(dict.reviews.errors.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
    >
      <h2 className="font-heading text-base font-semibold text-white">{dict.reviews.formTitle}</h2>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-white">
          {dict.reviews.ratingLabel}
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="mt-4">
        <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-white">
          {dict.reviews.commentLabel}
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={dict.reviews.commentPlaceholder}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-light px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <IconLoader2 size={16} className="animate-spin" />
        ) : (
          <IconSend size={16} />
        )}
        {dict.reviews.submit}
      </button>
    </form>
  );
}

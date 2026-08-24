"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import StarRatingInput from "@/components/admin/avis/StarRatingInput";
import { avisSchema, avisStatusValues, type AvisInput } from "@/lib/validations/avis";
import { getAvisStatusLabels } from "@/lib/admin/avisStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { avisTranslations, getStarAriaLabel } from "@/lib/i18n/admin/avis";
import type { Avis } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function AvisFormModal({
  avis,
  onClose,
  onSaved,
}: {
  avis: Avis | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = avisTranslations[lang];
  const statusLabels = getAvisStatusLabels(dict);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AvisInput>({
    resolver: zodResolver(avisSchema),
    defaultValues: avis
      ? {
          name: avis.name,
          company: avis.company ?? undefined,
          photoUrl: avis.photoUrl ?? undefined,
          rating: avis.rating,
          quote: avis.quote,
          status: avis.status,
          featured: avis.featured,
        }
      : { rating: 5, status: "EN_ATTENTE", featured: false },
  });

  async function onSubmit(data: AvisInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(avis ? `/api/admin/avis/${avis.id}` : "/api/admin/avis", {
        method: avis ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("save_failed");

      toast.success(avis ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={avis ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.clientName}</label>
            <input className={inputClasses} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.company}</label>
            <input className={inputClasses} {...register("company")} />
          </div>
        </div>

        <Controller
          control={control}
          name="photoUrl"
          render={({ field }) => (
            <ImageUploadField label={dict.form.photo} value={field.value} onChange={field.onChange} />
          )}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.rating}</label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRatingInput
                value={field.value}
                onChange={field.onChange}
                getAriaLabel={(n) => getStarAriaLabel(lang, n)}
              />
            )}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.reviewText}</label>
          <textarea rows={3} className={`${inputClasses} resize-none`} {...register("quote")} />
          {errors.quote && <p className="mt-1 text-xs text-red-400">{errors.quote.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.status}</label>
            <select className={inputClasses} {...register("status")}>
              {avisStatusValues.map((status) => (
                <option key={status} value={status} className="bg-base-black">
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" className="h-4 w-4 accent-purple" {...register("featured")} />
              {dict.form.featureThisReview}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
          >
            {dict.form.cancel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-full bg-purple px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <IconLoader2 size={14} className="animate-spin" />}
            {avis ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

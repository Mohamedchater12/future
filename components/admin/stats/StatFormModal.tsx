"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconChartBar } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import { statSchema, type StatInput } from "@/lib/validations/stat";
import { STAT_ICON_OPTIONS, STAT_ICON_MAP } from "@/lib/statIcons";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { statsTranslations } from "@/lib/i18n/admin/stats";
import type { Stat } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function StatFormModal({
  stat,
  nextOrder,
  onClose,
  onSaved,
}: {
  stat: Stat | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = statsTranslations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StatInput>({
    resolver: zodResolver(statSchema),
    defaultValues: stat
      ? {
          label: stat.label,
          value: stat.value,
          suffix: stat.suffix ?? undefined,
          icon: stat.icon ?? undefined,
          order: stat.order,
          visible: stat.visible,
        }
      : { label: "", value: 0, order: nextOrder, visible: true },
  });

  const watched = useWatch({ control });
  const PreviewIcon = STAT_ICON_MAP[watched.icon ?? ""] ?? IconChartBar;

  async function onSubmit(data: StatInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(stat ? `/api/admin/stats/${stat.id}` : "/api/admin/stats", {
        method: stat ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("save_failed");

      toast.success(stat ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={stat ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.labelLabel}</label>
          <input placeholder={dict.form.labelPlaceholder} className={inputClasses} {...register("label")} />
          {errors.label && <p className="mt-1 text-xs text-red-400">{errors.label.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.valueLabel}</label>
            <input
              type="number"
              className={inputClasses}
              {...register("value", { valueAsNumber: true })}
            />
            {errors.value && <p className="mt-1 text-xs text-red-400">{errors.value.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.suffixLabel}</label>
            <input placeholder={dict.form.suffixPlaceholder} className={inputClasses} {...register("suffix")} />
            {errors.suffix && <p className="mt-1 text-xs text-red-400">{errors.suffix.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.iconLabel}</label>
          <select className={inputClasses} {...register("icon")}>
            <option value="" className="bg-base-black">
              {dict.form.noIconOption}
            </option>
            {STAT_ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-base-black">
                {dict.iconOptions[opt.value as keyof typeof dict.iconOptions] ?? opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.orderLabel}</label>
            <input type="number" min={0} className={inputClasses} {...register("order", { valueAsNumber: true })} />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" className="h-4 w-4 accent-purple" {...register("visible")} />
              {dict.form.visibleLabel}
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-base-gray">
            {dict.form.previewLabel}
          </p>
          <div className="flex max-w-xs items-start gap-3 rounded-xl border border-portal-border bg-base-black p-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-portal-bg text-portal-accent">
              <PreviewIcon size={18} stroke={1.5} />
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-gradient">
                {watched.value ?? 0}
                {watched.suffix}
              </div>
              <div className="text-xs text-base-gray">{watched.label || dict.form.previewLabelFallback}</div>
            </div>
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
            {stat ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

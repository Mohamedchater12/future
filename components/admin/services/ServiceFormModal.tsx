"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconBriefcase } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { serviceSchema, type ServiceInput } from "@/lib/validations/service";
import { SERVICE_ICON_OPTIONS, SERVICE_ICON_MAP } from "@/lib/serviceIcons";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { servicesTranslations } from "@/lib/i18n/admin/services";
import type { Service } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function ServiceFormModal({
  service,
  nextOrder,
  onClose,
  onSaved,
}: {
  service: Service | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = servicesTranslations[lang];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          title: service.title,
          description: service.description,
          icon: service.icon,
          image: service.image ?? undefined,
          order: service.order,
          visible: service.visible,
        }
      : {
          title: "",
          description: "",
          icon: SERVICE_ICON_OPTIONS[0].value,
          order: nextOrder,
          visible: true,
        },
  });

  const watched = watch();
  const PreviewIcon = SERVICE_ICON_MAP[watched.icon] ?? IconBriefcase;

  async function onSubmit(data: ServiceInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        service ? `/api/admin/services/${service.id}` : "/api/admin/services",
        {
          method: service ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("save_failed");

      toast.success(service ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={service ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.titleLabel}</label>
          <input className={inputClasses} {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.descriptionLabel}</label>
          <textarea rows={3} className={`${inputClasses} resize-none`} {...register("description")} />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.iconLabel}</label>
          <select className={inputClasses} {...register("icon")}>
            {SERVICE_ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-base-black">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUploadField label={dict.form.imageLabel} value={field.value} onChange={field.onChange} />
          )}
        />

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
          <div className="max-w-xs rounded-xl border border-portal-border bg-base-black p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-portal-bg text-portal-accent">
              <PreviewIcon size={22} stroke={1.5} />
            </div>
            <h3 className="mt-5 font-heading text-lg font-semibold text-white">
              {watched.title || dict.form.previewTitleFallback}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-base-gray">
              {watched.description || dict.form.previewDescriptionFallback}
            </p>
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
            {service ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

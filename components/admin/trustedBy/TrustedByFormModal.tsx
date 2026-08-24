"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { trustedBySchema, type TrustedByInput } from "@/lib/validations/trustedBy";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { trustedByTranslations } from "@/lib/i18n/admin/trustedBy";
import type { TrustedBy } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function TrustedByFormModal({
  item,
  nextOrder,
  onClose,
  onSaved,
}: {
  item: TrustedBy | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = trustedByTranslations[lang];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TrustedByInput>({
    resolver: zodResolver(trustedBySchema),
    defaultValues: item
      ? {
          name: item.name,
          logoUrl: item.logoUrl,
          link: item.link ?? undefined,
          order: item.order,
          visible: item.visible,
        }
      : { name: "", order: nextOrder, visible: true },
  });

  async function onSubmit(data: TrustedByInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        item ? `/api/admin/trusted-by/${item.id}` : "/api/admin/trusted-by",
        {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("save_failed");

      toast.success(item ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={item ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.brandName}</label>
          <input className={inputClasses} {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <Controller
          control={control}
          name="logoUrl"
          render={({ field }) => (
            <ImageUploadField label={dict.form.logo} value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.logoUrl && <p className="mt-1 text-xs text-red-400">{errors.logoUrl.message}</p>}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.externalLink}</label>
          <input placeholder={dict.form.externalLinkPlaceholder} className={inputClasses} {...register("link")} />
          {errors.link && <p className="mt-1 text-xs text-red-400">{errors.link.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.order}</label>
            <input type="number" min={0} className={inputClasses} {...register("order", { valueAsNumber: true })} />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" className="h-4 w-4 accent-purple" {...register("visible")} />
              {dict.form.visibleOnLandingPage}
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
            {item ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

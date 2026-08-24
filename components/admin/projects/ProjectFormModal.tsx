"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconArrowUpRight } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { projectsTranslations } from "@/lib/i18n/admin/projects";
import type { Project } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function ProjectFormModal({
  project,
  nextOrder,
  onClose,
  onSaved,
}: {
  project: Project | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = projectsTranslations[lang];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title: project.title,
          category: project.category,
          stat: project.stat,
          description: project.description ?? undefined,
          image: project.image ?? undefined,
          order: project.order,
          visible: project.visible,
        }
      : {
          title: "",
          category: "",
          stat: "",
          order: nextOrder,
          visible: true,
        },
  });

  const watched = watch();

  async function onSubmit(data: ProjectInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        project ? `/api/admin/projects/${project.id}` : "/api/admin/projects",
        {
          method: project ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("save_failed");

      toast.success(project ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={project ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.title}</label>
          <input className={inputClasses} {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.category}</label>
          <input
            className={inputClasses}
            placeholder={dict.form.categoryPlaceholder}
            {...register("category")}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.result}</label>
          <input className={inputClasses} placeholder={dict.form.resultPlaceholder} {...register("stat")} />
          {errors.stat && <p className="mt-1 text-xs text-red-400">{errors.stat.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            {dict.form.description} <span className="font-normal text-base-gray">{dict.form.descriptionHint}</span>
          </label>
          <textarea
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder={dict.form.descriptionPlaceholder}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <ImageUploadField label={dict.form.coverImage} value={field.value} onChange={field.onChange} />
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.order}</label>
            <input type="number" min={0} className={inputClasses} {...register("order", { valueAsNumber: true })} />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" className="h-4 w-4 accent-purple" {...register("visible")} />
              {dict.form.visible}
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-base-gray">
            {dict.form.previewHeading}
          </p>
          <div className="max-w-xs overflow-hidden rounded-xl border border-portal-border">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-portal-card via-[#2a1b6b] to-portal-accent/40">
              {watched.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={watched.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-portal-bg via-portal-bg/20 to-transparent opacity-80" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-portal-border">
                    {watched.category || dict.form.previewCategoryFallback}
                  </p>
                  <h3 className="mt-1 font-heading text-base font-semibold text-white">
                    {watched.title || dict.form.previewTitleFallback}
                  </h3>
                </div>
                <IconArrowUpRight size={16} className="mb-1 shrink-0 text-portal-accent" />
              </div>
            </div>
            <div className="flex items-center justify-between bg-portal-card px-4 py-2.5">
              <span className="text-xs text-base-gray">{dict.form.previewResultLabel}</span>
              <span className="font-heading text-sm font-bold text-gradient">
                {watched.stat || "—"}
              </span>
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
            {project ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

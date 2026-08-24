"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { toolSchema, type ToolInput } from "@/lib/validations/tool";
import { TOOL_CATEGORIES, getToolCategoryLabels } from "@/lib/admin/toolCategories";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { toolsTranslations } from "@/lib/i18n/admin/tools";
import type { Tool } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function ToolFormModal({
  tool,
  nextOrder,
  onClose,
  onSaved,
}: {
  tool: Tool | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { lang } = useAdminLanguage();
  const dict = toolsTranslations[lang];
  const categoryLabels = getToolCategoryLabels(dict);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ToolInput>({
    resolver: zodResolver(toolSchema),
    defaultValues: tool
      ? {
          name: tool.name,
          iconUrl: tool.iconUrl,
          category: tool.category as ToolInput["category"],
          order: tool.order,
          visible: tool.visible,
        }
      : { name: "", category: TOOL_CATEGORIES[0], order: nextOrder, visible: true },
  });

  async function onSubmit(data: ToolInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(tool ? `/api/admin/tools/${tool.id}` : "/api/admin/tools", {
        method: tool ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("save_failed");

      toast.success(tool ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={tool ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.name}</label>
          <input className={inputClasses} {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <Controller
          control={control}
          name="iconUrl"
          render={({ field }) => (
            <ImageUploadField label={dict.form.icon} value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.iconUrl && <p className="mt-1 text-xs text-red-400">{errors.iconUrl.message}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.category}</label>
            <select className={inputClasses} {...register("category")}>
              {TOOL_CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-base-black">
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.order}</label>
            <input type="number" min={0} className={inputClasses} {...register("order", { valueAsNumber: true })} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" className="h-4 w-4 accent-purple" {...register("visible")} />
          {dict.form.visible}
        </label>

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
            {tool ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

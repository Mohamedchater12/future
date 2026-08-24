"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import Modal from "@/components/admin/Modal";
import { clientSchema, clientStatusValues, type ClientInput } from "@/lib/validations/client";
import { getClientStatusLabels } from "@/lib/admin/clientStatus";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { clientsTranslations } from "@/lib/i18n/admin/clients";
import type { Client } from "@prisma/client";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function ClientFormModal({
  client,
  onClose,
  onSaved,
}: {
  client: Client | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = clientsTranslations[lang];
  const statusLabels = getClientStatusLabels(dict);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          name: client.name,
          company: client.company ?? undefined,
          email: client.email,
          phone: client.phone ?? undefined,
          project: client.project ?? undefined,
          status: client.status,
          notes: client.notes ?? undefined,
        }
      : { status: "ACTIF" },
  });

  async function onSubmit(data: ClientInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        client ? `/api/admin/clients/${client.id}` : "/api/admin/clients",
        {
          method: client ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("save_failed");

      toast.success(client ? dict.toast.updated : dict.toast.created);
      onSaved();
    } catch {
      toast.error(dict.toast.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={client ? dict.form.editTitle : dict.form.addTitle} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.name}</label>
            <input className={inputClasses} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.company}</label>
            <input className={inputClasses} {...register("company")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.email}</label>
            <input type="email" className={inputClasses} {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.phone}</label>
            <input className={inputClasses} {...register("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.project}</label>
            <input className={inputClasses} {...register("project")} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.status}</label>
            <select className={inputClasses} {...register("status")}>
              {clientStatusValues.map((status) => (
                <option key={status} value={status} className="bg-base-black">
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">{dict.form.notes}</label>
          <textarea rows={3} className={`${inputClasses} resize-none`} {...register("notes")} />
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
            {client ? dict.form.save : dict.form.create}
          </button>
        </div>
      </form>
    </Modal>
  );
}

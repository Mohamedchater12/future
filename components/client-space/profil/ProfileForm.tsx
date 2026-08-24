"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { getClientProfileSchema, type ClientProfileInput } from "@/lib/validations/clientAuth";
import { useClientProfile } from "@/lib/client-space/useClientProfile";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function ProfileForm() {
  const router = useRouter();
  const { client, mutate } = useClientProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dict, lang } = useClientLanguage();
  const schema = useMemo(() => getClientProfileSchema(lang), [lang]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientProfileInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
    values: client
      ? {
          name: client.name,
          email: client.email,
          phone: client.phone ?? "",
          company: client.company ?? "",
        }
      : undefined,
  });

  async function onSubmit(data: ClientProfileInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.error === "email_taken") {
          toast.error(dict.profile.errors.emailTaken);
          return;
        }
        throw new Error("update_failed");
      }

      mutate();
      router.refresh();
      toast.success(dict.profile.success.infoUpdated);
    } catch {
      toast.error(dict.profile.errors.updateFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
          {dict.profile.fields.fullName}
        </label>
        <input id="name" type="text" className={inputClasses} {...register("name")} />
        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
          {dict.profile.fields.email}
        </label>
        <input id="email" type="email" className={inputClasses} {...register("email")} />
        {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-white">
            {dict.profile.fields.company}
          </label>
          <input id="company" type="text" className={inputClasses} {...register("company")} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white">
            {dict.profile.fields.phone}
          </label>
          <input id="phone" type="tel" className={inputClasses} {...register("phone")} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-light px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
        {dict.profile.save}
      </button>
    </form>
  );
}

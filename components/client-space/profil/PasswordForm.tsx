"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import {
  getClientChangePasswordSchema,
  type ClientChangePasswordInput,
} from "@/lib/validations/clientAuth";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dict, lang } = useClientLanguage();
  const schema = useMemo(() => getClientChangePasswordSchema(lang), [lang]);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ClientChangePasswordInput>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ClientChangePasswordInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.error === "invalid_current_password") {
          setError("currentPassword", { message: dict.profile.errors.currentPasswordIncorrect });
          return;
        }
        throw new Error("update_failed");
      }

      reset();
      toast.success(dict.profile.success.passwordUpdated);
    } catch {
      toast.error(dict.profile.errors.passwordUpdateFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium text-white">
          {dict.profile.fields.currentPassword}
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className={inputClasses}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1.5 text-xs text-red-400">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-white">
          {dict.profile.fields.newPassword}
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className={inputClasses}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="mt-1.5 text-xs text-red-400">{errors.newPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
        {dict.profile.changePassword}
      </button>
    </form>
  );
}

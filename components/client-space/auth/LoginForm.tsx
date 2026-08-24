"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { dict } = useClientLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    setIsSubmitting(true);
    const result = await signIn("client-credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      const message = dict.auth.login.error;
      setFormError(message);
      toast.error(message);
      return;
    }

    router.push("/espace-client/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
          {dict.auth.login.email}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={inputClasses}
          {...register("email")}
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white">
          {dict.auth.login.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={inputClasses}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {formError && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-light px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
        {dict.auth.login.submit}
      </button>

      <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-xs text-base-gray">
        {dict.auth.login.demoNote}
      </p>
    </form>
  );
}

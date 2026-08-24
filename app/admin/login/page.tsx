"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import LanguageToggle from "@/components/admin/LanguageToggle";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsSubmitting(true);
    const result = await signIn("admin-credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      toast.error(dict.login.error);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-purple/10 blur-[140px]" />

      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl font-bold tracking-tight text-white">
            {dict.brand}
          </span>
          <p className="mt-2 text-sm text-base-gray">{dict.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
              {dict.login.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={inputClasses}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white">
              {dict.login.password}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
            {dict.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { getClientRegisterSchema, type ClientRegisterInput } from "@/lib/validations/clientAuth";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-base-gray/60 outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/40";

export default function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dict, lang } = useClientLanguage();
  const schema = useMemo(() => getClientRegisterSchema(lang), [lang]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRegisterInput>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ClientRegisterInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.error === "email_taken") {
          toast.error(dict.auth.signup.errors.emailTaken);
        } else {
          toast.error(dict.auth.signup.errors.createFailed);
        }
        return;
      }

      const result = await signIn("client-credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result || result.error) {
        toast.error(dict.auth.signup.errors.autoLoginFailed);
        router.push("/espace-client/connexion");
        return;
      }

      toast.success(dict.auth.signup.welcomeToast);
      router.push("/espace-client/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-white">
          {dict.auth.signup.fullName}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          className={inputClasses}
          {...register("name")}
        />
        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
          {dict.auth.signup.email}
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-white">
            {dict.auth.signup.company}
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            className={inputClasses}
            {...register("company")}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white">
            {dict.auth.signup.phone}
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputClasses}
            {...register("phone")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white">
          {dict.auth.signup.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
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
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-light px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
        {dict.auth.signup.submit}
      </button>
    </form>
  );
}

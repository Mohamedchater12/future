"use client";

import Link from "next/link";
import AuthCard from "@/components/client-space/auth/AuthCard";
import LoginForm from "@/components/client-space/auth/LoginForm";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function ConnexionPage() {
  const { dict } = useClientLanguage();

  return (
    <AuthCard
      title={dict.auth.login.title}
      subtitle={dict.auth.login.subtitle}
      footer={
        <>
          {dict.auth.login.noAccount}{" "}
          <Link href="/espace-client/inscription" className="font-medium text-purple-light hover:text-white">
            {dict.auth.login.createAccount}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

"use client";

import Link from "next/link";
import AuthCard from "@/components/client-space/auth/AuthCard";
import SignupForm from "@/components/client-space/auth/SignupForm";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function InscriptionPage() {
  const { dict } = useClientLanguage();

  return (
    <AuthCard
      title={dict.auth.signup.title}
      subtitle={dict.auth.signup.subtitle}
      footer={
        <>
          {dict.auth.signup.alreadyAccount}{" "}
          <Link href="/espace-client/connexion" className="font-medium text-purple-light hover:text-white">
            {dict.auth.signup.login}
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}

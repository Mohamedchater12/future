import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { ClientLanguageProvider } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function EspaceClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthSessionProvider basePath="/api/auth/client">
      <ClientLanguageProvider>{children}</ClientLanguageProvider>
    </AuthSessionProvider>
  );
}

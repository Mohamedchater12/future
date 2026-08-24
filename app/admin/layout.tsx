import type { Metadata } from "next";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { AdminLanguageProvider } from "@/lib/i18n/admin/context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin — Future",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthSessionProvider basePath="/api/auth/admin">
      <AdminLanguageProvider>
        <div className="min-h-screen bg-base-black font-body text-white">
          {children}
        </div>
        <Toaster theme="dark" richColors position="top-right" />
      </AdminLanguageProvider>
    </AuthSessionProvider>
  );
}

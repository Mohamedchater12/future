import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminAuthOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(adminAuthOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell adminName={session.user.name ?? "Admin"}>{children}</AdminShell>;
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { clientAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientShell from "@/components/client-space/ClientShell";

export default async function ProtectedEspaceClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(clientAuthOptions);

  if (!session || session.user.accountType !== "client") {
    redirect("/espace-client/connexion");
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });

  if (!client) {
    redirect("/espace-client/connexion");
  }

  return <ClientShell user={client}>{children}</ClientShell>;
}

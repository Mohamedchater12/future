import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demandeStatusValues } from "@/lib/validations/demande";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = demandeStatusValues.find((value) => value === statusParam);

  const demandes = await prisma.demande.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { client: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ demandes });
}

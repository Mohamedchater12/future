import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validations/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(200, Math.max(1, Number(searchParams.get("pageSize")) || 10));

  // Note: "contains" is case-sensitive on PostgreSQL (case-insensitive `mode`
  // isn't supported on SQLite). Acceptable for the dev DB; revisit once the
  // prod Postgres datasource is wired up.
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { company: { contains: q } },
        ],
      }
    : undefined;

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.client.count({ where }),
  ]);

  return NextResponse.json({ clients, total, page, pageSize });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const client = await prisma.client.create({ data: parsed.data });

  await prisma.notification.create({
    data: {
      type: "NOUVEAU_CLIENT",
      message: `Nouveau client : ${client.name}`,
      link: `/admin/clients?id=${client.id}`,
    },
  });

  return NextResponse.json({ client }, { status: 201 });
}

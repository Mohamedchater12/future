import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMissionSchema } from "@/lib/validations/mission";

const missionInclude = {
  client: { select: { id: true, name: true, company: true } },
  steps: { orderBy: { order: "asc" as const } },
  files: { orderBy: { createdAt: "desc" as const } },
};

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: missionInclude,
  });
  if (!mission) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ mission });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = updateMissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const mission = await prisma.mission.update({
    where: { id: params.id },
    data: parsed.data,
    include: missionInclude,
  });

  return NextResponse.json({ mission });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.mission.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

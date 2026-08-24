import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMissionStepSchema } from "@/lib/validations/mission";

const missionInclude = {
  client: { select: { id: true, name: true, company: true } },
  steps: { orderBy: { order: "asc" as const } },
  files: { orderBy: { createdAt: "desc" as const } },
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; stepId: string } }
) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = updateMissionStepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const step = await prisma.missionStep.findUnique({ where: { id: params.stepId } });
  if (!step || step.missionId !== params.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.missionStep.update({
    where: { id: params.stepId },
    data: parsed.data,
  });

  // Une seule étape "en cours" à la fois : en marquer une nouvelle repasse
  // les autres étapes EN_COURS en TERMINE (si situées avant) ou A_FAIRE (si
  // après), selon leur position — évite plusieurs "positions actuelles"
  // simultanées sur la timeline client.
  if (parsed.data.status === "EN_COURS") {
    const currentOrder = parsed.data.order ?? step.order;
    const others = await prisma.missionStep.findMany({
      where: { missionId: params.id, status: "EN_COURS", id: { not: params.stepId } },
    });
    await Promise.all(
      others.map((other) =>
        prisma.missionStep.update({
          where: { id: other.id },
          data: { status: other.order < currentOrder ? "TERMINE" : "A_FAIRE" },
        })
      )
    );
  }

  // La progression suit automatiquement les étapes terminées — évite à
  // l'admin de devoir maintenir manuellement un pourcentage en plus.
  const allSteps = await prisma.missionStep.findMany({ where: { missionId: params.id } });
  const progress = Math.round(
    (allSteps.filter((s) => s.status === "TERMINE").length / allSteps.length) * 100
  );

  const mission = await prisma.mission.update({
    where: { id: params.id },
    data: { progress },
    include: missionInclude,
  });

  return NextResponse.json({ mission });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; stepId: string } }
) {
  const step = await prisma.missionStep.findUnique({ where: { id: params.stepId } });
  if (!step || step.missionId !== params.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.missionStep.delete({ where: { id: params.stepId } });

  const allSteps = await prisma.missionStep.findMany({ where: { missionId: params.id } });
  const progress =
    allSteps.length === 0
      ? 0
      : Math.round((allSteps.filter((s) => s.status === "TERMINE").length / allSteps.length) * 100);

  const mission = await prisma.mission.update({
    where: { id: params.id },
    data: { progress },
    include: missionInclude,
  });

  return NextResponse.json({ mission });
}

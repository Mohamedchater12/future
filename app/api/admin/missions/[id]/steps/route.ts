import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMissionStepSchema } from "@/lib/validations/mission";

const missionInclude = {
  client: { select: { id: true, name: true, company: true } },
  steps: { orderBy: { order: "asc" as const } },
  files: { orderBy: { createdAt: "desc" as const } },
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = addMissionStepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const lastStep = await prisma.missionStep.findFirst({
    where: { missionId: params.id },
    orderBy: { order: "desc" },
  });

  await prisma.missionStep.create({
    data: {
      missionId: params.id,
      label: parsed.data.label,
      order: (lastStep?.order ?? -1) + 1,
    },
  });

  const allSteps = await prisma.missionStep.findMany({ where: { missionId: params.id } });
  const progress = Math.round(
    (allSteps.filter((s) => s.status === "TERMINE").length / allSteps.length) * 100
  );

  const mission = await prisma.mission.update({
    where: { id: params.id },
    data: { progress },
    include: missionInclude,
  });

  return NextResponse.json({ mission }, { status: 201 });
}

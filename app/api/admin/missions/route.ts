import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { missionSchema } from "@/lib/validations/mission";

const missionInclude = {
  client: { select: { id: true, name: true, company: true } },
  steps: { orderBy: { order: "asc" as const } },
  files: { orderBy: { createdAt: "desc" as const } },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId") ?? undefined;

  const missions = await prisma.mission.findMany({
    where: clientId ? { clientId } : undefined,
    include: missionInclude,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ missions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = missionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { clientId, steps, ...rest } = parsed.data;

  const mission = await prisma.mission.create({
    data: {
      ...rest,
      clientId,
      title: rest.title ?? rest.title_en,
      description: rest.description ?? rest.description_en,
      steps: {
        create: steps.map((step, index) => ({
          label: step.label_en ?? step.label_ar ?? step.label ?? "",
          label_en: step.label_en,
          label_ar: step.label_ar,
          order: index,
        })),
      },
    },
    include: missionInclude,
  });

  return NextResponse.json({ mission }, { status: 201 });
}

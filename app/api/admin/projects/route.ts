import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "invalid_body" },
      { status: 400 }
    );
  }

  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_error",
        issues: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      title: parsed.data.title || parsed.data.title_en,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
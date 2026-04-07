import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processSchema } from "@/lib/validators/process";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string } };

const MAX_PROCESSES = 50;

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canView = await hasProjectAccess(user.id, params.id, ProjectPermission.VIEW);
  if (!canView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const processes = await prisma.process.findMany({
    where: { projectId: params.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(processes);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const count = await prisma.process.count({ where: { projectId: params.id } });
  if (count >= MAX_PROCESSES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PROCESSES} processes allowed per project` },
      { status: 422 }
    );
  }

  const body = await req.json();
  const parsed = processSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const process = await prisma.process.create({
    data: { ...parsed.data, projectId: params.id },
  });

  return NextResponse.json(process, { status: 201 });
}

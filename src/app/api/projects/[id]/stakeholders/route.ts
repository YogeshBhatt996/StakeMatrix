import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stakeholderSchema } from "@/lib/validators/stakeholder";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string } };

const MAX_STAKEHOLDERS = 20;

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canView = await hasProjectAccess(user.id, params.id, ProjectPermission.VIEW);
  if (!canView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const stakeholders = await prisma.stakeholder.findMany({
    where: { projectId: params.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(stakeholders);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const count = await prisma.stakeholder.count({ where: { projectId: params.id } });
  if (count >= MAX_STAKEHOLDERS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_STAKEHOLDERS} stakeholders allowed per project` },
      { status: 422 }
    );
  }

  const body = await req.json();
  const parsed = stakeholderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const stakeholder = await prisma.stakeholder.create({
    data: { ...parsed.data, projectId: params.id },
  });

  return NextResponse.json(stakeholder, { status: 201 });
}

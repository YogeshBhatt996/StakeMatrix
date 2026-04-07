import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStakeholderSchema } from "@/lib/validators/stakeholder";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string; sid: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateStakeholderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.stakeholder.update({
    where: { id: params.sid },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.stakeholder.delete({ where: { id: params.sid } });
  return NextResponse.json({ success: true });
}

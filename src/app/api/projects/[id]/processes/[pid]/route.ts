import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string; pid: string } };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.process.delete({ where: { id: params.pid } });
  return NextResponse.json({ success: true });
}

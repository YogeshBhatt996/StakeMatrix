import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string } };

const accessSchema = z.object({
  userId: z.string().uuid(),
  permission: z.nativeEnum(ProjectPermission),
});

function requireAdmin(user: SessionUser, res: typeof NextResponse) {
  if (user.globalRole !== "ADMIN") {
    return res.json({ error: "Forbidden — Admin only" }, { status: 403 });
  }
  return null;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const deny = requireAdmin(user, NextResponse);
  if (deny) return deny;

  const access = await prisma.projectAccess.findMany({
    where: { projectId: params.id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(access);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const deny = requireAdmin(user, NextResponse);
  if (deny) return deny;

  const body = await req.json();
  const parsed = accessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const access = await prisma.projectAccess.upsert({
    where: {
      projectId_userId: { projectId: params.id, userId: parsed.data.userId },
    },
    update: { permission: parsed.data.permission },
    create: {
      projectId: params.id,
      userId: parsed.data.userId,
      permission: parsed.data.permission,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(access, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const deny = requireAdmin(user, NextResponse);
  if (deny) return deny;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  await prisma.projectAccess.delete({
    where: { projectId_userId: { projectId: params.id, userId } },
  });

  return NextResponse.json({ success: true });
}

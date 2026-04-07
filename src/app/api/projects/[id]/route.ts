import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/validators/project";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import type { SessionUser } from "@/types";

type Params = { params: { id: string } };

// GET /api/projects/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canView = await hasProjectAccess(user.id, params.id, ProjectPermission.VIEW);
  if (!canView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      processes: { orderBy: { sortOrder: "asc" } },
      stakeholders: { orderBy: { name: "asc" } },
      access: { include: { user: { select: { id: true, name: true, email: true } } } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(project);
}

// PUT /api/projects/:id
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);
  if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...data,
      initiationDate: data.initiationDate ? new Date(data.initiationDate) : undefined,
      orgNumber:
        data.isNXProject !== undefined
          ? data.isNXProject
            ? data.orgNumber ?? undefined
            : null
          : undefined,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/projects/:id — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

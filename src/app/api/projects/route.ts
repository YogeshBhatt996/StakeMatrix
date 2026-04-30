import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validators/project";
import { getAccessibleProjectIds } from "@/lib/permissions";
import type { SessionUser } from "@/types";

// GET /api/projects — list projects accessible to current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  const accessibleIds = await getAccessibleProjectIds(user.id);

  const projects = await prisma.project.findMany({
    where: accessibleIds !== null ? { id: { in: accessibleIds } } : undefined,
    include: {
      _count: { select: { stakeholders: true, processes: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST /api/projects — create new project (all authenticated users)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;

  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      name: data.name,
      signedFTECount: data.signedFTECount,
      deployedFTECount: data.deployedFTECount,
      initiationDate: new Date(data.initiationDate),
      isNXProject: data.isNXProject,
      isALISProject: data.isALISProject,
      isOtherProject: data.isOtherProject,
      orgNumber: data.isNXProject ? data.orgNumber ?? null : null,
      shifts: data.shifts,
      meetingFrequency: data.meetingFrequency,
      additionalInfo: data.additionalInfo ?? null,
      createdById: user.id,
    },
  });

  // Non-admin creators automatically get EDIT access to their own project
  if (user.globalRole !== "ADMIN") {
    await prisma.projectAccess.create({
      data: { projectId: project.id, userId: user.id, permission: "EDIT" },
    });
  }

  return NextResponse.json(project, { status: 201 });
}

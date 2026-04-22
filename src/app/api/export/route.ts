import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessibleProjectIds } from "@/lib/permissions";
import type { SessionUser } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const user = session.user as SessionUser;
  const accessibleIds = await getAccessibleProjectIds(user.id);

  const projects = await prisma.project.findMany({
    where: accessibleIds !== null ? { id: { in: accessibleIds } } : undefined,
    include: {
      stakeholders: true,
      processes: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
      _count: { select: { stakeholders: true, processes: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(projects);
}

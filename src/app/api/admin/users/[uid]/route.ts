import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { SessionUser } from "@/types";

type Params = { params: { uid: string } };

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
  globalRole: z.enum(["ADMIN", "USER"]).optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: params.uid },
    data: parsed.data,
    select: { id: true, email: true, name: true, globalRole: true, isActive: true },
  });

  return NextResponse.json(updated);
}

// Soft delete — deactivate only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Prevent admin from deactivating themselves
  if (params.uid === user.id) {
    return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: params.uid },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}

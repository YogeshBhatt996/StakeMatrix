import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { SessionUser } from "@/types";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }
  const userId = (session.user as SessionUser).id;

  try {
    const { name, email, currentPassword, newPassword } = await req.json();

    const updates: Record<string, unknown> = {};

    // ── Name ──────────────────────────────────────────────────
    if (name !== undefined) {
      const trimmed = (name as string).trim();
      if (!trimmed) return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
      updates.name = trimmed;
    }

    // ── Email ─────────────────────────────────────────────────
    if (email !== undefined) {
      const trimmed = (email as string).toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
      }
      const existing = await prisma.user.findFirst({
        where: { email: trimmed, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: "That email address is already in use." }, { status: 409 });
      }
      updates.email = trimmed;
    }

    // ── Password ──────────────────────────────────────────────
    if (newPassword !== undefined) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new one." }, { status: 400 });
      }
      if ((newPassword as string).length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user?.passwordHash) {
        return NextResponse.json({ error: "Cannot verify current password." }, { status: 400 });
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No changes provided." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: { id: true, name: true, email: true, globalRole: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

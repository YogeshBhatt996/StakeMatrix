import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendInviteEmail } from "@/lib/sendgrid";
import type { SessionUser } from "@/types";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let pw = "";
  for (let i = 0; i < 12; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
  globalRole: z.enum(["ADMIN", "USER"]).optional(),
});

// GET /api/admin/users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      globalRole: true,
      isActive: true,
      createdAt: true,
      _count: { select: { projectAccess: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

// POST /api/admin/users — invite user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as SessionUser;
  if (currentUser.globalRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const newUser = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      globalRole: "USER",
      isActive: true,
    },
    select: { id: true, email: true, name: true, globalRole: true, isActive: true, createdAt: true },
  });

  try {
    await sendInviteEmail(newUser.email, newUser.name, tempPassword);
  } catch (err) {
    console.error("Failed to send invite email:", err);
    // Don't fail the request — user is created, email is best-effort
  }

  return NextResponse.json(newUser, { status: 201 });
}

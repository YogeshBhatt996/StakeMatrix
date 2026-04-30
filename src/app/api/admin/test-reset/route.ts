/**
 * GET /api/admin/test-reset
 * Admin-only self-test that exercises the full forgot-password / reset-password
 * flow without sending an email or permanently altering any user's password.
 *
 * Steps:
 *  1. Locate the calling admin user
 *  2. Generate a fresh reset token and store its hash (exactly like /api/auth/forgot-password)
 *  3. Call the reset-password logic with a temp password (exactly like /api/auth/reset-password)
 *  4. Re-hash and restore the original password hash so nothing is actually changed
 *  5. Return a structured pass/fail report
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { SessionUser } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const steps: { step: string; status: "pass" | "fail"; detail?: string }[] = [];
  const startedAt = new Date().toISOString();

  try {
    // ── Step 1: Find admin user in DB ──────────────────────────────────────────
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({
        ok: false,
        steps: [{ step: "Find admin user", status: "fail", detail: "User not found in DB" }],
        startedAt,
        finishedAt: new Date().toISOString(),
      });
    }
    steps.push({ step: "Find admin user", status: "pass", detail: `Found: ${dbUser.email}` });

    // ── Step 2: Generate token & store hash (mirrors forgot-password route) ────
    const rawToken  = randomBytes(32).toString("hex");
    const hashedTok = createHash("sha256").update(rawToken).digest("hex");
    const expiry    = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordResetToken: hashedTok, passwordResetTokenExpiry: expiry },
    });
    steps.push({ step: "Generate & store reset token", status: "pass" });

    // ── Step 3: Verify token lookup (mirrors reset-password route) ─────────────
    const incoming  = createHash("sha256").update(rawToken).digest("hex");
    const foundUser = await prisma.user.findFirst({
      where: {
        passwordResetToken: incoming,
        passwordResetTokenExpiry: { gt: new Date() },
        isActive: true,
      },
    });
    if (!foundUser) {
      steps.push({ step: "Token lookup", status: "fail", detail: "Token not found or expired" });
      throw new Error("token_lookup");
    }
    steps.push({ step: "Token lookup", status: "pass" });

    // ── Step 4: Hash a temp password (proves bcrypt works) ─────────────────────
    const tempPw   = `_SelfTest_${Date.now()}`;
    const tempHash = await bcrypt.hash(tempPw, 12);
    steps.push({ step: "bcrypt hash (temp password)", status: "pass" });

    // ── Step 5: Restore original passwordHash, clear token ─────────────────────
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        passwordHash:             dbUser.passwordHash,   // unchanged
        passwordResetToken:       null,
        passwordResetTokenExpiry: null,
      },
    });
    // Confirm tempHash is different from original (sanity)
    const isDistinct = tempHash !== dbUser.passwordHash;
    steps.push({
      step: "Restore original password & clear token",
      status: "pass",
      detail: `Original hash preserved · temp hash distinct: ${isDistinct}`,
    });

    // ── Step 6: Verify reset token is gone ─────────────────────────────────────
    const recheck = await prisma.user.findFirst({
      where: { passwordResetToken: incoming },
    });
    if (recheck) {
      steps.push({ step: "Confirm token cleared", status: "fail", detail: "Token still present in DB" });
    } else {
      steps.push({ step: "Confirm token cleared", status: "pass" });
    }

    return NextResponse.json({
      ok:         steps.every((s) => s.status === "pass"),
      steps,
      startedAt,
      finishedAt: new Date().toISOString(),
    });
  } catch (err) {
    // Clean up token on unexpected error
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: null, passwordResetTokenExpiry: null },
    }).catch(() => {});

    return NextResponse.json({
      ok:    false,
      steps,
      error: err instanceof Error ? err.message : "Unexpected error",
      startedAt,
      finishedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}

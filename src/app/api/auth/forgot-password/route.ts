import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/sendgrid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email as string)?.toLowerCase().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 regardless of whether the email exists
    // This prevents email enumeration attacks
    if (!user || !user.isActive) {
      return NextResponse.json({ ok: true });
    }

    // Generate a cryptographically random token
    const rawToken = randomBytes(32).toString("hex");
    // Store the SHA-256 hash so the raw token is never in the DB
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiry: expiry,
      },
    });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    // Best-effort email send — don't surface failures to client
    await sendPasswordResetEmail(user.email, user.name, resetUrl).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

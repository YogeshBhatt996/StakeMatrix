import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMonthlyReminder } from "@/lib/sendgrid";

/**
 * Returns true if the given date is the last Friday of its month.
 * Logic: if adding 7 days crosses into the next month, it's the last Friday.
 */
function isLastFridayOfMonth(date: Date): boolean {
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + 7);
  return nextWeek.getMonth() !== date.getMonth();
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();

  // Only proceed if today is the last Friday of the month
  if (!isLastFridayOfMonth(today)) {
    return NextResponse.json({
      skipped: true,
      reason: "Not the last Friday of the month",
      date: today.toISOString(),
    });
  }

  // Fetch all users with EDIT permission on any project (deduplicated)
  const editorAccesses = await prisma.projectAccess.findMany({
    where: { permission: "EDIT" },
    select: { user: { select: { id: true, name: true, email: true, isActive: true } } },
    distinct: ["userId"],
  });

  // Fetch all Admin users
  const adminUsers = await prisma.user.findMany({
    where: { globalRole: "ADMIN", isActive: true },
    select: { id: true, name: true, email: true, isActive: true },
  });

  // Merge and deduplicate by email
  const allRecipients = [
    ...editorAccesses.map((e) => e.user).filter((u) => u.isActive),
    ...adminUsers,
  ];

  const seen = new Set<string>();
  const unique = allRecipients.filter((u) => {
    if (seen.has(u.email)) return false;
    seen.add(u.email);
    return true;
  });

  let sent = 0;
  const errors: string[] = [];

  for (const recipient of unique) {
    try {
      await sendMonthlyReminder(recipient.email, recipient.name);
      sent++;
    } catch (err) {
      errors.push(recipient.email);
      console.error(`Failed to send reminder to ${recipient.email}:`, err);
    }
  }

  // Log the send event
  await prisma.emailLog.create({
    data: {
      recipientCount: sent,
      status: errors.length === 0 ? "SUCCESS" : sent > 0 ? "PARTIAL" : "FAILED",
      notes: errors.length > 0 ? `Failed: ${errors.join(", ")}` : null,
    },
  });

  return NextResponse.json({
    success: true,
    sent,
    failed: errors.length,
    date: today.toISOString(),
  });
}

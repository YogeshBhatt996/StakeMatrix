# Integration Patterns

## NextAuth.js

**Config:** `src/lib/auth.ts`

```ts
// Session shape extended with globalRole
declare module "next-auth" {
  interface Session { user: SessionUser }
}
interface SessionUser { id: string; email: string; name: string; globalRole: GlobalRole }
```

- `authorize()` → finds user, compares bcrypt hash, updates `lastLoginAt`
- `jwt()` callback → adds `id`, `globalRole` to JWT
- `session()` callback → exposes them on `session.user`
- All server components: `getServerSession(authOptions)` → no extra DB query
- All client components: `useSession()` hook from `next-auth/react`

## Prisma + Supabase

**Config:** `src/lib/prisma.ts` (singleton pattern)

```ts
// Singleton to avoid "too many connections" in dev (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Connection string format:**
```
postgresql://postgres.<project>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Migrations:** Managed manually via Supabase SQL Editor (not `prisma migrate dev`) because the pooler does not support the migration advisory lock protocol.

## SendGrid

**Config:** `src/lib/sendgrid.ts`

Three email types:
1. `sendPasswordResetEmail(to, name, resetUrl)` — triggered by forgot-password API
2. `sendMonthlyReminder(to, name)` — triggered by Vercel Cron
3. `sendInviteEmail(to, name, tempPassword)` — triggered by admin invite

All `await sgMail.send(msg)` calls. The forgot-password route wraps in `.catch(() => {})` to prevent email failures from blocking the HTTP response.

**Required env vars:** `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME`

## Vercel Cron

**Config:** `vercel.json`
```json
{ "crons": [{ "path": "/api/cron/monthly-reminder", "schedule": "0 8 * * 5" }] }
```

This fires every Friday at 08:00 UTC. The route itself checks if it's the last Friday of the month before sending. Logs result to `EmailLog` table.

**Security:** Route checks `CRON_SECRET` header (set in Vercel env vars) before processing.

## Permissions helper

**Config:** `src/lib/permissions.ts`

```ts
// Returns true if user can access the project at the given level
hasProjectAccess(userId, projectId, permission): Promise<boolean>
  → ADMIN always returns true
  → USER checks ProjectAccess table

// Returns null (all projects) for ADMIN, array of IDs for USER
getAccessibleProjectIds(userId): Promise<string[] | null>
```

Used in every API route and Server Component to gate access.

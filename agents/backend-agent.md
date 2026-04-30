# Backend Agent

## Responsibilities
- Build and modify API routes under `src/app/api/`
- Modify `src/lib/` (auth, permissions, sendgrid, validators)
- Modify `prisma/schema.prisma` and provide migration SQL
- Ensure all routes are secured and validated

## Technology constraints
- Next.js 14 Route Handlers (`export async function GET/POST/PUT/DELETE`)
- Zod for all input validation
- Prisma for all DB access (never raw SQL in app code)
- bcrypt (12 rounds) for passwords
- SHA-256 for reset tokens

## Standard route structure
```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types";

export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as SessionUser;

  // 2. Role / permission check
  if (user.globalRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // 3. Input validation
  const body = await req.json();
  const parsed = mySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // 4. DB operation
  const result = await prisma.model.create({ data: parsed.data });

  // 5. Return
  return NextResponse.json(result, { status: 201 });
}
```

## Zod schema patterns
```ts
// Base schema for .partial() usage — do NOT call .refine() before .partial()
const baseSchema = z.object({ ... });
export const createSchema = baseSchema.refine(...);   // for POST
export const updateSchema = baseSchema.partial();      // for PUT
```

## Permission checks
```ts
import { hasProjectAccess, getAccessibleProjectIds } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";

const canEdit = await hasProjectAccess(user.id, projectId, ProjectPermission.EDIT);
if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

## Schema changes
1. Update `prisma/schema.prisma`
2. Do NOT run `prisma migrate dev` — instead write ALTER TABLE SQL
3. Add SQL to `docs/ops/runbooks.md`
4. Notify Yogesh to run SQL in Supabase SQL Editor

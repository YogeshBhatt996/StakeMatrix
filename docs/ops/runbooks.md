# Runbooks

## RB-01 — Apply a schema migration

The Supabase pooler does not support `prisma migrate`. Run SQL directly.

1. Open Supabase → SQL Editor
2. Paste and run the relevant SQL (examples below)
3. Verify in Table Editor
4. Prisma generates updated client on next Vercel deploy automatically

## RB-02 — Add new User columns (lastLoginAt, reset tokens)
```sql
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "lastLoginAt"              TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "passwordResetToken"       TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS "passwordResetTokenExpiry" TIMESTAMPTZ;
```

## RB-03 — Migrate shift → shifts[] + new project fields
```sql
ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "shifts"         "Shift"[]  NOT NULL DEFAULT ARRAY['DAY'::"Shift"],
  ADD COLUMN IF NOT EXISTS "isALISProject"  BOOLEAN    NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isOtherProject" BOOLEAN    NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "additionalInfo" TEXT;

UPDATE "Project" SET "shifts" = ARRAY["shift"::"Shift"]
  WHERE "shifts" = ARRAY['DAY'::"Shift"] AND "shift" IS NOT NULL;

ALTER TABLE "Project" DROP COLUMN IF EXISTS "shift";
```

## RB-04 — Enable RLS on all tables
```sql
ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Stakeholder"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectAccess"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailLog"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
```

## RB-05 — Reset admin password
```sql
-- Replace <bcrypt_hash> with output of: node -e "console.log(require('bcryptjs').hashSync('NewPassword123', 12))"
UPDATE "User"
SET "passwordHash" = '<bcrypt_hash>'
WHERE email = 'yogeshbhatt996@gmail.com';
```

## RB-06 — Force-clear a stuck reset token
```sql
UPDATE "User"
SET "passwordResetToken" = NULL, "passwordResetTokenExpiry" = NULL
WHERE email = 'user@example.com';
```

## RB-07 — Deactivate a user
```sql
UPDATE "User" SET "isActive" = false WHERE email = 'user@example.com';
```

## RB-08 — Fix Prisma DLL locked on Windows (build error EPERM)
The dev server holds `query_engine-windows.dll.node`.

```powershell
# In PowerShell:
Stop-Process -Name "node" -Force
# Then retry build:
npm run build
```

## RB-09 — Re-seed admin user
```bash
npx tsx prisma/seed.ts
```
Creates `yogeshbhatt996@gmail.com` with role ADMIN if not already present.

## RB-10 — Verify forgot-password flow (no email needed)
1. Log in as admin → `/admin/users`
2. Scroll to "Forgot Password — Self-Test" panel
3. Click "Run Self-Test"
4. All 6 steps should show green ticks

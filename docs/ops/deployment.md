# Deployment Guide

## Platform: Vercel

### Initial setup
1. Push repo to GitHub (`YogeshBhatt996/StakeMatrix`)
2. Import project in Vercel dashboard — **leave Root Directory blank** (app is at repo root)
3. Framework auto-detected as Next.js
4. Add all environment variables (see `env-vars.md`)
5. Deploy — first deploy generates Prisma client via `postinstall` hook

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "crons": [{ "path": "/api/cron/monthly-reminder", "schedule": "0 8 * * 5" }]
}
```

### package.json scripts
```json
{
  "build":       "prisma generate && next build",
  "postinstall": "prisma generate"
}
```
`prisma generate` runs before every build and after every `npm install` to ensure the Prisma client is up to date.

### Deploy flow
```
git push origin main
  → Vercel webhook triggered
  → npm install → postinstall → prisma generate
  → npm run build → prisma generate && next build
  → 22 routes compiled
  → deployed to <project>.vercel.app
```

## Database: Supabase

### Running schema migrations
Supabase pooler does NOT support Prisma migrate. Use the SQL Editor instead:

1. Open Supabase dashboard → SQL Editor
2. Paste the ALTER TABLE statements from `docs/ops/runbooks.md`
3. Run and verify

### RLS
All public schema tables have RLS enabled with no permissive policies:
```sql
ALTER TABLE "User"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Stakeholder"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Process"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectAccess"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailLog"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
```
Prisma connects as the `postgres` superuser which bypasses RLS — app is unaffected.

## Local development

```bash
git clone https://github.com/YogeshBhatt996/StakeMatrix
cd StakeMatrix
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, etc.
npm run dev          # http://localhost:3000
```

**Important:** Stop `npm run dev` before running `npm run build` on Windows — the Prisma DLL is locked by the dev server process.

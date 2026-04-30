# AI Agent Instructions

## Project context
This is **StakeMatrix** — a Next.js 14 App Router application for managing stakeholder registers. It uses Prisma + Supabase (PostgreSQL), NextAuth.js, Tailwind CSS, and deploys to Vercel.

## Before starting any task
1. Read `context/current-state.md` to understand what is already built
2. Read `docs/architecture/overview.md` to understand the system
3. Read `docs/design/ui-rules.md` before writing any UI code
4. Read `docs/design/copy-guidelines.md` before writing any copy

## Key rules for all agents
- **Never move or rename** `src/`, `prisma/`, `next.config.mjs`, `package.json`, `vercel.json` — these must stay at the root for Vercel
- **Never use external component libraries** — Tailwind utility classes only
- **Never use external images** — inline SVG only
- **Always stop the dev server before running `npm run build`** on Windows (Prisma DLL lock)
- **Always keep `"use client"` minimal** — prefer Server Components
- **Never expose raw error codes** to the UI
- **Always validate with Zod** on the server side for all API inputs
- **Always check session + role** in every API route

## File naming conventions
- Pages: `src/app/(group)/page-name/page.tsx`
- API routes: `src/app/api/resource/route.ts`
- Components: `src/components/FeatureName.tsx` or `src/components/folder/Name.tsx`
- Validators: `src/lib/validators/resource.ts`

## After making changes
1. Run `npm run build` to confirm zero TypeScript / lint errors
2. Update `tasks/in-progress.md` or `tasks/done.md`
3. If schema changed, add SQL to `docs/ops/runbooks.md`

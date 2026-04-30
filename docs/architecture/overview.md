# Architecture Overview

## System diagram

```
Browser (Next.js client components)
        │
        │  HTTPS
        ▼
┌─────────────────────────────────────────┐
│           Vercel Edge Network           │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │    Next.js 14  (App Router)      │   │
│  │                                  │   │
│  │  ┌─────────────┐  ┌───────────┐  │   │
│  │  │  RSC Pages  │  │ API Routes│  │   │
│  │  │  (server)   │  │ /api/**   │  │   │
│  │  └──────┬──────┘  └─────┬─────┘  │   │
│  │         │               │         │   │
│  │         └──────┬────────┘         │   │
│  │                │                  │   │
│  │          ┌─────▼──────┐           │   │
│  │          │   Prisma   │           │   │
│  │          │    ORM     │           │   │
│  │          └─────┬──────┘           │   │
│  └────────────────┼──────────────────┘   │
└───────────────────┼─────────────────────┘
                    │  pgBouncer (port 6543)
                    ▼
         ┌─────────────────────┐
         │  Supabase / PostgreSQL│
         │  (hosted DB)        │
         └─────────────────────┘

Other external services:
  SendGrid  ← email (password reset, monthly reminder, invite)
  Vercel Cron ← triggers /api/cron/monthly-reminder (last Friday 08:00)
```

## Request lifecycle

1. Browser hits a URL
2. Next.js middleware (`middleware.ts`) checks for a valid NextAuth session
3. If no session → redirect to `/login`
4. App Router renders the Server Component (SSR); Prisma queries run server-side
5. Client components hydrate for interactivity
6. Form submissions hit API Routes (`/api/**`)
7. API Routes validate session, run Zod validation, call Prisma, return JSON

## Auth flow (NextAuth + JWT)

```
signIn("credentials", { email, password })
  → CredentialsProvider.authorize()
    → prisma.user.findUnique({ email })
    → bcrypt.compare(password, passwordHash)
    → success: return { id, email, name, globalRole }
  → JWT token stored in httpOnly cookie
  → session.user available in all server/client components
```

## Key directories

```
src/
├── app/
│   ├── (auth)/          # Public: login, register, forgot-password, reset-password
│   ├── (app)/           # Protected: dashboard, projects, admin, profile
│   └── api/             # All API routes
├── components/
│   ├── layout/          # AppShell, Sidebar, Topbar
│   ├── stakeholders/    # StakeholderTable, InfluenceBadge
│   ├── admin/           # ForgotPasswordTestPanel
│   └── ExportButton, InactivityTimer
├── lib/
│   ├── auth.ts          # NextAuth config + lastLoginAt tracking
│   ├── permissions.ts   # hasProjectAccess, getAccessibleProjectIds
│   ├── prisma.ts        # Singleton PrismaClient
│   ├── sendgrid.ts      # Email send functions
│   └── validators/      # Zod schemas
├── types/               # SessionUser, shared interfaces
prisma/
├── schema.prisma        # DB schema (source of truth)
└── seed.ts              # Initial admin user
```

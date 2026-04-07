# Stakeholder Register

A centralized, multi-user web application for managing Stakeholder Registers across multiple projects. Built with Next.js 14, PostgreSQL, and Prisma.

---

## Features

- **Multi-Project Support** — Manage unlimited projects with full details (FTEs, shift, processes, meeting frequency)
- **Stakeholder Management** — Up to 20 stakeholders per project with influence tracking, contact info, Teams availability
- **Role-Based Access** — Admin, Editor, and Viewer roles with per-project permission assignment
- **User Management** — Invite users by email; configure access per project
- **Automated Email Reminders** — Automatic monthly reminder every last Friday to all editors
- **Professional Dashboard** — Clean, responsive UI with project cards, stats, and color-coded indicators

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js |
| UI | TailwindCSS + shadcn/ui |
| Email | SendGrid |
| Scheduler | Vercel Cron |
| Deployment | Vercel |

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local values
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000 — log in with `admin@yourdomain.com` / `Admin@123456`

---

## Documentation

| Document | Description |
|----------|-------------|
| [REQUIREMENTS.md](./REQUIREMENTS.md) | Full functional and non-functional requirements |
| [SETUP.md](./SETUP.md) | Step-by-step setup guide for developers |
| [INSTALLATION.md](./INSTALLATION.md) | Installation guide for local, Vercel, and Docker deployments |

---

## Project Structure

```
stakeholder-register/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Initial admin user seed
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Login page
│   │   ├── (app)/
│   │   │   ├── dashboard/     # Project dashboard
│   │   │   ├── projects/      # Project CRUD + stakeholders
│   │   │   └── admin/         # User & access management
│   │   └── api/               # All API routes
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Prisma, auth, email, validators
│   └── types/                 # Shared TypeScript types
├── REQUIREMENTS.md
├── SETUP.md
├── INSTALLATION.md
├── vercel.json                # Cron job config
└── .env.example
```

---

## License

Internal use only. All rights reserved.

# StakeMatrix

> Organize · Engage · Deliver

A centralised, multi-user Stakeholder Register for managing project stakeholders, FTEs, processes and access — all in one place.

---

## Quick start

```bash
git clone https://github.com/YogeshBhatt996/StakeMatrix
cd StakeMatrix
npm install
cp .env.example .env.local    # fill in values (see docs/ops/env-vars.md)
npm run dev                    # http://localhost:3000
```

Default admin: `yogeshbhatt996@gmail.com` / `StakeMatrix@2026`  
_(run `npx tsx prisma/seed.ts` if starting fresh)_

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router + TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma v5 |
| Auth | NextAuth.js (credentials) |
| UI | Tailwind CSS (no component library) |
| Email | SendGrid |
| Scheduler | Vercel Cron |
| Export | SheetJS (client-side Excel) |
| Deployment | Vercel |

---

## Project structure

```
stakeholder-register/
│
├── src/                          # Application source
│   ├── app/
│   │   ├── (auth)/               # Public: login, register, forgot/reset password
│   │   ├── (app)/                # Protected: dashboard, projects, admin, profile
│   │   └── api/                  # API routes (auth, projects, stakeholders, admin, export)
│   ├── components/               # Reusable UI components
│   ├── lib/                      # auth, prisma, sendgrid, permissions, validators
│   └── types/                    # Shared TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma             # Database schema (source of truth)
│   └── seed.ts                   # Admin user seeder
│
├── docs/                         # All project documentation
│   ├── product/                  # Vision, requirements, user flows, acceptance criteria
│   ├── design/                   # Design system, UI rules, copy guidelines
│   ├── architecture/             # Overview, data model, tech decisions, integrations
│   └── ops/                      # Deployment, env vars, runbooks (DB migrations)
│
├── context/                      # Project context for humans and AI agents
│   ├── project-brief.md
│   ├── current-state.md          # What is/isn't built
│   ├── roadmap.md
│   ├── open-questions.md
│   └── glossary.md
│
├── tasks/                        # Task tracking
│   ├── backlog.md
│   ├── in-progress.md
│   ├── done.md
│   └── task-templates/
│
├── agents/                       # AI agent instructions and prompts
│   ├── instructions.md           # Rules for all agents
│   ├── frontend-agent.md
│   ├── backend-agent.md
│   ├── reviewer-agent.md
│   └── prompts/
│
├── specs/                        # Detailed feature and API specifications
│   ├── api/                      # projects.md, auth.md, stakeholders.md
│   └── features/                 # auth.spec.md, projects.spec.md, dashboard.spec.md
│
├── tests/
│   ├── test-cases.md             # Manual test scripts
│   ├── unit/                     # (future) Jest unit tests
│   ├── integration/              # (future) API integration tests
│   └── e2e/                      # (future) Playwright tests
│
├── assets/
│   ├── mockups/                  # UI mockup files
│   ├── screenshots/              # App screenshots
│   └── sample-data/              # CSV / JSON sample data for testing
│
├── scripts/
│   └── README.md                 # Available npm and CLI scripts
│
├── vercel.json                   # Vercel build + cron config
├── .env.example                  # All required environment variables
├── WORKFLOW.md                   # Development workflow
└── README.md                     # This file
```

---

## Key documentation

| Document | Description |
|----------|-------------|
| [docs/product/requirements.md](docs/product/requirements.md) | Full functional & non-functional requirements |
| [docs/architecture/data-model.md](docs/architecture/data-model.md) | Database schema reference |
| [docs/ops/runbooks.md](docs/ops/runbooks.md) | SQL migrations, common ops tasks |
| [docs/ops/env-vars.md](docs/ops/env-vars.md) | All environment variables |
| [context/current-state.md](context/current-state.md) | What's built vs what's pending |
| [context/roadmap.md](context/roadmap.md) | Planned features |
| [agents/instructions.md](agents/instructions.md) | Rules for AI agents working on this project |
| [WORKFLOW.md](WORKFLOW.md) | Day-to-day development workflow |

---

## License
Internal use only. All rights reserved.

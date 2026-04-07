# Stakeholder Register — Installation Guide

**Version:** 1.0
**Date:** 2026-03-24
**Target Audience:** System Administrators

---

## ARCHITECTURE OVERVIEW

```
User Browser
     │
     ▼
Vercel CDN + Edge Network
     │
     ▼
Next.js 14 Application (Vercel Serverless Functions)
     │
     ├── PostgreSQL Database (Supabase)
     ├── SendGrid (Email Delivery)
     └── Vercel Cron Jobs (Scheduler)
```

---

## PART A — LOCAL DEVELOPMENT INSTALLATION

### A1. Install Node.js

Download and install Node.js 20 LTS from https://nodejs.org/en/download

Verify:
```bash
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

### A2. Install Project Dependencies

```bash
cd C:/Users/y.bhatt/stakeholder-register
npm install
```

This installs all packages listed in `package.json`:
- next, react, react-dom
- @prisma/client, prisma
- next-auth
- @sendgrid/mail
- zod, react-hook-form, @hookform/resolvers
- tailwindcss, @tailwindcss/forms
- shadcn/ui components (radix-ui primitives)
- zustand
- date-fns
- bcryptjs

### A3. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values (see SETUP.md Step 3)
```

### A4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema and run migrations
npx prisma migrate dev --name init

# Seed admin user
npx prisma db seed
```

### A5. Start Development Server

```bash
npm run dev
# Application available at http://localhost:3000
```

---

## PART B — PRODUCTION INSTALLATION (Vercel + Supabase)

### B1. Supabase Database

1. Create account at https://supabase.com
2. New Project → name it `stakeholder-register`
3. Choose region closest to your users
4. Save the database password securely
5. Copy **Connection String** from: Project Settings → Database → URI
6. Replace `[YOUR-PASSWORD]` in the URI with your actual password

### B2. Vercel Account & CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login
```

### B3. Link Project to Vercel

```bash
cd C:/Users/y.bhatt/stakeholder-register
vercel link
# Follow prompts: create new project, select scope
```

### B4. Configure Environment Variables in Vercel

```bash
# Set each variable (will prompt for value)
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add SENDGRID_API_KEY production
vercel env add SENDGRID_FROM_EMAIL production
vercel env add SENDGRID_FROM_NAME production
vercel env add CRON_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production
```

Or set them via the Vercel Dashboard UI under Project → Settings → Environment Variables.

### B5. Run Production Database Migration

```bash
# Set DATABASE_URL in your local environment temporarily for migration
$env:DATABASE_URL="your-supabase-connection-string"  # PowerShell
npx prisma migrate deploy
npx prisma db seed
```

### B6. Deploy to Production

```bash
vercel --prod
```

After deployment, Vercel will provide a URL (e.g., `https://stakeholder-register-abc123.vercel.app`).

Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to this URL:
```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://stakeholder-register-abc123.vercel.app

vercel --prod  # Redeploy with updated env
```

### B7. Custom Domain (Optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain (e.g., `stakeholders.yourcompany.com`)
3. Follow DNS configuration instructions provided by Vercel
4. Update `NEXTAUTH_URL` to the custom domain and redeploy

---

## PART C — SELF-HOSTED INSTALLATION (Docker)

> Use this if you cannot use Vercel and need to host on your own server.

### C1. Prerequisites

- Docker 24+ and Docker Compose v2
- A server with at least 1GB RAM, 10GB disk
- PostgreSQL database (can use Docker)

### C2. Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### C3. docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/stakeholder_register
      NEXTAUTH_URL: http://your-server-ip:3000
      NEXTAUTH_SECRET: your-secret
      SENDGRID_API_KEY: SG.xxx
      SENDGRID_FROM_EMAIL: noreply@yourdomain.com
      CRON_SECRET: your-cron-secret
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: stakeholder_register
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### C4. Start Self-Hosted

```bash
docker compose up -d
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

### C5. Cron Job (Self-Hosted)

Since Vercel Cron is unavailable, set up a system cron:

```bash
# Open crontab
crontab -e

# Add: Run every Friday at 8:00 AM UTC
0 8 * * 5 curl -s -X GET http://localhost:3000/api/cron/monthly-reminder \
  -H "Authorization: Bearer YOUR_CRON_SECRET" >> /var/log/stakeholder-cron.log 2>&1
```

---

## PART D — POST-INSTALLATION VERIFICATION

Run through this checklist after any installation:

- [ ] Can access login page at `/login`
- [ ] Admin login works with seeded credentials
- [ ] Can create a new project
- [ ] Can add stakeholders to a project
- [ ] Can invite a new user from Admin panel
- [ ] Invited user receives email and can log in
- [ ] View-only user cannot edit project data
- [ ] Cron endpoint returns `{"sent": N}` when called manually
- [ ] Monthly reminder email is received in inbox (not spam)
- [ ] Dashboard loads in under 2 seconds

---

## MAINTENANCE

### Database Backups (Supabase)
Supabase provides automatic daily backups on paid plans. For free tier, set up manual backups:

```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20260324.sql
```

### Applying Future Updates

```bash
git pull origin main
npm install
npx prisma migrate deploy
vercel --prod
```

### Monitoring

- **Vercel Dashboard**: Function logs, deployment status, cron job history
- **Supabase Dashboard**: Database performance, connection counts, query logs
- **SendGrid Dashboard**: Email delivery rates, bounces, spam reports

---

## SUPPORT

For issues, raise a ticket with the following information:
- Deployment environment (Vercel / Docker / Local)
- Node.js version (`node --version`)
- Error message and stack trace from Vercel/server logs
- Steps to reproduce

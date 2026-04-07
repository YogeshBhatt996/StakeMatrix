# Stakeholder Register — Setup Guide

**Version:** 1.0
**Date:** 2026-03-24

---

## PREREQUISITES

Before beginning, ensure you have the following installed and configured:

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18.x or 20.x | LTS recommended — https://nodejs.org |
| npm | 9.x+ | Bundled with Node.js |
| Git | Any recent | https://git-scm.com |
| Vercel CLI | Latest | `npm install -g vercel` |
| PostgreSQL | 14+ | Or use Supabase (recommended) |

---

## STEP 1 — CLONE & INSTALL

```bash
# Navigate to desired directory
cd C:/Projects

# Install dependencies
cd stakeholder-register
npm install
```

---

## STEP 2 — DATABASE SETUP (Supabase — Recommended)

1. Go to https://supabase.com and create a free account.
2. Click **New Project**, choose a name (e.g., `stakeholder-register`), set a strong password.
3. Wait for the project to provision (~2 minutes).
4. Go to **Project Settings → Database → Connection string → URI**.
5. Copy the URI. It will look like:
   ```
   postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```
6. Paste it as `DATABASE_URL` in your `.env.local` file (see Step 3).

### Alternative: Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE stakeholder_register;
\q

# Use this as DATABASE_URL:
# postgresql://postgres:yourpassword@localhost:5432/stakeholder_register
```

---

## STEP 3 — ENVIRONMENT VARIABLES

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values:

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth — MUST match your deployment URL
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-32-char-secret-here

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Stakeholder Register

# Cron Security (generate a random string)
CRON_SECRET=your-random-cron-secret-here

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generating secrets:

```bash
# On Windows (PowerShell)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# On Mac/Linux
openssl rand -base64 32
```

---

## STEP 4 — SENDGRID SETUP

1. Go to https://sendgrid.com and create a free account (100 emails/day free).
2. Go to **Settings → API Keys → Create API Key**.
3. Choose **Restricted Access**, enable **Mail Send → Full Access**.
4. Copy the key and paste as `SENDGRID_API_KEY`.
5. Go to **Settings → Sender Authentication → Single Sender Verification**.
6. Verify the email you want to send from (must match `SENDGRID_FROM_EMAIL`).

---

## STEP 5 — DATABASE MIGRATION

```bash
# Apply schema to database
npx prisma migrate deploy

# (Optional) Seed initial admin user
npx prisma db seed
```

After seeding, you can log in with:
- **Email:** `admin@yourdomain.com`
- **Password:** `Admin@123456`

> **IMPORTANT:** Change the admin password immediately after first login.

---

## STEP 6 — RUN LOCALLY

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## STEP 7 — VERCEL DEPLOYMENT

```bash
# Login to Vercel
vercel login

# Deploy (first time — follow prompts)
vercel

# For production deployment
vercel --prod
```

After first deploy:
1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**.
2. Add all variables from `.env.local` — set environment to **Production**.
3. For `NEXTAUTH_URL`, use your actual Vercel domain (e.g., `https://stakeholder-register.vercel.app`).
4. Redeploy: `vercel --prod`

---

## STEP 8 — CONFIGURE CRON JOB

The `vercel.json` already defines the cron schedule. After deploying to Vercel:

1. Go to **Vercel Dashboard → Your Project → Cron Jobs** tab.
2. Confirm the job `/api/cron/monthly-reminder` is listed with schedule `0 8 * * 5`.
3. To test manually: call the endpoint with the correct `Authorization: Bearer <CRON_SECRET>` header.

```bash
curl -X GET https://your-domain.vercel.app/api/cron/monthly-reminder \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## STEP 9 — FIRST-TIME ADMIN CONFIGURATION

1. Log in at `/login` with seeded admin credentials.
2. Go to **Admin → Users** and invite your team members by email.
3. Go to **Projects → New** and create your first project.
4. Go to the project page → **Manage Access** to grant team members View or Edit rights.
5. Change admin password via the profile menu.

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|---------|
| `DATABASE_URL` connection error | Check Supabase project is active; verify password encoding (escape `@` as `%40` if in password) |
| `NEXTAUTH_SECRET` error on deploy | Ensure it is set in Vercel env vars for Production environment |
| Emails not sending | Verify SendGrid sender is authenticated; check API key has Mail Send permission |
| Cron not firing | Confirm `CRON_SECRET` matches in vercel.json header and env var; check Vercel Cron Logs |
| `prisma migrate deploy` fails | Ensure `DATABASE_URL` is correct and database exists |

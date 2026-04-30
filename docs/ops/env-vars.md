# Environment Variables

## Required for production

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres.<id>:<pw>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase pooler connection string (port 6543) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Full URL of the deployed app (no trailing slash) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | JWT signing secret — must be random, ≥ 32 chars |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Public URL used in email links |
| `SENDGRID_API_KEY` | `SG.xxxx` | SendGrid API key for email sending |
| `SENDGRID_FROM_EMAIL` | `noreply@yourdomain.com` | Verified sender email in SendGrid |

## Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `SENDGRID_FROM_NAME` | `Stakeholder Register` | Display name for outbound emails |
| `CRON_SECRET` | — | Secret header value for Vercel Cron endpoint security |

## Local development only

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Use the same pooler URL; port 5432 is often blocked |

## How to set on Vercel
1. Vercel dashboard → Project → Settings → Environment Variables
2. Add each variable for `Production`, `Preview`, `Development` as appropriate
3. Redeploy after adding new variables

## Security notes
- Never commit `.env.local` to git (it is in `.gitignore`)
- `NEXTAUTH_SECRET` must be unique per environment
- After first deploy, update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to the actual Vercel domain
- `DATABASE_URL` contains the DB password — treat as a secret

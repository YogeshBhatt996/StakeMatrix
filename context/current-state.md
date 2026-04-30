# Current State

_Last updated: 2026-04-30_

## What is live and working

### Authentication
- [x] Login with email + password
- [x] Self-registration (name, email, password)
- [x] Forgot password → email reset link → reset form
- [x] Inactivity auto-logout at 60 min (warning at 55 min)
- [x] Admin invite user with temp password
- [x] Admin send password-reset link from user management page
- [x] Admin forgot-password self-test (DB-only, 6 steps)

### Projects
- [x] Create project (all authenticated users)
- [x] Multi-select shift checkboxes (Day, Afternoon, Night, Moonlight)
- [x] Project types: NX (+ Org Number), ALIS, Other
- [x] Additional Info textarea (250 chars)
- [x] Meeting frequency dropdown
- [x] Add / remove processes (up to 50)
- [x] Edit project
- [x] Delete project (Admin only)
- [x] Auto-grant EDIT access to non-admin project creator

### Stakeholders
- [x] Add stakeholder (Full Name, Job Title, Email, Phone, Department, Category, Influence, Teams)
- [x] Edit stakeholder
- [x] Remove stakeholder
- [x] Influence badge (High / Medium / Low)
- [x] Up to 20 stakeholders per project

### Access control
- [x] ADMIN sees all projects
- [x] USER sees only granted projects
- [x] Admin grants VIEW / EDIT per user per project
- [x] VIEW users see read-only; EDIT users see edit buttons

### Dashboard & navigation
- [x] Dashboard with project cards + FTE/stakeholder stats
- [x] Projects list page (table view)
- [x] Project detail page (info + processes + stakeholder table)
- [x] Sidebar navigation
- [x] User profile page (update name/email/password)
- [x] Export all accessible data to Excel (3 sheets)

### Admin panel
- [x] User management list (role, status, last login, project count)
- [x] Manage individual user (edit, deactivate, send reset)
- [x] Forgot-password self-test panel

### Ops
- [x] Monthly email reminder (Vercel Cron, last Friday)
- [x] RLS enabled on all Supabase tables
- [x] Prisma schema source of truth
- [x] Vercel deployment (auto on push to main)

## Known gaps / not yet built
- [ ] SendGrid API key not yet configured in production (emails not sending)
- [ ] NEXTAUTH_URL / NEXT_PUBLIC_APP_URL not updated to production domain
- [ ] No automated test suite (unit / integration / e2e)
- [ ] No Docker / local PostgreSQL option (Supabase only)
- [ ] No audit log (who changed what, when)
- [ ] No stakeholder deduplication across projects
- [ ] No search / filter on stakeholder table

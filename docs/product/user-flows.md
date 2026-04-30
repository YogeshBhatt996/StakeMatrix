# User Flows

## UF-01 — First-time registration
```
/register
  → Enter Full Name, Email, Password, Confirm Password
  → POST /api/auth/register
  → Success → redirect /login?registered=1
  → Login page shows green "Account created" banner
```

## UF-02 — Login
```
/login
  → Enter Email + Password
  → signIn("credentials") via NextAuth
  → Success → /dashboard
  → Failure → inline error "Invalid email or password"
```

## UF-03 — Forgot password
```
/forgot-password
  → Enter Email
  → POST /api/auth/forgot-password
  → Always shows "Check your email" (prevents enumeration)
  → Email arrives with /reset-password?token=<raw-token>
  → Enter new password (min 8 chars) → POST /api/auth/reset-password
  → Token validated (SHA-256 hash, expiry check) → password updated
  → Redirect /login
```

## UF-04 — Inactivity logout
```
App running
  → No user action for 55 minutes
  → Warning modal appears with 5-min countdown
  → "Stay signed in" → resets 60-min clock
  → No action → signOut() at 60 min → /login?reason=idle
  → Login page shows amber "signed out due to inactivity" banner
```

## UF-05 — Create a project
```
Dashboard → "New Project"
  → /projects/new
  → Fill Project Name, FTEs, Date, Shift checkboxes, Meeting Frequency
  → Check Project Type (NX / ALIS / Other); enter Org # if NX
  → Optionally add Processes (up to 50)
  → Optionally enter Additional Info (≤ 250 chars)
  → POST /api/projects → auto-grants EDIT access for non-admin
  → Redirect /projects/:id
```

## UF-06 — Add a stakeholder
```
Project detail page → "Add Stakeholder" (EDIT users only)
  → /projects/:id/stakeholders/new
  → Fill: Name, Job Title, Email, Phone, Department (optional),
          Category (Internal/External), Influence Level, Teams checkbox
  → POST /api/projects/:id/stakeholders
  → Redirect /projects/:id
```

## UF-07 — Export to Excel
```
Dashboard or Projects list → "Export Excel"
  → GET /api/export (returns all accessible projects)
  → Client builds workbook via SheetJS (3 sheets)
  → Browser downloads StakeMatrix-Export-YYYY-MM-DD.xlsx
```

## UF-08 — Admin: grant project access
```
/admin/users/:uid
  → "Add Project Access" panel
  → Select project + permission (VIEW / EDIT) → POST /api/projects/:id/access
  → User now sees the project in their dashboard
  → Revoke: click Remove next to the access entry → DELETE /api/projects/:id/access
```

## UF-09 — Admin: user management
```
/admin/users
  → See all users, roles, last login, project count
  → "Invite User" → /admin/users/invite → sends email with temp password
  → "Manage" → /admin/users/:uid → change name/email/role/password
  → "Send Password Reset" → triggers same flow as UF-03, no UI input needed
  → "Run Self-Test" → calls GET /api/admin/test-reset → shows pass/fail report
```

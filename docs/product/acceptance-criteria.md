# Acceptance Criteria

## AC-AUTH — Authentication

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-AUTH-01 | Valid email + password | Redirects to /dashboard |
| AC-AUTH-02 | Wrong password | Shows "Invalid email or password" error |
| AC-AUTH-03 | Deactivated account | Shows "Invalid email or password" (no hint) |
| AC-AUTH-04 | Self-register with existing email | Shows "Email already registered" error |
| AC-AUTH-05 | Forgot-password unknown email | Returns 200; shows "Check your email" (no enumeration) |
| AC-AUTH-06 | Reset with expired token (> 1 hr) | Returns 400 "link is invalid or has expired" |
| AC-AUTH-07 | Reset with valid token | Password updated; token cleared; redirect /login |
| AC-AUTH-08 | 55 min idle | Warning modal with countdown appears |
| AC-AUTH-09 | 60 min idle | Auto sign-out; /login?reason=idle with amber banner |

## AC-PROJ — Projects

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-PROJ-01 | Regular user creates project | Project created; EDIT access auto-granted |
| AC-PROJ-02 | NX Project without Org Number | Validation error "Org Number is required" |
| AC-PROJ-03 | No shift selected | Validation error "Select at least one shift" |
| AC-PROJ-04 | Additional Info > 250 chars | Client-side counter turns amber; server rejects > 250 |
| AC-PROJ-05 | User visits ungranted project URL | 404 page (not a 403, to prevent enumeration) |
| AC-PROJ-06 | Admin deletes project | All stakeholders, processes, access records cascade-deleted |

## AC-STK — Stakeholders

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-STK-01 | VIEW user opens project | "Add Stakeholder" button hidden; table shown read-only |
| AC-STK-02 | Add 21st stakeholder | Server returns 400 "limit of 20 reached" |
| AC-STK-03 | Department field empty | Accepted (optional field) |
| AC-STK-04 | Invalid email format | Validation error |

## AC-EXP — Export

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-EXP-01 | Click Export Excel | File downloads with today's date in filename |
| AC-EXP-02 | User with 0 projects | Export contains header rows only, no data rows |
| AC-EXP-03 | Project with multi-shift | Shift(s) column shows comma-separated labels |

## AC-ADM — Admin

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-ADM-01 | Non-admin visits /admin/users | Redirected to /dashboard |
| AC-ADM-02 | Self-test passes | All 6 steps show green tick; report shows 0ms-range timing |
| AC-ADM-03 | Self-test: token cleared after test | Subsequent DB query finds no token for admin user |
| AC-ADM-04 | Admin grants VIEW access | User sees project in dashboard; cannot see Edit/Add buttons |
| AC-ADM-05 | Admin grants EDIT access | User sees Edit Project, Add Stakeholder, Edit Stakeholder buttons |

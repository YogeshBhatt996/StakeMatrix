# Manual Test Cases

## TC-01 — Login flow
1. Navigate to `/login`
2. Enter valid credentials → should land on `/dashboard` ✓
3. Enter wrong password → should show "Invalid email or password" ✓
4. Navigate to `/dashboard` without session → should redirect to `/login` ✓

## TC-02 — Self-registration
1. Navigate to `/register`
2. Fill all fields with a new email → submit → should redirect to `/login?registered=1` ✓
3. Try same email again → should show "Email already registered." ✓
4. Leave a required field blank → HTML5 validation should prevent submit ✓

## TC-03 — Forgot password (UI only — email delivery requires SendGrid)
1. Navigate to `/forgot-password`
2. Enter any email → should show "Check your email" (not an error) ✓
3. Enter an invalid email format → should show validation error ✓

## TC-04 — Create project (regular user)
1. Log in as a USER (non-admin)
2. Click "New Project"
3. Fill all required fields; select at least one shift ✓
4. Submit → should land on project detail page ✓
5. Verify: "Edit Project" and "Add Stakeholder" buttons are visible ✓
6. Submit without selecting a shift → should show validation error ✓
7. Check NX Project without Org Number → should show validation error ✓

## TC-05 — Add stakeholder
1. On a project with EDIT access, click "Add Stakeholder"
2. Fill all required fields, leave Department empty → submit ✓
3. Verify stakeholder appears in the table ✓
4. Click "Edit" → change influence level → save ✓
5. Click "Remove Stakeholder" → confirm → stakeholder gone ✓

## TC-06 — Access control
1. Log in as USER with no projects → dashboard shows empty state ✓
2. Admin grants VIEW access → user refreshes → project appears; no Edit buttons ✓
3. Admin upgrades to EDIT access → Edit buttons appear ✓
4. USER tries to visit `/admin/users` → redirected to `/dashboard` ✓

## TC-07 — Inactivity logout
1. Log in; open browser console
2. Set `WARN_MS` temporarily to 10s, `LOGOUT_MS` to 15s in InactivityTimer.tsx for testing
3. Wait 10s without touching anything → warning modal appears ✓
4. Click "Stay signed in" → modal closes, timer resets ✓
5. Wait again, let countdown reach 0 → redirected to `/login?reason=idle` ✓
6. Login page shows amber inactivity banner ✓

## TC-08 — Excel export
1. From dashboard, click "Export Excel"
2. File downloads as `StakeMatrix-Export-YYYY-MM-DD.xlsx` ✓
3. Open in Excel — verify 3 sheets: Projects, Stakeholders, Processes ✓
4. Verify multi-shift shows as comma-separated in "Shift(s)" column ✓

## TC-09 — Admin self-test
1. Log in as ADMIN → `/admin/users`
2. Scroll to "Forgot Password — Self-Test" panel
3. Click "Run Self-Test" → all 6 steps show green ticks ✓
4. Run again immediately → still passes ✓

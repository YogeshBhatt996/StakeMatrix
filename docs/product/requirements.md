# Product Requirements

## Functional requirements

### Authentication
- FR-AUTH-01  Users must log in with email + password
- FR-AUTH-02  Passwords hashed with bcrypt (12 rounds); never stored in plain text
- FR-AUTH-03  "Forgot password" sends a time-limited reset link (1 hr expiry)
- FR-AUTH-04  New users can self-register; account is USER role by default
- FR-AUTH-05  Session expires after 60 minutes of inactivity
- FR-AUTH-06  Admin can invite users via email with a temporary password
- FR-AUTH-07  Admin can deactivate accounts; deactivated accounts cannot log in
- FR-AUTH-08  Last-login timestamp recorded on each successful sign-in

### Projects
- FR-PROJ-01  Any authenticated user can create a project
- FR-PROJ-02  Project fields: Name, Signed FTE, Deployed FTE, Initiation Date, Shift(s), Meeting Frequency, Project Type (NX / ALIS / Other), Org Number (NX only), Additional Info (≤ 250 chars)
- FR-PROJ-03  Creator automatically gets EDIT access to their own project
- FR-PROJ-04  Admin sees all projects; regular users see only projects they have access to
- FR-PROJ-05  Admin can grant VIEW or EDIT permission per user per project
- FR-PROJ-06  A project can have up to 50 named processes
- FR-PROJ-07  Projects can be deleted by Admin only

### Stakeholders
- FR-STK-01  A project supports up to 20 stakeholders
- FR-STK-02  Stakeholder fields: Full Name, Job Title, Email, Phone, Department (optional), Category (Internal / External), Available on Teams, Influence Level (High / Medium / Low)
- FR-STK-03  Only users with EDIT permission can add/edit/delete stakeholders
- FR-STK-04  Stakeholders are listed in a sortable table on the project detail page

### Exports
- FR-EXP-01  Any user can export all accessible data to Excel (.xlsx)
- FR-EXP-02  Export contains 3 sheets: Projects, Stakeholders, Processes
- FR-EXP-03  Export filename includes the date: `StakeMatrix-Export-YYYY-MM-DD.xlsx`

### Admin
- FR-ADM-01  Admin can view all users with last-login timestamps
- FR-ADM-02  Admin can change any user's role, name, email, password
- FR-ADM-03  Admin can send a password-reset link from the user management page
- FR-ADM-04  Admin can run a self-test on the forgot-password flow from the UI
- FR-ADM-05  Admin can manage per-user, per-project access from the project access panel

### Email / Notifications
- FR-EMAIL-01  Monthly reminder sent every last Friday to all active users with EDIT rights
- FR-EMAIL-02  Password reset email sent via SendGrid; contains link valid for 1 hour
- FR-EMAIL-03  Invite email sent when admin creates a new user via "Invite User"

## Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Page load < 2 s on standard broadband |
| NFR-02 | Security | All routes protected by session; ADMIN routes double-checked server-side |
| NFR-03 | Security | RLS enabled on all Supabase tables |
| NFR-04 | Security | Reset tokens stored as SHA-256 hashes; raw token only in email link |
| NFR-05 | Availability | Hosted on Vercel; targets 99.9 % uptime |
| NFR-06 | Browser support | Chrome, Edge, Firefox, Safari (latest 2 versions) |
| NFR-07 | Responsiveness | Usable on tablet (768 px+); sidebar collapses on mobile |
| NFR-08 | Data limits | 20 stakeholders/project, 50 processes/project |

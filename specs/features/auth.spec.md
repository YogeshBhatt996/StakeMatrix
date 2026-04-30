# Feature Spec — Authentication

## Overview
All authentication uses NextAuth.js with a credentials provider. Sessions are JWT-based, stored in httpOnly cookies, and expire after 60 minutes of inactivity.

## Login
- Form: Email Address, Password
- Calls `signIn("credentials", { email, password, redirect: false })`
- Success → `/dashboard`
- Failure → inline error banner
- URL params handled:
  - `?registered=1` → green "Account created" banner
  - `?reason=idle` → amber "Signed out due to inactivity" banner

## Self-registration
- Fields: Full Name (required), Email (required), Password (required, min 8), Confirm Password (must match)
- `POST /api/auth/register`
- Duplicate email → "Email already registered."
- Success → attempts `signIn`; if successful redirects to `/dashboard`; if auto-login fails redirects to `/login?registered=1`

## Forgot password
- Field: Email Address
- `POST /api/auth/forgot-password`
- Always shows "Check your email" — never reveals if email exists
- Token: 32-byte random hex, stored as SHA-256 hash, expires in 1 hour
- Reset link: `/reset-password?token=<raw-token>`
- Reset form: New Password (min 8), Confirm Password
- `POST /api/auth/reset-password`
- On success: password updated, token cleared, redirect `/login`

## Inactivity auto-logout
- Activity events tracked: mousemove, mousedown, keydown, touchstart, scroll, click
- Any event resets the 60-minute clock
- At 55 minutes: warning modal with live countdown (MM:SS)
  - "Stay signed in" → resets clock
  - "Sign out now" → immediate signOut
- At 60 minutes: auto `signOut({ callbackUrl: "/login?reason=idle" })`

## Admin capabilities
- Invite user: creates account with temp password, sends invite email
- Send reset link: triggers same forgot-password flow for any user
- Deactivate user: sets `isActive = false`; user cannot log in
- Edit user: change name, email, role, password directly

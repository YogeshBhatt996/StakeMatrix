# API Spec — Auth

## POST /api/auth/register
Self-register a new account.

**Auth:** None (public)  
**Body:**
```json
{ "name": "string", "email": "string", "password": "string (min 8)" }
```
**Response 201:** `{ "ok": true }`  
**Response 400:** Validation error or `{ "error": "Email already registered." }`

## POST /api/auth/forgot-password
Request a password reset link.

**Auth:** None (public)  
**Body:** `{ "email": "string" }`  
**Response 200:** Always `{ "ok": true }` (no enumeration)  
**Side effect:** If email exists and account is active — stores SHA-256 token hash (1hr expiry) and sends reset email

## POST /api/auth/reset-password
Reset password using token from email.

**Auth:** None (public)  
**Body:** `{ "token": "string (raw hex)", "password": "string (min 8)" }`  
**Response 200:** `{ "ok": true }` — password updated, token cleared  
**Response 400:** `{ "error": "This reset link is invalid or has expired." }`

## GET /api/admin/test-reset
Run a self-test of the forgot-password / reset-password DB flow.

**Auth:** Required + ADMIN role  
**Response 200:**
```json
{
  "ok": true,
  "steps": [
    { "step": "Find admin user", "status": "pass", "detail": "Found: admin@example.com" },
    { "step": "Generate & store reset token", "status": "pass" },
    { "step": "Token lookup", "status": "pass" },
    { "step": "bcrypt hash (temp password)", "status": "pass" },
    { "step": "Restore original password & clear token", "status": "pass", "detail": "..." },
    { "step": "Confirm token cleared", "status": "pass" }
  ],
  "startedAt": "ISO string",
  "finishedAt": "ISO string"
}
```

## POST /api/profile
Update current user's profile.

**Auth:** Required  
**Body:** `{ "name"?, "email"?, "currentPassword"?, "newPassword"? }`  
**Response 200:** `{ "ok": true }`  
**Response 400:** Validation error  
**Response 401:** Incorrect current password

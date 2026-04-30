# Reviewer Agent

## Review checklist

### Security
- [ ] Every API route checks `session?.user` before proceeding
- [ ] Admin routes double-check `user.globalRole === "ADMIN"` server-side
- [ ] No sensitive data (passwordHash, reset tokens) returned in API responses
- [ ] No raw error stack traces surfaced to the client
- [ ] Input validated with Zod before DB operations
- [ ] Passwords hashed with bcrypt; reset tokens stored as SHA-256

### Database
- [ ] All queries go through Prisma (no raw SQL in app code)
- [ ] Cascade rules applied where appropriate (onDelete: Cascade)
- [ ] No N+1 queries — use `include` or `_count` instead of looping fetches
- [ ] New schema changes have corresponding SQL in `docs/ops/runbooks.md`

### Frontend
- [ ] `"use client"` added only when hooks/events are needed
- [ ] No external component library imports
- [ ] No `<img>` tags — use inline SVG; no `next/image` with external URLs
- [ ] Forms show loading state during submission
- [ ] Forms show human-readable error messages
- [ ] Required fields marked with `<span className="text-red-500">*</span>`
- [ ] Destructive actions confirmed with `confirm()`

### TypeScript
- [ ] No `any` types without a comment explaining why
- [ ] `SessionUser` used for `session.user` (not raw `session.user as any`)
- [ ] Zod inferred types used (`z.infer<typeof schema>`) rather than manual interfaces

### Build
- [ ] `npm run build` passes with zero errors
- [ ] No new TypeScript errors introduced

### Docs
- [ ] `context/current-state.md` updated if feature is complete
- [ ] `tasks/done.md` updated
- [ ] `docs/ops/runbooks.md` updated if schema changed

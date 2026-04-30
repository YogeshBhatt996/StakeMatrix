# Technical Decisions

## ADR-01 — Next.js 14 App Router
**Decision:** Use Next.js 14 with App Router instead of Pages Router.
**Rationale:** Server Components reduce client bundle size; nested layouts simplify auth guards; API routes co-located. Vercel deployment is zero-config.
**Trade-off:** More complex mental model (server vs client boundary); `useSearchParams` requires `<Suspense>` wrapper.

## ADR-02 — Supabase (PostgreSQL)
**Decision:** Use Supabase-hosted PostgreSQL.
**Rationale:** Managed hosting, SQL Editor for migrations, built-in RLS support, generous free tier. Direct Prisma connection via pgBouncer pooler (port 6543) works reliably.
**Trade-off:** Port 5432 blocked in some networks; must use `?pgbouncer=true` in DATABASE_URL.

## ADR-03 — Prisma ORM
**Decision:** Use Prisma over raw SQL or other ORMs.
**Rationale:** Type-safe queries, schema-as-code, automatic migrations, excellent TypeScript integration.
**Trade-off:** DLL locked on Windows when dev server is running — must stop server before `npm run build`.

## ADR-04 — NextAuth.js (credentials provider)
**Decision:** Custom credentials provider, not OAuth.
**Rationale:** Organisation controls user accounts; no dependency on Google/Microsoft tenant setup. JWT sessions avoid DB round-trips on every request.
**Trade-off:** Must handle password security ourselves (bcrypt, reset flows). OAuth could be added later.

## ADR-05 — Zod for validation
**Decision:** Validate all API input with Zod on the server.
**Rationale:** Type-safe, composable, produces useful error messages. `.partial()` used for update schemas.
**Note:** `.refine()` returns `ZodEffects`, not `ZodObject` — call `.partial()` on the base schema before adding refinements.

## ADR-06 — SendGrid for email
**Decision:** SendGrid over Nodemailer/Resend/Postmark.
**Rationale:** Already in use in the organisation; generous free tier (100 emails/day).
**Trade-off:** Requires a verified sender email; self-test cannot verify delivery without a real API key.

## ADR-07 — SheetJS (xlsx) for export
**Decision:** Client-side Excel generation with SheetJS.
**Rationale:** No server load; no file storage needed; works entirely in the browser from JSON API response.
**Trade-off:** Large library (~800 kB); dashboard page bundle is accordingly large.

## ADR-08 — Tailwind CSS (no component library)
**Decision:** Pure Tailwind; no shadcn/ui, no MUI.
**Rationale:** Full control over styles; no version conflicts; smaller bundle; easier to match exact brand colours.
**Trade-off:** More verbose JSX; no pre-built accessible components (must build them).

## ADR-09 — bcrypt (12 rounds)
**Decision:** bcrypt with 12 rounds for all password hashing.
**Rationale:** 12 rounds is the practical sweet spot between security and server load (~250ms on current hardware).

## ADR-10 — SHA-256 for reset tokens
**Decision:** Store only the SHA-256 hash of the reset token in the DB; send raw token only in the email.
**Rationale:** If DB is compromised, stored hashes cannot be used directly to reset passwords.

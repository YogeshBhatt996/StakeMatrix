# Backlog

> Items are roughly prioritised top-to-bottom within each section.

## High priority
- [ ] Configure SendGrid in Vercel env vars and verify email delivery end-to-end
- [ ] Set production NEXTAUTH_URL and NEXT_PUBLIC_APP_URL
- [ ] Stakeholder table search (filter by name / department / category / influence)
- [ ] Stakeholder table column sorting
- [ ] CSV bulk import for stakeholders

## Medium priority
- [ ] Export single project (not all projects)
- [ ] Audit log — record all create / update / delete events with user + timestamp
- [ ] Project archiving (soft-delete)
- [ ] Email notification when project access is granted
- [ ] Dashboard filters (by shift, project type)
- [ ] User avatar (initials fallback)
- [ ] Project notes / meeting log

## Low priority
- [ ] Stakeholder power-interest matrix (2×2 quadrant view)
- [ ] Printable project summary (PDF via browser print or server-side)
- [ ] Reorder stakeholders (drag-and-drop sortOrder)
- [ ] Reorder processes (drag-and-drop)
- [ ] Dark mode
- [ ] Stakeholder deduplication across projects

## Technical debt
- [ ] Add Playwright e2e test suite
- [ ] Add Jest unit tests for validators and permissions
- [ ] Add integration tests for API routes
- [ ] Add Docker + local PostgreSQL option
- [ ] Update Prisma from v5 to v7 (major upgrade guide required)

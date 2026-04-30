# Roadmap

## Now (active / in-flight)
- Configure SendGrid verified sender + API key in Vercel env vars
- Update NEXTAUTH_URL / NEXT_PUBLIC_APP_URL to production domain after first deploy
- Run Supabase SQL migrations for new schema columns

## Next (v1.1 — near-term)
- [ ] Stakeholder table: search/filter by name, department, category, influence
- [ ] Stakeholder table: sort by column (click header)
- [ ] Bulk import stakeholders via CSV upload
- [ ] Project-level "Notes" / meeting log
- [ ] Audit log: record who added/edited/deleted stakeholders
- [ ] User profile photo (avatar initials as fallback)

## Later (v1.2+)
- [ ] Email notifications when access is granted/revoked
- [ ] Project archiving (soft-delete, hidden from dashboard but restorable)
- [ ] Dashboard filters (by shift, project type, FTE range)
- [ ] Stakeholder influence / power-interest matrix view (2×2 grid)
- [ ] Printable project summary PDF
- [ ] Mobile-responsive full experience (currently tablet-first)

## Future consideration (v2)
- [ ] AI-generated stakeholder summary for a project
- [ ] Auto-suggest influence level based on job title + department
- [ ] Microsoft Teams integration (status indicator, direct message link)
- [ ] SSO / Azure AD authentication (replace credentials provider)
- [ ] Multi-tenant / organisation separation

## Parking lot (no timeline)
- Docker + local PostgreSQL option
- JIRA/Azure DevOps integration
- Automated test suite (Playwright e2e)
- Dark mode

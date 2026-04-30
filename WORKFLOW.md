# Development Workflow

## Daily development cycle

```
1. git pull origin main               # always start from latest
2. npm run dev                        # start dev server
3. Make changes
4. Test manually (see tests/test-cases.md)
5. Stop dev server  ← IMPORTANT on Windows before building
6. npm run build                      # must pass before committing
7. git add <specific files>
8. git commit -m "descriptive message"
9. git push origin main               # triggers Vercel auto-deploy
10. Monitor Vercel build in dashboard
```

## ⚠️ Windows build gotcha
The Next.js dev server holds `node_modules/.prisma/client/query_engine-windows.dll.node`.
**Always stop the dev server before running `npm run build`.**

```powershell
Stop-Process -Name "node" -Force   # kills all node processes
npm run build
```

## Branch strategy
This project uses a single `main` branch with direct commits.  
For larger changes, create a feature branch:
```bash
git checkout -b feature/short-description
# ... make changes ...
git push origin feature/short-description
# create PR on GitHub
```

## Making a schema change
1. Update `prisma/schema.prisma`
2. Write the equivalent `ALTER TABLE` SQL
3. Add SQL to `docs/ops/runbooks.md` under a new RB-XX entry
4. Update Zod validators in `src/lib/validators/`
5. Update affected API routes and UI pages
6. `npm run build` — confirm zero errors
7. **Ask Yogesh to run the SQL in Supabase SQL Editor** before the next deploy

## Adding a new feature
1. Add acceptance criteria to `docs/product/acceptance-criteria.md`
2. Add feature spec to `specs/features/`
3. Add API spec to `specs/api/` (if new endpoints)
4. Build the feature (follow `agents/instructions.md`)
5. Add manual test cases to `tests/test-cases.md`
6. Move task from `tasks/backlog.md` to `tasks/done.md`
7. Update `context/current-state.md`

## Deploying to production (Vercel)
Every push to `main` triggers an automatic Vercel deployment.  
Watch status at: https://vercel.com/dashboard

Post-deploy checklist:
- [ ] Check Vercel build logs for errors
- [ ] Verify app loads at production URL
- [ ] Run the forgot-password self-test (Admin → User Management → Run Self-Test)
- [ ] Check that `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` match the live domain

## Environment variable changes
1. Update `docs/ops/env-vars.md`
2. Update `.env.example`
3. Add/update in Vercel dashboard → Settings → Environment Variables
4. Trigger a redeploy (Vercel only picks up new env vars on deploy)

## Working with AI agents
See `agents/instructions.md` for the full set of rules.  
Use prompt templates in `agents/prompts/common.md` for consistent results.  
After any AI-assisted session: run `npm run build` and review all changes before committing.

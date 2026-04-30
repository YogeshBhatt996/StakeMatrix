# Common Prompts

## Add a new page

```
Add a new page at /[route] to this StakeMatrix Next.js 14 app.

Page purpose: [describe what the page shows/does]
Access: [ADMIN only | all authenticated users | public]
Data needed: [what Prisma models to query]
Actions: [what the user can do on this page]

Follow docs/design/ui-rules.md for styling and docs/design/copy-guidelines.md for wording.
After building, run npm run build and confirm zero errors.
```

## Add a new API route

```
Add a new API route [METHOD] /api/[path] to StakeMatrix.

Purpose: [what this endpoint does]
Auth required: [yes/no]
Role required: [ADMIN | any authenticated user]
Input: [fields and types]
Output: [what to return on success]
Validation: [Zod rules]

Follow the standard route structure in agents/backend-agent.md.
```

## Fix a bug

```
There is a bug in StakeMatrix at [page/route].

Steps to reproduce:
1. [step]
2. [step]

Expected: [what should happen]
Actual: [what happens instead]

Relevant files: [list files likely involved]

Read the files, identify the root cause, fix it, run npm run build to confirm.
```

## Update a UI component

```
Update [component path] in StakeMatrix.

Current behaviour: [describe]
Required change: [describe]

Follow docs/design/ui-rules.md and docs/design/design-system.md.
Do not introduce any external component libraries.
```

## Schema change

```
Add [field/table] to the StakeMatrix Prisma schema.

Field: [name, type, default, constraints]
Affected model: [User | Project | Stakeholder | etc.]

Steps required:
1. Update prisma/schema.prisma
2. Write ALTER TABLE SQL for docs/ops/runbooks.md
3. Update Zod validator in src/lib/validators/
4. Update affected API routes and UI pages
5. Run npm run build
```

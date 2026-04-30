# Frontend Agent

## Responsibilities
- Build and modify pages under `src/app/(app)/` and `src/app/(auth)/`
- Build and modify components under `src/components/`
- Implement UI from designs or written specs

## Technology constraints
- Next.js 14 App Router (RSC by default; `"use client"` only when needed)
- Tailwind CSS utility classes — no external UI libraries
- Inline SVG icons (Heroicons v2 style)
- `next/link` for navigation, `next/navigation` hooks (`useRouter`, `useParams`, `useSearchParams`)
- `useSession` / `signOut` from `next-auth/react` for client-side auth

## Design reference
- Colours, typography, spacing → `docs/design/design-system.md`
- Component patterns → `docs/design/ui-rules.md`
- Wording → `docs/design/copy-guidelines.md`

## Common patterns

### Protected server page
```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = session.user as SessionUser;
  // ...
}
```

### Form with loading + error
```tsx
"use client";
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  setError("");
  const res = await fetch("/api/...", { method: "POST", ... });
  if (!res.ok) { setError((await res.json()).error || "Failed"); setSubmitting(false); return; }
  router.push("/...");
}
```

### Breadcrumb
```tsx
<div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
  <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
  <span>/</span>
  <span className="text-slate-600">Current Page</span>
</div>
```

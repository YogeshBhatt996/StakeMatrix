# UI Rules

## General principles
1. **No external component libraries** — Tailwind utility classes only; no shadcn, MUI, etc.
2. **No external images** — Brand mark is an inline SVG. Use SVG icons inline.
3. **Server components by default** — only add `"use client"` when state/effects are needed.
4. **Never show raw error codes** — always surface human-readable messages.
5. **Always confirm destructive actions** — use `confirm()` for delete/remove before API calls.

## Forms
- Required fields marked with `<span className="text-red-500">*</span>`
- Validation errors shown as a red banner inside the form card, above the submit button
- Submit button text changes to `"Saving…"` / `"Creating…"` while `submitting === true`
- Submit button disabled while loading
- Character counters shown on textareas; turn amber at 90 % of limit

## Empty states
- Always show an SVG illustration + primary text + secondary help text
- Help text tells the user what action to take (never just "no data")

## Loading states
- Full-page loads: spinner SVG with `animate-spin` + muted text
- Button loads: spinner inside button, label changes to past-tense continuous

## Toasts / banners
- Success: `bg-emerald-50 border-emerald-200 text-emerald-700`
- Error: `bg-red-50 border-red-200 text-red-700`
- Warning (idle): `bg-amber-50 border-amber-200 text-amber-700`
- Banners always include a leading icon

## Tables
- Header: `bg-slate-50 text-xs uppercase tracking-wide font-semibold text-slate-600`
- Row hover: `hover:bg-slate-50 transition-colors`
- Alternating rows: every odd row gets `bg-slate-50/50`
- Wrap in `overflow-x-auto` for mobile

## Modals
- Overlay: `bg-black/40 backdrop-blur-sm` fullscreen fixed
- Modal card: `bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm`
- Always include an escape / dismiss button

## Breadcrumbs
- Format: `Dashboard / Project Name / Page`
- Each non-current segment is a Link with `hover:text-slate-600`
- Current segment: `text-slate-600` (not a link)

## Navigation
- Active sidebar link: `bg-indigo-50 text-indigo-700 font-medium`
- Inactive sidebar link: `text-slate-600 hover:bg-slate-100`

# Design System

## Brand colours

| Token | Hex | Usage |
|-------|-----|-------|
| `navy-dark` | `#0f2448` | Left panel gradient start |
| `navy` | `#1a3a6b` | Primary buttons, headers, sidebar |
| `navy-teal` | `#0d3d5c` | Gradient end, hover states |
| `teal` | `#2db8a0` | Accent, links, success states, brand mark |
| `blue-light` | `#4a90d9` | Secondary accent, hero copy highlight |
| `violet` | `#6b5acd` | Third avatar circle in brand mark |

## Tailwind semantic mapping

| Purpose | Class |
|---------|-------|
| Primary button | `bg-indigo-600 hover:bg-indigo-700 text-white` |
| Outline button | `border border-slate-300 hover:border-slate-400 text-slate-700` |
| Danger button | `border border-red-200 hover:bg-red-50 text-red-600` |
| Card container | `bg-white rounded-xl border border-slate-200` |
| Page background | `bg-slate-50` |
| Label text | `text-sm font-medium text-slate-700` |
| Secondary text | `text-slate-500` |
| Muted text | `text-slate-400` |
| Input field | `px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500` |

## Shift colour badges

| Shift | Badge class |
|-------|-------------|
| Day | `bg-sky-100 text-sky-700` |
| Afternoon | `bg-orange-100 text-orange-700` |
| Night | `bg-violet-100 text-violet-700` |
| Moonlight | `bg-indigo-100 text-indigo-700` |

## Project type badges

| Type | Badge class |
|------|-------------|
| NX | `bg-blue-100 text-blue-700` |
| ALIS | `bg-emerald-100 text-emerald-700` |
| Other | `bg-slate-200 text-slate-600` |

## Influence level badges

| Level | Colour |
|-------|--------|
| High | `text-red-500 font-medium` |
| Medium | `text-amber-500 font-medium` |
| Low | `text-emerald-500 font-medium` |

## Typography

- Font stack: System default (`Segoe UI`, `Arial`, sans-serif via Tailwind)
- Page headings: `text-2xl font-semibold text-slate-900`
- Section headings: `font-semibold text-slate-900`
- Body: `text-sm text-slate-600`
- Labels: `text-sm font-medium text-slate-700`
- Micro text: `text-xs text-slate-400 uppercase tracking-wide`

## Spacing & layout

- Max content width: `max-w-7xl mx-auto` (dashboard/lists), `max-w-2xl mx-auto` (forms)
- Card padding: `p-6`
- Form section spacing: `space-y-5`
- Grid gap: `gap-4` (2-col forms), `gap-5` (project cards)
- Sidebar width: `w-64` fixed on desktop, slide-over on mobile

## Border radius

- Cards, modals: `rounded-xl`
- Inputs, buttons: `rounded-lg`
- Badges: `rounded-full`
- Tags/chips: `rounded-lg`

## Iconography

All icons: Heroicons v2 style (`fill="none" stroke="currentColor" strokeWidth={2}`)
- No icon libraries imported — inline SVG only

# Feature Spec — Dashboard

## Overview
The dashboard (`/dashboard`) is the landing page after login. It gives a summary of all accessible projects and aggregate stats.

## Stats bar
Four stat tiles:
- Total Projects (indigo)
- Total Stakeholders (emerald)
- Signed FTEs (sky)
- Deployed FTEs (amber)

## Action buttons
- **Export Excel** — downloads `StakeMatrix-Export-YYYY-MM-DD.xlsx` (all accessible data)
- **New Project** — navigates to `/projects/new` (all authenticated users)

## Project cards
Grid: 1 col → 2 col (md) → 3 col (xl)

Each card shows:
- Project name (link to detail page)
- Shift badge(s) (coloured pills; multiple allowed)
- Org Number (if NX project)
- Signed FTE, Deployed FTE, Stakeholders (N/20), Processes (N/50)
- Meeting frequency
- Initiation date

Cards are ordered by `createdAt DESC`.

## Empty state
If no projects accessible: SVG illustration + "No projects yet" + "Click New Project to create your first project."

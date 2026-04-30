# Project Brief

## What is StakeMatrix?
StakeMatrix is an internal web application for managing Stakeholder Registers across multiple projects. It replaces disconnected spreadsheets with a single, access-controlled, always-current register that any authorised team member can view or edit from a browser.

## Who uses it?
- **Project Managers** — create projects, maintain stakeholder lists, track FTEs
- **Team Members** — view and contribute to their assigned projects
- **Administrators** — onboard users, control project access, export data

## Why does it exist?
The Kaizen / Dyad project portfolio spans multiple concurrent initiatives. Each project had its own stakeholder spreadsheet, maintained locally by different people, with no consistent format and no history. StakeMatrix brings all of them into one tool with role-based access and automated reminders.

## Business context
- Internal tool for a professional services team
- Data sensitivity: medium (names, job titles, contact details — no PII beyond standard business contacts)
- Compliance: no regulatory requirements; good security hygiene expected (RLS, hashed passwords, session expiry)

## Stakeholders of this tool
| Name | Role |
|------|------|
| Yogesh Bhatt | Owner / Admin |
| Project team | End users |

## Constraints
- Must run on Vercel (no self-hosted server)
- Database must be Supabase (PostgreSQL)
- No budget for paid LLM APIs in v1
- Must work in Chrome/Edge on Windows laptops

## Timeline
- v1.0 shipped: April–May 2026
- Ongoing: feature iterations as needed

# Copy Guidelines

## Tone of voice
- **Professional but friendly** — not corporate-stiff, not casual
- **Direct** — tell the user exactly what to do or what happened
- **Concise** — labels and messages should fit in one line where possible

## Terminology (use consistently)

| Use | Don't use |
|-----|-----------|
| Stakeholder | Contact, Person |
| Project | Initiative, Engagement |
| Department | Organisation, Org (in UI labels) |
| Influence Level | Power, Seniority |
| Signed FTEs | Contracted FTEs, Budgeted FTEs |
| Deployed FTEs | Active FTEs, Used FTEs |
| NX Project | NX-type, Next-gen project |
| ALIS Project | ALIS-type |
| Microsoft Teams | Teams (capitalised), MS Teams |
| Admin | Administrator, Super user |
| VIEW / EDIT | Read / Write, Viewer / Editor |

## Button labels
- Primary action: verb + noun — `Add Stakeholder`, `Create Project`, `Save Changes`
- Cancel: always `Cancel` (not "Go back", "Discard")
- Delete/remove: `Remove Stakeholder`, `Delete Project` (not just "Delete")
- Loading: append `…` — `Saving…`, `Creating…`, `Exporting…`

## Validation messages

| Situation | Message |
|-----------|---------|
| Required field empty | `[Field] is required` |
| Invalid email | `Valid email required` |
| Password too short | `Password must be at least 8 characters` |
| Org Number missing for NX | `Org Number is required for NX Projects` |
| No shift selected | `Please select at least one shift` |
| Text too long | `Maximum [N] characters` |
| Duplicate process name | `Process already exists` |

## Error messages (API)
- `Unauthorized` → shown as "Please sign in to continue."
- `Forbidden` → do not show; redirect or 404 instead
- Generic server error → "An unexpected error occurred. Please try again."
- Always show the human-readable message from `data.error`; never show stack traces

## Tagline
**"Organize · Engage · Deliver"** — used in login page footer and mobile brand mark. Keep punctuation exactly as shown (middle dot `·`, not hyphen or pipe).

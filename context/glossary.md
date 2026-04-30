# Glossary

| Term | Definition |
|------|------------|
| **StakeMatrix** | The name of this application |
| **Stakeholder** | Any person relevant to a project — internal staff or external contacts |
| **Stakeholder Register** | The complete list of stakeholders for a given project, including their details and influence |
| **FTE** | Full-Time Equivalent — a measure of workforce capacity (1.0 = one full-time person) |
| **Signed FTE** | The number of FTEs contractually committed to a project |
| **Deployed FTE** | The number of FTEs currently active / on-the-ground for a project |
| **Influence Level** | A classification of a stakeholder's power or impact: High, Medium, or Low |
| **Category** | Whether a stakeholder is Internal (part of the organisation) or External (client, vendor, etc.) |
| **Department** | The organisational unit a stakeholder belongs to (maps to the `organization` DB field) |
| **NX Project** | A specific project type requiring an Org Number; triggers the `isNXProject` flag |
| **ALIS Project** | A specific project type; triggers the `isALISProject` flag |
| **Shift** | The working time band for a project: Day, Afternoon, Night, Moonlight |
| **Meeting Frequency** | How often the project team meets with the client: Daily, Weekly, Bi-Weekly, Monthly |
| **Process** | A named work stream or activity within a project (up to 50 per project) |
| **GlobalRole** | System-wide user role: ADMIN (full access) or USER (access granted per project) |
| **ProjectPermission** | Per-project access level: VIEW (read-only) or EDIT (can add/edit/delete) |
| **ProjectAccess** | A record linking a User to a Project with a specific permission level |
| **pgBouncer** | Supabase's connection pooler; accessed on port 6543 with `?pgbouncer=true` |
| **RSC** | React Server Component — renders on the server, no JS sent to client |
| **ADR** | Architecture Decision Record — a documented technical decision |
| **RLS** | Row Level Security — PostgreSQL feature to restrict table access by role |

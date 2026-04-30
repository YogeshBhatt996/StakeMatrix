# Feature Spec — Projects

## Create project
Route: `/projects/new`  
Access: All authenticated users

Fields:
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| Project Name | Text | Yes | Max 200 chars |
| Signed FTEs | Number | Yes | Integer ≥ 0 |
| Deployed FTEs | Number | Yes | Integer ≥ 0 |
| Initiation Date | Date picker | Yes | |
| Shift | Checkboxes (multi) | Yes | At least 1 of: Day, Afternoon, Night, Moonlight |
| Meeting Frequency | Dropdown | Yes | Daily, Weekly, Bi-Weekly, Monthly |
| NX Project | Checkbox | No | If checked → Org Number required |
| ALIS Project | Checkbox | No | |
| Other | Checkbox | No | |
| Org Number | Text | Conditional | Required if NX Project; max 50 |
| Processes | Tags input | No | Up to 50; each max 200 chars; unique per project |
| Additional Info | Textarea | No | Max 250 chars; counter shown |

Post-create: if creator is not ADMIN → `ProjectAccess(EDIT)` auto-created

## Edit project
Route: `/projects/:id/edit`  
Access: EDIT permission on project

Same fields as create. Existing processes shown as removable tags.

## Project detail page
Route: `/projects/:id`  
Access: VIEW permission

Sections:
1. **Project Information** — all fields displayed as label/value pairs + coloured shift badges + project type badges + additional info
2. **Processes** — chips with count (N/50)
3. **Stakeholder Register** — table (see stakeholders spec)

Action buttons (EDIT only): Edit Project, Add Stakeholder

## Permissions model
- ADMIN sees all projects, all actions
- User who created a project → auto EDIT access
- Other users → only see projects where admin granted VIEW or EDIT
- VIEW users: read-only; no Edit/Add buttons
- EDIT users: full create/edit/delete on stakeholders; edit project details

# API Spec — Projects

## GET /api/projects
Returns all projects accessible to the current user.

**Auth:** Required  
**Response 200:**
```json
[{
  "id": "uuid",
  "name": "Project Alpha",
  "signedFTECount": 5,
  "deployedFTECount": 3,
  "initiationDate": "2026-01-15T00:00:00.000Z",
  "isNXProject": true,
  "isALISProject": false,
  "isOtherProject": false,
  "orgNumber": "NX-12345",
  "shifts": ["DAY", "AFTERNOON"],
  "meetingFrequency": "WEEKLY",
  "additionalInfo": "Some notes",
  "createdById": "uuid",
  "createdBy": { "id": "uuid", "name": "Jane", "email": "jane@co.com" },
  "_count": { "stakeholders": 4, "processes": 7 },
  "createdAt": "...", "updatedAt": "..."
}]
```

## POST /api/projects
Create a new project.

**Auth:** Required (any role)  
**Body:**
```json
{
  "name": "string (required, max 200)",
  "signedFTECount": "number (int, ≥ 0)",
  "deployedFTECount": "number (int, ≥ 0)",
  "initiationDate": "ISO datetime string",
  "isNXProject": "boolean",
  "isALISProject": "boolean",
  "isOtherProject": "boolean",
  "orgNumber": "string? (required if isNXProject, max 50)",
  "shifts": "Shift[] (min 1: DAY|AFTERNOON|NIGHT|MOONLIGHT)",
  "meetingFrequency": "DAILY|WEEKLY|BI_WEEKLY|MONTHLY",
  "additionalInfo": "string? (max 250)"
}
```
**Response 201:** Created project object  
**Side effect:** Non-admin creators get `ProjectAccess(EDIT)` auto-created

## GET /api/projects/:id
Returns a single project with processes, stakeholders, access list.

**Auth:** Required + VIEW access  
**Response 200:** Full project object including `processes[]`, `stakeholders[]`, `access[]`  
**Response 403:** Forbidden  
**Response 404:** Not found

## PUT /api/projects/:id
Update a project.

**Auth:** Required + EDIT access  
**Body:** Same as POST (all fields optional / partial)  
**Response 200:** Updated project

## DELETE /api/projects/:id
Delete a project and all associated data.

**Auth:** Required + ADMIN role  
**Response 200:** `{ "success": true }`

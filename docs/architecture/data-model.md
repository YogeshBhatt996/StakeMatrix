# Data Model

## Entity relationship diagram

```
User ─────────────────────────────┐
 │  id, email, name               │
 │  passwordHash, globalRole      │
 │  isActive, lastLoginAt         │
 │  passwordResetToken/Expiry     │
 │                                │
 ├──< ProjectAccess >─────────────┤
 │    projectId, userId           │
 │    permission (VIEW|EDIT)      │
 │                                │
 └──< Project (createdById)       │
       id, name                   │
       signedFTECount             │
       deployedFTECount           │
       initiationDate             │
       isNXProject, isALISProject │
       isOtherProject             │
       orgNumber                  │
       shifts (Shift[])           │
       meetingFrequency           │
       additionalInfo             │
       createdById ───────────────┘
       │
       ├──< Stakeholder
       │     id, projectId
       │     name, jobTitle, email, phone
       │     organization (department)
       │     category (INTERNAL|EXTERNAL)
       │     availableOnTeams
       │     influenceLevel (HIGH|MEDIUM|LOW)
       │
       └──< Process
             id, projectId
             name, sortOrder
```

## Enums

```prisma
enum GlobalRole        { ADMIN  USER }
enum ProjectPermission { VIEW   EDIT }
enum Shift             { DAY  AFTERNOON  NIGHT  MOONLIGHT }
enum MeetingFrequency  { DAILY  WEEKLY  BI_WEEKLY  MONTHLY }
enum StakeholderCategory { INTERNAL  EXTERNAL }
enum InfluenceLevel    { HIGH  MEDIUM  LOW }
```

## Models (full)

### User
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| email | String | Unique, indexed |
| name | String | |
| passwordHash | String? | bcrypt 12 rounds |
| globalRole | GlobalRole | Default: USER |
| isActive | Boolean | Default: true |
| lastLoginAt | DateTime? | Updated on sign-in |
| passwordResetToken | String? | SHA-256 hash, unique |
| passwordResetTokenExpiry | DateTime? | 1-hour window |
| createdAt / updatedAt | DateTime | Auto |

### Project
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| name | String | |
| signedFTECount | Int | ≥ 0 |
| deployedFTECount | Int | ≥ 0 |
| initiationDate | DateTime | |
| isNXProject | Boolean | Default: false |
| isALISProject | Boolean | Default: false |
| isOtherProject | Boolean | Default: false |
| orgNumber | String? | Required if isNXProject |
| shifts | Shift[] | PostgreSQL array; min 1 |
| meetingFrequency | MeetingFrequency | |
| additionalInfo | String? | Max 250 chars |
| createdById | String | FK → User |
| createdAt / updatedAt | DateTime | Auto |

### Stakeholder
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| projectId | String | FK → Project (cascade delete) |
| name | String | |
| jobTitle | String | |
| email | String | |
| phone | String | |
| organization | String | Department; optional |
| category | StakeholderCategory | |
| availableOnTeams | Boolean | Default: false |
| influenceLevel | InfluenceLevel | |
| createdAt / updatedAt | DateTime | Auto |

### ProjectAccess
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| projectId | String | FK → Project (cascade delete) |
| userId | String | FK → User (cascade delete) |
| permission | ProjectPermission | VIEW or EDIT |
| grantedAt | DateTime | Auto |
| ─ | ─ | Unique: (projectId, userId) |

### Process
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| projectId | String | FK → Project (cascade delete) |
| name | String | |
| sortOrder | Int | Default: 0 |
| ─ | ─ | Unique: (projectId, name) |

### EmailLog
| Column | Type | Notes |
|--------|------|-------|
| id | String (UUID) | PK |
| triggeredAt | DateTime | Auto |
| recipientCount | Int | |
| status | String | "success" or error message |
| notes | String? | |

## Cascade rules
- Deleting a `Project` → deletes all `Stakeholder`, `Process`, `ProjectAccess` records
- Deleting a `User` → deletes their `ProjectAccess` and `Session` records

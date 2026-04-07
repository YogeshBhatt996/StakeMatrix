# Stakeholder Register — Requirements Document

**Version:** 1.0
**Date:** 2026-03-24
**Status:** Approved

---

## 1. OVERVIEW

A centralized, multi-user web application to manage Stakeholder Registers across multiple projects. The system supports role-based access control, automated monthly email reminders, and a professional dashboard interface.

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Project Management

| ID | Requirement |
|----|-------------|
| FR-01 | The system shall allow creation of multiple projects. |
| FR-02 | Each project shall capture: Name, Signed FTE Count, Deployed FTE Count, Project Initiation Date, Shift, and Client Meeting Frequency. |
| FR-03 | Each project shall optionally capture an Org Number — this field is only visible and required when the project is marked as an NX Project. |
| FR-04 | Each project shall support up to **50 named processes**. |
| FR-05 | Shift shall be a dropdown with values: Day, Afternoon, Night, Moonlight. |
| FR-06 | Client Meeting Frequency shall be a dropdown with values: Daily, Weekly, Bi-Weekly, Monthly. |
| FR-07 | Projects shall be editable by users with Edit permission on that project. |
| FR-08 | Projects shall be deletable only by Admin users. |

### 2.2 Stakeholder Management

| ID | Requirement |
|----|-------------|
| FR-09 | Each project shall support up to **20 stakeholders**. |
| FR-10 | Each stakeholder record shall capture: Name, Job Title, Email, Phone, Organization, Category (Internal/External), Available on Teams (Yes/No), and Influence/Power Level (High/Medium/Low). |
| FR-11 | Stakeholders shall be addable, editable, and deletable by users with Edit permission. |
| FR-12 | Influence Level shall be visually color-coded: High = Red, Medium = Amber, Low = Green. |

### 2.3 User & Access Management

| ID | Requirement |
|----|-------------|
| FR-13 | The system shall have two global roles: **Admin** and **User**. |
| FR-14 | Admin shall be able to invite users by email address. |
| FR-15 | Admin shall be able to assign per-project permissions: **View** or **Edit**. |
| FR-16 | Admin shall be able to revoke access at any time. |
| FR-17 | Admin shall be able to deactivate user accounts without deleting them. |
| FR-18 | Users shall only see projects they have been granted access to. |

### 2.4 Automated Email Reminders

| ID | Requirement |
|----|-------------|
| FR-19 | The system shall automatically send a reminder email on the **last Friday of every calendar month**. |
| FR-20 | The reminder email shall be sent to all users with **Edit** permission on any project, plus all Admin users. |
| FR-21 | The email shall include a direct link to the Stakeholder Register dashboard. |
| FR-22 | Each email send event shall be logged (recipient count, timestamp, status). |

### 2.5 Dashboard & Interface

| ID | Requirement |
|----|-------------|
| FR-23 | The dashboard shall display all accessible projects as cards with key summary information. |
| FR-24 | The dashboard shall display aggregate statistics: total projects, total stakeholders, total FTEs. |
| FR-25 | The interface shall be responsive and usable on desktop and mobile. |
| FR-26 | The interface shall be formal, professional, and visually pleasing. |

---

## 3. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement |
|----|-------------|
| NFR-01 | **Security**: All routes shall require authentication. Admin routes shall require Admin role. |
| NFR-02 | **Security**: All API inputs shall be validated server-side using Zod schemas. |
| NFR-03 | **Performance**: Page load time shall be under 2 seconds on a standard broadband connection. |
| NFR-04 | **Availability**: System shall target 99.9% uptime via Vercel platform SLA. |
| NFR-05 | **Scalability**: System shall support up to 500 projects and 1,000 users without degradation. |
| NFR-06 | **Data Integrity**: Deletion of a project shall cascade-delete all related processes, stakeholders, and access records. |
| NFR-07 | **Auditability**: Email send events shall be persisted in an EmailLog table. |

---

## 4. CONSTRAINTS

- Org Number field is exclusive to NX Projects.
- Maximum 50 processes per project (enforced at API layer).
- Maximum 20 stakeholders per project (enforced at API layer).
- Automated email trigger uses last-Friday detection — not a static date.
- Users cannot self-register; they must be invited by an Admin.

---

## 5. OUT OF SCOPE (v1.0)

- Real-time collaborative editing (WebSockets)
- File attachments on stakeholder records
- Audit trail / change history log
- SSO / SAML integration
- Mobile native app

-- ============================================================
-- StakeMatrix — Full Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── ENUMS ──────────────────────────────────────────────────
CREATE TYPE "GlobalRole" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "ProjectPermission" AS ENUM ('VIEW', 'EDIT');
CREATE TYPE "Shift" AS ENUM ('DAY', 'AFTERNOON', 'NIGHT', 'MOONLIGHT');
CREATE TYPE "MeetingFrequency" AS ENUM ('DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY');
CREATE TYPE "StakeholderCategory" AS ENUM ('INTERNAL', 'EXTERNAL');
CREATE TYPE "InfluenceLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- ─── TABLES ─────────────────────────────────────────────────
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "globalRole" "GlobalRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "signedFTECount" INTEGER NOT NULL,
    "deployedFTECount" INTEGER NOT NULL,
    "initiationDate" TIMESTAMP(3) NOT NULL,
    "isNXProject" BOOLEAN NOT NULL DEFAULT false,
    "orgNumber" TEXT,
    "shift" "Shift" NOT NULL,
    "meetingFrequency" "MeetingFrequency" NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Process" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Stakeholder" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "category" "StakeholderCategory" NOT NULL,
    "availableOnTeams" BOOLEAN NOT NULL DEFAULT false,
    "influenceLevel" "InfluenceLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectAccess" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "ProjectPermission" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectAccess_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- ─── INDEXES ────────────────────────────────────────────────
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Project_name_idx" ON "Project"("name");
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");
CREATE INDEX "Process_projectId_idx" ON "Process"("projectId");
CREATE UNIQUE INDEX "Process_projectId_name_key" ON "Process"("projectId", "name");
CREATE INDEX "Stakeholder_projectId_idx" ON "Stakeholder"("projectId");
CREATE INDEX "ProjectAccess_userId_idx" ON "ProjectAccess"("userId");
CREATE INDEX "ProjectAccess_projectId_idx" ON "ProjectAccess"("projectId");
CREATE UNIQUE INDEX "ProjectAccess_projectId_userId_key" ON "ProjectAccess"("projectId", "userId");

-- ─── FOREIGN KEYS ───────────────────────────────────────────
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Process" ADD CONSTRAINT "Process_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectAccess" ADD CONSTRAINT "ProjectAccess_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectAccess" ADD CONSTRAINT "ProjectAccess_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── PRISMA MIGRATIONS TRACKING ─────────────────────────────
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
VALUES (
    gen_random_uuid()::text,
    'manual',
    NOW(),
    '20260101000000_init',
    1
);

-- ─── SEED: ADMIN USER ───────────────────────────────────────
-- Default credentials: admin@yourdomain.com / Admin@123456
-- IMPORTANT: Change this email and password immediately after first login.
INSERT INTO "User" ("id", "email", "name", "passwordHash", "globalRole", "isActive", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@yourdomain.com',
    'System Administrator',
    '$2a$12$VIy9JFBjFr2k2XeVARYSjeK1a6BkbMmrOOU/tiN8BpK8S3h6dEkUK',
    'ADMIN',
    true,
    NOW(),
    NOW()
);

import type {
  User,
  Project,
  Process,
  Stakeholder,
  ProjectAccess,
  GlobalRole,
  ProjectPermission,
  Shift,
  MeetingFrequency,
  StakeholderCategory,
  InfluenceLevel,
} from "@prisma/client";

export type {
  User,
  Project,
  Process,
  Stakeholder,
  ProjectAccess,
  GlobalRole,
  ProjectPermission,
  Shift,
  MeetingFrequency,
  StakeholderCategory,
  InfluenceLevel,
};

export type ProjectWithDetails = Project & {
  processes: Process[];
  stakeholders: Stakeholder[];
  access: (ProjectAccess & { user: Pick<User, "id" | "name" | "email"> })[];
  createdBy: Pick<User, "id" | "name" | "email">;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  globalRole: GlobalRole;
};

export type UserWithAccess = User & {
  projectAccess: (ProjectAccess & { project: Pick<Project, "id" | "name"> })[];
};

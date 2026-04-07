import { prisma } from "@/lib/prisma";
import { GlobalRole, ProjectPermission } from "@prisma/client";

/**
 * Check if a user has at least the required permission on a project.
 * Admins always pass. Users need a matching ProjectAccess record.
 */
export async function hasProjectAccess(
  userId: string,
  projectId: string,
  required: ProjectPermission
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) return false;
  if (user.globalRole === GlobalRole.ADMIN) return true;

  const access = await prisma.projectAccess.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (!access) return false;
  if (required === ProjectPermission.VIEW) return true; // VIEW or EDIT both grant view
  return access.permission === ProjectPermission.EDIT;
}

/**
 * Get all project IDs a user has any access to.
 */
export async function getAccessibleProjectIds(userId: string): Promise<string[] | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) return null;
  if (user.globalRole === GlobalRole.ADMIN) return null; // null = all projects

  const accesses = await prisma.projectAccess.findMany({
    where: { userId },
    select: { projectId: true },
  });

  return accesses.map((a) => a.projectId);
}

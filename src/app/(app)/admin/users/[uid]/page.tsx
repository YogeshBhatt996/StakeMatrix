import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import type { SessionUser } from "@/types";
import { ManageUserClient } from "./ManageUserClient";

export default async function ManageUserPage({ params }: { params: { uid: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const currentUser = session.user as SessionUser;
  if (currentUser.globalRole !== "ADMIN") redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: params.uid },
    select: {
      id: true,
      name: true,
      email: true,
      globalRole: true,
      isActive: true,
      createdAt: true,
      projectAccess: {
        select: {
          projectId: true,
          permission: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const allProjects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const isSelf = currentUser.id === params.uid;

  return (
    <ManageUserClient
      user={user}
      allProjects={allProjects}
      isSelf={isSelf}
    />
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { SessionUser } from "@/types";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as SessionUser;
  if (user.globalRole !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      globalRole: true,
      isActive: true,
      createdAt: true,
      _count: { select: { projectAccess: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} user{users.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Link
          href="/admin/users/invite"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite User
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["Name", "Email", "Role", "Projects", "Status", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.globalRole === "ADMIN"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {u.globalRole}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{u._count.projectAccess}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

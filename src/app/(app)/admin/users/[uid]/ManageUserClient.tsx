"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Permission = "VIEW" | "EDIT" | "NONE";

interface UserData {
  id: string;
  name: string;
  email: string;
  globalRole: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: Date | string;
  projectAccess: {
    projectId: string;
    permission: "VIEW" | "EDIT";
    project: { id: string; name: string };
  }[];
}

interface ProjectOption {
  id: string;
  name: string;
}

interface Props {
  user: UserData;
  allProjects: ProjectOption[];
  isSelf: boolean;
}

export function ManageUserClient({ user, allProjects, isSelf }: Props) {
  const router = useRouter();

  const [isActive, setIsActive] = useState(user.isActive);
  const [globalRole, setGlobalRole] = useState<"ADMIN" | "USER">(user.globalRole);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Build a map: projectId -> current permission
  const [permissions, setPermissions] = useState<Record<string, Permission>>(() => {
    const map: Record<string, Permission> = {};
    for (const proj of allProjects) {
      const access = user.projectAccess.find((a) => a.projectId === proj.id);
      map[proj.id] = access ? access.permission : "NONE";
    }
    return map;
  });

  const [savingAccess, setSavingAccess] = useState<Record<string, boolean>>({});
  const [accessMessages, setAccessMessages] = useState<Record<string, string>>({});

  async function saveProfile() {
    setSavingProfile(true);
    setProfileMessage("");

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive, globalRole }),
    });

    if (res.ok) {
      setProfileMessage("Profile updated successfully.");
    } else {
      const data = await res.json();
      setProfileMessage(data.error || "Failed to update profile.");
    }
    setSavingProfile(false);
  }

  async function handlePermissionChange(projectId: string, newPerm: Permission) {
    const prev = permissions[projectId];
    setPermissions((p) => ({ ...p, [projectId]: newPerm }));
    setSavingAccess((s) => ({ ...s, [projectId]: true }));
    setAccessMessages((m) => ({ ...m, [projectId]: "" }));

    try {
      if (newPerm === "NONE") {
        const res = await fetch(
          `/api/projects/${projectId}/access?userId=${user.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error();
        setAccessMessages((m) => ({ ...m, [projectId]: "Access removed." }));
      } else {
        const res = await fetch(`/api/projects/${projectId}/access`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, permission: newPerm }),
        });
        if (!res.ok) throw new Error();
        setAccessMessages((m) => ({ ...m, [projectId]: `Set to ${newPerm}.` }));
      }
    } catch {
      setPermissions((p) => ({ ...p, [projectId]: prev }));
      setAccessMessages((m) => ({ ...m, [projectId]: "Failed to update." }));
    }

    setSavingAccess((s) => ({ ...s, [projectId]: false }));
  }

  async function deactivateUser() {
    if (!confirm(`Deactivate ${user.name}? They will no longer be able to log in.`)) return;

    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/users");
    } else {
      const data = await res.json();
      setProfileMessage(data.error || "Failed to deactivate user.");
    }
  }

  const accessCount = Object.values(permissions).filter((p) => p !== "NONE").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
          <Link href="/admin/users" className="hover:text-slate-600">
            User Management
          </Link>
          <span>/</span>
          <span className="text-slate-600">{user.name}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                globalRole === "ADMIN"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {globalRole}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
          Account Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Global Role</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Admins have full access to all projects and user management.
              </p>
            </div>
            <select
              value={globalRole}
              onChange={(e) => setGlobalRole(e.target.value as "ADMIN" | "USER")}
              disabled={isSelf}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Account Status</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Inactive users cannot log in but their data is retained.
              </p>
            </div>
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              disabled={isSelf}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {isSelf && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              You cannot change the role or status of your own account.
            </p>
          )}
        </div>

        {profileMessage && (
          <div
            className={`mt-4 text-sm rounded-lg px-4 py-3 ${
              profileMessage.includes("successfully")
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {profileMessage}
          </div>
        )}

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
          {!isSelf && isActive ? (
            <button
              type="button"
              onClick={deactivateUser}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors"
            >
              Deactivate Account
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile || isSelf}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Project Access */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">Project Access</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {accessCount} of {allProjects.length} projects accessible
            </p>
          </div>
          {globalRole === "ADMIN" && (
            <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full font-medium">
              Admin — access to all projects
            </span>
          )}
        </div>

        {allProjects.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No projects exist yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Project
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide w-48">
                  Permission
                </th>
                <th className="px-6 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {allProjects.map((project, i) => {
                const perm = permissions[project.id] ?? "NONE";
                const saving = savingAccess[project.id];
                const msg = accessMessages[project.id];

                return (
                  <tr
                    key={project.id}
                    className={`border-b border-slate-100 ${
                      i % 2 === 0 ? "" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="px-6 py-3 font-medium text-slate-800">{project.name}</td>
                    <td className="px-6 py-3">
                      <select
                        value={perm}
                        onChange={(e) =>
                          handlePermissionChange(project.id, e.target.value as Permission)
                        }
                        disabled={saving || globalRole === "ADMIN"}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="NONE">No Access</option>
                        <option value="VIEW">View</option>
                        <option value="EDIT">Edit</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      {saving ? (
                        <span className="text-xs text-slate-400">Saving…</span>
                      ) : msg ? (
                        <span
                          className={`text-xs font-medium ${
                            msg.includes("Failed")
                              ? "text-red-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {msg}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Footer */}
      <div className="text-xs text-slate-400 text-right">
        Account created {new Date(user.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

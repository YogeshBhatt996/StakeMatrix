"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import type { SessionUser } from "@/types";

type Section = "details" | "password";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user as SessionUser | undefined;

  // ── Profile details ────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Password change ────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [activeSection, setActiveSection] = useState<Section>("details");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setDetailsMsg(null);
    setDetailsLoading(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim() }),
    });

    setDetailsLoading(false);

    if (res.ok) {
      setDetailsMsg({ type: "ok", text: "Profile updated successfully." });
      // Trigger NextAuth session refresh so name/email update in the sidebar
      await updateSession({ name: name.trim(), email: email.trim() });
    } else {
      const data = await res.json().catch(() => ({}));
      setDetailsMsg({ type: "err", text: (data as { error?: string }).error || "Failed to update profile." });
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "err", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    setPasswordLoading(false);

    if (res.ok) {
      setPasswordMsg({ type: "ok", text: "Password updated. You may need to sign in again." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const data = await res.json().catch(() => ({}));
      setPasswordMsg({ type: "err", text: (data as { error?: string }).error || "Failed to update password." });
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and password.</p>
      </div>

      {/* User summary card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-semibold flex-shrink-0">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">{user.name}</p>
          <p className="text-slate-500 text-sm truncate">{user.email}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
            user.globalRole === "ADMIN"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {user.globalRole}
        </span>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {(["details", "password"] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeSection === s
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s === "details" ? "Account Details" : "Change Password"}
          </button>
        ))}
      </div>

      {/* ── Account Details ─────────────────────────────────── */}
      {activeSection === "details" && (
        <form onSubmit={saveDetails} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Account Details
          </h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {detailsMsg && (
            <div
              className={`text-sm rounded-lg px-4 py-3 ${
                detailsMsg.type === "ok"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {detailsMsg.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={detailsLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {detailsLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* ── Change Password ──────────────────────────────────── */}
      {activeSection === "password" && (
        <form onSubmit={savePassword} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Change Password
          </h2>

          <div>
            <label htmlFor="current" className="block text-sm font-medium text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="newpwd" className="block text-sm font-medium text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              id="newpwd"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmpwd" className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirmpwd"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {passwordMsg && (
            <div
              className={`text-sm rounded-lg px-4 py-3 ${
                passwordMsg.type === "ok"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-slate-400">
              After changing your password you may be signed out.
            </p>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {passwordLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* Sign out */}
      <div className="text-right">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
          Sign out of all devices
        </button>
      </div>
    </div>
  );
}

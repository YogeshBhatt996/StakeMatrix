"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InviteUserPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(" ")
            : data.error || "Failed to invite user.";
        setError(msg);
        setSubmitting(false);
        return;
      }

      setSuccess(
        `${data.name} has been invited. A temporary password has been sent to ${data.email}.`
      );
      setName("");
      setEmail("");
      setSubmitting(false);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
          <Link href="/admin/users" className="hover:text-slate-600">
            User Management
          </Link>
          <span>/</span>
          <span className="text-slate-600">Invite User</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Invite User</h1>
        <p className="text-slate-500 text-sm mt-1">
          The user will receive an email with a temporary password. They must change it upon first
          login.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="jane@company.com"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              A temporary password will be emailed to this address.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
              {success}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Link
              href="/admin/users"
              className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Back to Users
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {submitting ? "Sending Invite…" : "Send Invite"}
            </button>
          </div>
        </form>
      </div>

      {success && (
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/admin/users")}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Return to User Management →
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Category = "INTERNAL" | "EXTERNAL";
type InfluenceLevel = "HIGH" | "MEDIUM" | "LOW";

export default function EditStakeholderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const stakeholderId = params.sid as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stakeholderName, setStakeholderName] = useState("");

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState<Category>("INTERNAL");
  const [availableOnTeams, setAvailableOnTeams] = useState(false);
  const [influenceLevel, setInfluenceLevel] = useState<InfluenceLevel>("MEDIUM");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${projectId}/stakeholders`);
      if (!res.ok) {
        router.replace(`/projects/${projectId}`);
        return;
      }
      const list = await res.json();
      const s = list.find((x: { id: string }) => x.id === stakeholderId);
      if (!s) {
        router.replace(`/projects/${projectId}`);
        return;
      }
      setStakeholderName(s.name);
      setName(s.name);
      setJobTitle(s.jobTitle);
      setEmail(s.email);
      setPhone(s.phone);
      setOrganization(s.organization);
      setCategory(s.category as Category);
      setAvailableOnTeams(s.availableOnTeams);
      setInfluenceLevel(s.influenceLevel as InfluenceLevel);
      setLoading(false);
    }
    load();
  }, [projectId, stakeholderId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/stakeholders/${stakeholderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          jobTitle: jobTitle.trim(),
          email: email.trim(),
          phone: phone.trim(),
          organization: organization.trim(),
          category,
          availableOnTeams,
          influenceLevel,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(" ")
            : data.error || "Failed to update stakeholder.";
        setError(msg);
        setSubmitting(false);
        return;
      }

      router.push(`/projects/${projectId}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove ${stakeholderName} from this project? This cannot be undone.`)) return;

    const res = await fetch(`/api/projects/${projectId}/stakeholders/${stakeholderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/projects/${projectId}`);
    } else {
      setError("Failed to delete stakeholder.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading stakeholder…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
          <Link href="/dashboard" className="hover:text-slate-600">
            Dashboard
          </Link>
          <span>/</span>
          <Link href={`/projects/${projectId}`} className="hover:text-slate-600">
            Project
          </Link>
          <span>/</span>
          <span className="text-slate-600">Edit Stakeholder</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Stakeholder</h1>
        <p className="text-slate-500 text-sm mt-1">{stakeholderName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Stakeholder Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                maxLength={200}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={50}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="INTERNAL">Internal</option>
                <option value="EXTERNAL">External</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Influence / Power Level <span className="text-red-500">*</span>
              </label>
              <select
                value={influenceLevel}
                onChange={(e) => setInfluenceLevel(e.target.value as InfluenceLevel)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                <span className="text-red-500 font-medium">High</span> ·{" "}
                <span className="text-amber-500 font-medium">Medium</span> ·{" "}
                <span className="text-emerald-500 font-medium">Low</span>
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableOnTeams}
                onChange={(e) => setAvailableOnTeams(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Available on Microsoft Teams</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors"
          >
            Remove Stakeholder
          </button>
          <div className="flex gap-3">
            <Link
              href={`/projects/${projectId}`}
              className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

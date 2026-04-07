"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Shift = "DAY" | "AFTERNOON" | "NIGHT" | "MOONLIGHT";
type Freq = "DAILY" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
type Process = { id: string; name: string; sortOrder: number };

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [signedFTE, setSignedFTE] = useState("");
  const [deployedFTE, setDeployedFTE] = useState("");
  const [initiationDate, setInitiationDate] = useState("");
  const [isNX, setIsNX] = useState(false);
  const [orgNumber, setOrgNumber] = useState("");
  const [shift, setShift] = useState<Shift>("DAY");
  const [meetingFreq, setMeetingFreq] = useState<Freq>("WEEKLY");

  // Processes: track existing (with id) and new (no id)
  const [initialProcesses, setInitialProcesses] = useState<Process[]>([]);
  const [processes, setProcesses] = useState<{ id?: string; name: string }[]>([]);
  const [processInput, setProcessInput] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      setProjectName(data.name);
      setName(data.name);
      setSignedFTE(String(data.signedFTECount));
      setDeployedFTE(String(data.deployedFTECount));
      setInitiationDate(data.initiationDate.slice(0, 10));
      setIsNX(data.isNXProject);
      setOrgNumber(data.orgNumber ?? "");
      setShift(data.shift as Shift);
      setMeetingFreq(data.meetingFrequency as Freq);
      const procs: Process[] = data.processes ?? [];
      setInitialProcesses(procs);
      setProcesses(procs.map((p) => ({ id: p.id, name: p.name })));
      setLoading(false);
    }
    load();
  }, [projectId, router]);

  function addProcess() {
    const trimmed = processInput.trim();
    if (!trimmed || processes.some((p) => p.name === trimmed) || processes.length >= 50) return;
    setProcesses((prev) => [...prev, { name: trimmed }]);
    setProcessInput("");
  }

  function removeProcess(index: number) {
    setProcesses((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Update core project fields
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          signedFTECount: parseInt(signedFTE, 10),
          deployedFTECount: parseInt(deployedFTE, 10),
          initiationDate: new Date(initiationDate).toISOString(),
          isNXProject: isNX,
          orgNumber: isNX ? orgNumber.trim() || null : null,
          shift,
          meetingFrequency: meetingFreq,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(" ")
            : data.error || "Failed to update project.";
        setError(msg);
        setSubmitting(false);
        return;
      }

      // Delete removed processes
      const removedProcesses = initialProcesses.filter(
        (ip) => !processes.some((p) => p.id === ip.id)
      );
      for (const proc of removedProcesses) {
        await fetch(`/api/projects/${projectId}/processes/${proc.id}`, {
          method: "DELETE",
        });
      }

      // Add new processes (those without an id)
      const newProcesses = processes.filter((p) => !p.id);
      for (const proc of newProcesses) {
        await fetch(`/api/projects/${projectId}/processes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: proc.name }),
        });
      }

      router.push(`/projects/${projectId}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading project…
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
            {projectName}
          </Link>
          <span>/</span>
          <span className="text-slate-600">Edit</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Project Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Project Name <span className="text-red-500">*</span>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Signed FTEs <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={signedFTE}
                onChange={(e) => setSignedFTE(e.target.value)}
                required
                min={0}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deployed FTEs <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={deployedFTE}
                onChange={(e) => setDeployedFTE(e.target.value)}
                required
                min={0}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Project Initiation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={initiationDate}
              onChange={(e) => setInitiationDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Shift <span className="text-red-500">*</span>
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as Shift)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="DAY">Day</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="NIGHT">Night</option>
                <option value="MOONLIGHT">Moonlight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Client Meeting Frequency <span className="text-red-500">*</span>
              </label>
              <select
                value={meetingFreq}
                onChange={(e) => setMeetingFreq(e.target.value as Freq)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="BI_WEEKLY">Bi-Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNX}
                onChange={(e) => setIsNX(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">This is an NX Project</span>
            </label>
          </div>

          {isNX && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Org Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orgNumber}
                onChange={(e) => setOrgNumber(e.target.value)}
                required={isNX}
                maxLength={50}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Processes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-semibold text-slate-900">Processes</h2>
            <span className="text-xs text-slate-400 font-medium">{processes.length}/50</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={processInput}
              onChange={(e) => setProcessInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addProcess();
                }
              }}
              maxLength={200}
              disabled={processes.length >= 50}
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50"
              placeholder="Type a process name and press Add or Enter"
            />
            <button
              type="button"
              onClick={addProcess}
              disabled={processes.length >= 50 || !processInput.trim()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {processes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {processes.map((p, i) => (
                <span
                  key={p.id ?? `new-${i}`}
                  className="inline-flex items-center gap-1.5 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg"
                >
                  {p.name}
                  <button
                    type="button"
                    onClick={() => removeProcess(i)}
                    className="text-indigo-400 hover:text-indigo-700 transition-colors"
                    aria-label={`Remove ${p.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No processes added yet.</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
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
      </form>
    </div>
  );
}

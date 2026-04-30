"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Shift = "DAY" | "AFTERNOON" | "NIGHT" | "MOONLIGHT";
type Freq = "DAILY" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY";

const SHIFT_OPTIONS: { value: Shift; label: string; color: string }[] = [
  { value: "DAY",       label: "Day",       color: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "AFTERNOON", label: "Afternoon", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "NIGHT",     label: "Night",     color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "MOONLIGHT", label: "Moonlight", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [signedFTE, setSignedFTE] = useState("");
  const [deployedFTE, setDeployedFTE] = useState("");
  const [initiationDate, setInitiationDate] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [meetingFreq, setMeetingFreq] = useState<Freq>("WEEKLY");
  const [isNX, setIsNX] = useState(false);
  const [isALIS, setIsALIS] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [orgNumber, setOrgNumber] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [processInput, setProcessInput] = useState("");
  const [processes, setProcesses] = useState<string[]>([]);

  function toggleShift(s: Shift) {
    setShifts((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function addProcess() {
    const trimmed = processInput.trim();
    if (!trimmed || processes.includes(trimmed) || processes.length >= 50) return;
    setProcesses((prev) => [...prev, trimmed]);
    setProcessInput("");
  }

  function removeProcess(p: string) {
    setProcesses((prev) => prev.filter((x) => x !== p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (shifts.length === 0) {
      setError("Please select at least one shift.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          signedFTECount: parseFloat(signedFTE),
          deployedFTECount: parseFloat(deployedFTE),
          initiationDate: new Date(initiationDate).toISOString(),
          isNXProject: isNX,
          isALISProject: isALIS,
          isOtherProject: isOther,
          orgNumber: isNX ? orgNumber.trim() || null : null,
          shifts,
          meetingFrequency: meetingFreq,
          additionalInfo: additionalInfo.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(" ")
            : data.error || "Failed to create project.";
        setError(msg);
        setSubmitting(false);
        return;
      }

      const project = await res.json();

      for (const procName of processes) {
        await fetch(`/api/projects/${project.id}/processes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: procName }),
        });
      }

      router.push(`/projects/${project.id}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
          <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-600">New Project</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Create Project</h1>
        <p className="text-slate-500 text-sm mt-1">
          Fields marked <span className="text-red-500">*</span> are required.
        </p>
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
              placeholder="e.g. Project Alpha"
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
                required min={0} step="0.01"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
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
                required min={0} step="0.01"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
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

          {/* Shift — multi-select checkboxes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Shift <span className="text-red-500">*</span>
              <span className="text-xs text-slate-400 font-normal ml-1">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SHIFT_OPTIONS.map((opt) => {
                const checked = shifts.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all select-none ${
                      checked
                        ? `${opt.color} border-current`
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleShift(opt.value)}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                );
              })}
            </div>
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

          {/* Project Type checkboxes */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Project Type</p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox" checked={isNX}
                  onChange={(e) => setIsNX(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">This is an NX Project</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox" checked={isALIS}
                  onChange={(e) => setIsALIS(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">This is an ALIS Project</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox" checked={isOther}
                  onChange={(e) => setIsOther(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Other</span>
              </label>
            </div>
          </div>

          {isNX && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Org Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text" value={orgNumber}
                onChange={(e) => setOrgNumber(e.target.value)}
                required={isNX} maxLength={50}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g. NX-12345"
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
              type="text" value={processInput}
              onChange={(e) => setProcessInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addProcess(); } }}
              maxLength={200} disabled={processes.length >= 50}
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Type a process name and press Add or Enter"
            />
            <button
              type="button" onClick={addProcess}
              disabled={processes.length >= 50 || !processInput.trim()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          {processes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {processes.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg">
                  {p}
                  <button type="button" onClick={() => removeProcess(p)}
                    className="text-indigo-400 hover:text-indigo-700 transition-colors" aria-label={`Remove ${p}`}>
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

        {/* Additional Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Additional Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notes / Additional Info
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              maxLength={250}
              rows={4}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Any additional context, notes or information about this project…"
            />
            <p className={`text-xs mt-1 text-right ${additionalInfo.length >= 230 ? "text-amber-600" : "text-slate-400"}`}>
              {additionalInfo.length}/250
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit" disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitting ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

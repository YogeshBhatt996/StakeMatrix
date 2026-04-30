"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

const SHIFT_LABELS: Record<string, string> = {
  DAY: "Day", AFTERNOON: "Afternoon", NIGHT: "Night", MOONLIGHT: "Moonlight",
};
const FREQ_LABELS: Record<string, string> = {
  DAILY: "Daily", WEEKLY: "Weekly", BI_WEEKLY: "Bi-Weekly", MONTHLY: "Monthly",
};

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");
      const projects = await res.json();

      const wb = XLSX.utils.book_new();

      // ── Sheet 1: Projects Summary ──────────────────────────
      const projectRows = projects.map((p: {
        name: string; shifts: string[]; isNXProject: boolean; isALISProject: boolean;
        isOtherProject: boolean; orgNumber?: string; signedFTECount: number;
        deployedFTECount: number; meetingFrequency: string; initiationDate: string;
        additionalInfo?: string; _count: { stakeholders: number; processes: number };
        createdBy: { name: string }; createdAt: string;
      }) => ({
        "Project Name":       p.name,
        "Shift(s)":           (p.shifts ?? []).map((s) => SHIFT_LABELS[s] ?? s).join(", "),
        "NX Project":         p.isNXProject ? "Yes" : "No",
        "ALIS Project":       p.isALISProject ? "Yes" : "No",
        "Other":              p.isOtherProject ? "Yes" : "No",
        "Org Number":         p.orgNumber ?? "",
        "Signed FTEs":        p.signedFTECount,
        "Deployed FTEs":      p.deployedFTECount,
        "Meeting Frequency":  FREQ_LABELS[p.meetingFrequency] ?? p.meetingFrequency,
        "Initiation Date":    new Date(p.initiationDate).toLocaleDateString(),
        "Stakeholders":       p._count.stakeholders,
        "Processes":          p._count.processes,
        "Created By":         p.createdBy?.name ?? "",
        "Created At":         new Date(p.createdAt).toLocaleDateString(),
        "Additional Info":    p.additionalInfo ?? "",
      }));

      const wsProjects = XLSX.utils.json_to_sheet(
        projectRows.length ? projectRows : [{ "Project Name": "No projects found" }]
      );
      // Column widths
      wsProjects["!cols"] = [
        { wch: 30 }, { wch: 24 }, { wch: 12 }, { wch: 14 },
        { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
        { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 10 },
        { wch: 20 }, { wch: 14 }, { wch: 36 },
      ];
      XLSX.utils.book_append_sheet(wb, wsProjects, "Projects");

      // ── Sheet 2: All Stakeholders ──────────────────────────
      const stakeholderRows: object[] = [];
      projects.forEach((p: {
        name: string;
        stakeholders: {
          name: string; jobTitle: string; email: string; phone: string;
          organization: string; category: string; influenceLevel: string;
          availableOnTeams: boolean;
        }[];
      }) => {
        p.stakeholders.forEach((s) => {
          stakeholderRows.push({
            "Project":          p.name,
            "Name":             s.name,
            "Job Title":        s.jobTitle,
            "Email":            s.email,
            "Phone":            s.phone,
            "Department":       s.organization ?? "",
            "Category":         s.category.charAt(0) + s.category.slice(1).toLowerCase(),
            "Influence Level":  s.influenceLevel.charAt(0) + s.influenceLevel.slice(1).toLowerCase(),
            "On Teams":         s.availableOnTeams ? "Yes" : "No",
          });
        });
      });

      const wsStakeholders = XLSX.utils.json_to_sheet(
        stakeholderRows.length ? stakeholderRows : [{ "Project": "No stakeholders found" }]
      );
      wsStakeholders["!cols"] = [
        { wch: 28 }, { wch: 24 }, { wch: 22 }, { wch: 28 },
        { wch: 18 }, { wch: 22 }, { wch: 12 }, { wch: 16 }, { wch: 10 },
      ];
      XLSX.utils.book_append_sheet(wb, wsStakeholders, "Stakeholders");

      // ── Sheet 3: Processes per project ────────────────────
      const processRows: object[] = [];
      projects.forEach((p: {
        name: string;
        processes: { name: string; sortOrder: number }[];
      }) => {
        p.processes.forEach((pr) => {
          processRows.push({
            "Project":    p.name,
            "Process":    pr.name,
            "Sort Order": pr.sortOrder,
          });
        });
      });

      const wsProcesses = XLSX.utils.json_to_sheet(
        processRows.length ? processRows : [{ "Project": "No processes found" }]
      );
      wsProcesses["!cols"] = [{ wch: 28 }, { wch: 36 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsProcesses, "Processes");

      // ── Download ───────────────────────────────────────────
      const date = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `StakeMatrix-Export-${date}.xlsx`);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Exporting…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Excel
        </>
      )}
    </button>
  );
}

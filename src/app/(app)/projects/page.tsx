import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessibleProjectIds } from "@/lib/permissions";
import Link from "next/link";
import type { SessionUser } from "@/types";

const SHIFT_LABELS: Record<string, string> = {
  DAY: "Day",
  AFTERNOON: "Afternoon",
  NIGHT: "Night",
  MOONLIGHT: "Moonlight",
};

const SHIFT_COLORS: Record<string, string> = {
  DAY: "bg-sky-100 text-sky-700",
  AFTERNOON: "bg-orange-100 text-orange-700",
  NIGHT: "bg-violet-100 text-violet-700",
  MOONLIGHT: "bg-indigo-100 text-indigo-700",
};

const FREQ_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BI_WEEKLY: "Bi-Weekly",
  MONTHLY: "Monthly",
};

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as SessionUser;

  const accessibleIds = await getAccessibleProjectIds(user.id);

  const projects = await prisma.project.findMany({
    where: accessibleIds !== null ? { id: { in: accessibleIds } } : undefined,
    include: {
      _count: { select: { stakeholders: true, processes: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} accessible to you
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="font-medium">No projects accessible</p>
          <p className="text-sm mt-1">Create a project or ask an admin to grant you access to existing ones.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {[
                  "Project Name",
                  "Shift",
                  "Meeting",
                  "Signed FTE",
                  "Deployed FTE",
                  "Stakeholders",
                  "Processes",
                  "Initiated",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr
                  key={project.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    i % 2 === 0 ? "" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{project.name}</div>
                    {project.isNXProject && project.orgNumber && (
                      <div className="text-xs text-slate-400 mt-0.5">Org: {project.orgNumber}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        SHIFT_COLORS[project.shift]
                      }`}
                    >
                      {SHIFT_LABELS[project.shift]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{FREQ_LABELS[project.meetingFrequency]}</td>
                  <td className="px-4 py-3 font-medium text-sky-700">{project.signedFTECount}</td>
                  <td className="px-4 py-3 font-medium text-amber-700">{project.deployedFTECount}</td>
                  <td className="px-4 py-3 text-slate-600">{project._count.stakeholders}/20</td>
                  <td className="px-4 py-3 text-slate-600">{project._count.processes}/50</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(project.initiationDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

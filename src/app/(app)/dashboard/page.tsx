import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessibleProjectIds } from "@/lib/permissions";
import Link from "next/link";
import type { SessionUser } from "@/types";
import { ExportButton } from "@/components/ExportButton";

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

const fmtFTE = (n: number) => parseFloat(n.toFixed(2)).toString();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as SessionUser;

  const accessibleIds = await getAccessibleProjectIds(user.id);

  const projects = await prisma.project.findMany({
    where: accessibleIds !== null ? { id: { in: accessibleIds } } : undefined,
    include: {
      _count: { select: { stakeholders: true, processes: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStakeholders = projects.reduce((s, p) => s + p._count.stakeholders, 0);
  const totalSignedFTE = projects.reduce((s, p) => s + p.signedFTECount, 0);
  const totalDeployedFTE = projects.reduce((s, p) => s + p.deployedFTECount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage stakeholder registers across all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
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
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: projects.length, color: "text-indigo-600" },
          { label: "Total Stakeholders", value: totalStakeholders, color: "text-emerald-600" },
          { label: "Signed FTEs", value: fmtFTE(totalSignedFTE), color: "text-sky-600" },
          { label: "Deployed FTEs", value: fmtFTE(totalDeployedFTE), color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="font-medium">No projects yet</p>
          <p className="text-sm mt-1">Click &ldquo;New Project&rdquo; to create your first project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight pr-2">
                  {project.name}
                </h3>
                <div className="flex flex-wrap gap-1 shrink-0">
                  {(project.shifts ?? []).map((s: string) => (
                    <span key={s} className={`text-xs font-medium px-2 py-0.5 rounded-full ${SHIFT_COLORS[s]}`}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {project.isNXProject && project.orgNumber && (
                <p className="text-xs text-slate-400 mb-3">Org: {project.orgNumber}</p>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
                <div>
                  <p className="text-xs text-slate-400">Signed FTE</p>
                  <p className="font-medium">{fmtFTE(project.signedFTECount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Deployed FTE</p>
                  <p className="font-medium">{fmtFTE(project.deployedFTECount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Stakeholders</p>
                  <p className="font-medium">{project._count.stakeholders}/20</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Processes</p>
                  <p className="font-medium">{project._count.processes}/50</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <span>Meeting: {FREQ_LABELS[project.meetingFrequency]}</span>
                <span>{new Date(project.initiationDate).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

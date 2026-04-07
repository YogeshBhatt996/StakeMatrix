import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProjectAccess } from "@/lib/permissions";
import { ProjectPermission } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { StakeholderTable } from "@/components/stakeholders/StakeholderTable";
import type { SessionUser } from "@/types";

const SHIFT_LABELS: Record<string, string> = {
  DAY: "Day", AFTERNOON: "Afternoon", NIGHT: "Night", MOONLIGHT: "Moonlight",
};
const SHIFT_COLORS: Record<string, string> = {
  DAY: "bg-sky-100 text-sky-700",
  AFTERNOON: "bg-orange-100 text-orange-700",
  NIGHT: "bg-violet-100 text-violet-700",
  MOONLIGHT: "bg-indigo-100 text-indigo-700",
};
const FREQ_LABELS: Record<string, string> = {
  DAILY: "Daily", WEEKLY: "Weekly", BI_WEEKLY: "Bi-Weekly", MONTHLY: "Monthly",
};

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as SessionUser;
  const canView = await hasProjectAccess(user.id, params.id, ProjectPermission.VIEW);
  if (!canView) notFound();

  const canEdit = await hasProjectAccess(user.id, params.id, ProjectPermission.EDIT);

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      processes: { orderBy: { sortOrder: "asc" } },
      stakeholders: { orderBy: { name: "asc" } },
      createdBy: { select: { name: true } },
    },
  });

  if (!project) notFound();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-600">{project.name}</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <Link
                href={`/projects/${project.id}/edit`}
                className="px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                Edit Project
              </Link>
              <Link
                href={`/projects/${project.id}/stakeholders/new`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add Stakeholder
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Project Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Initiation Date</p>
            <p className="text-sm font-medium text-slate-800">{new Date(project.initiationDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Shift</p>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${SHIFT_COLORS[project.shift]}`}>
              {SHIFT_LABELS[project.shift]}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Meeting Frequency</p>
            <p className="text-sm font-medium text-slate-800">{FREQ_LABELS[project.meetingFrequency]}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">NX Project</p>
            <p className="text-sm font-medium text-slate-800">{project.isNXProject ? `Yes (${project.orgNumber})` : "No"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Signed FTEs</p>
            <p className="text-2xl font-bold text-sky-600">{project.signedFTECount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Deployed FTEs</p>
            <p className="text-2xl font-bold text-amber-600">{project.deployedFTECount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Created By</p>
            <p className="text-sm font-medium text-slate-800">{project.createdBy.name}</p>
          </div>
        </div>
      </div>

      {/* Processes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">
            Processes <span className="text-slate-400 font-normal text-sm">({project.processes.length}/50)</span>
          </h2>
        </div>
        {project.processes.length === 0 ? (
          <p className="text-sm text-slate-400">No processes added.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {project.processes.map((p) => (
              <span key={p.id} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stakeholder Register */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">
            Stakeholder Register{" "}
            <span className="text-slate-400 font-normal text-sm">({project.stakeholders.length}/20)</span>
          </h2>
        </div>
        <StakeholderTable
          stakeholders={project.stakeholders}
          projectId={project.id}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
}

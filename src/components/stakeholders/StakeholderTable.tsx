import { Stakeholder } from "@prisma/client";
import { InfluenceBadge } from "./InfluenceBadge";
import Link from "next/link";

interface StakeholderTableProps {
  stakeholders: Stakeholder[];
  projectId: string;
  canEdit: boolean;
}

export function StakeholderTable({ stakeholders, projectId, canEdit }: StakeholderTableProps) {
  if (stakeholders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="font-medium">No stakeholders added yet</p>
        {canEdit && (
          <p className="text-sm mt-1">
            Click &quot;Add Stakeholder&quot; to begin building the register.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {["Name", "Title", "Department", "Contact", "Category", "Teams", "Influence", canEdit ? "Actions" : ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stakeholders.map((s, i) => (
            <tr key={s.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
              <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
              <td className="px-4 py-3 text-slate-600">{s.jobTitle}</td>
              <td className="px-4 py-3 text-slate-600">{s.organization}</td>
              <td className="px-4 py-3">
                <div className="text-slate-600">{s.email}</div>
                <div className="text-slate-400 text-xs">{s.phone}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.category === "INTERNAL"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {s.category === "INTERNAL" ? "Internal" : "External"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium ${s.availableOnTeams ? "text-emerald-600" : "text-slate-400"}`}>
                  {s.availableOnTeams ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-4 py-3">
                <InfluenceBadge level={s.influenceLevel} />
              </td>
              {canEdit && (
                <td className="px-4 py-3">
                  <Link
                    href={`/projects/${projectId}/stakeholders/${s.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                  >
                    Edit
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { InfluenceLevel } from "@prisma/client";

const CONFIG: Record<InfluenceLevel, { label: string; className: string }> = {
  HIGH:   { label: "High",   className: "bg-red-100 text-red-700" },
  MEDIUM: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  LOW:    { label: "Low",    className: "bg-green-100 text-green-700" },
};

export function InfluenceBadge({ level }: { level: InfluenceLevel }) {
  const { label, className } = CONFIG[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

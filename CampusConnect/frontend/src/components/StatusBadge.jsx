const statusMap = {
  Open: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  "In Progress": "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Rejected: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

const priorityMap = {
  Low: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  Medium: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
  High: "bg-orange-500/15 text-orange-300 border-orange-400/30",
  Urgent: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge border ${statusMap[status] || "bg-white/5 text-slate-300 border-white/10"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge border ${priorityMap[priority] || "bg-white/5 text-slate-300 border-white/10"}`}>
      {priority}
    </span>
  );
}

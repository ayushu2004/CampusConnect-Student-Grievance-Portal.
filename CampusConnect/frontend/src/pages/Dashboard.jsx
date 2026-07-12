import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip as RTooltip,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import api from "../api/client";
import StatCard from "../components/StatCard.jsx";
import Loader from "../components/Loader.jsx";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const COLORS = ["#8b5cf6", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#ef4444", "#6366f1", "#14b8a6", "#f43f5e"];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/stats/overview");
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  if (!data) return null;

  const byStatusMap = Object.fromEntries(data.byStatus.map((s) => [s._id, s.count]));
  const open = byStatusMap["Open"] || 0;
  const progress = byStatusMap["In Progress"] || 0;
  const resolved = byStatusMap["Resolved"] || 0;
  const rejected = byStatusMap["Rejected"] || 0;

  const categoryData = data.byCategory.map((c) => ({ name: c._id, value: c.count }));
  const trendData = data.trend.map((t) => ({ date: t._id.slice(5), count: t.count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {user.role === "student"
              ? "Track your grievances and their resolution status."
              : "Monitor and manage all campus grievances in real time."}
          </p>
        </div>
        <Link to="/app/complaints/new" className="btn-primary">
          <Plus size={16} /> New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="Total" value={data.totals.complaints} color="brand" />
        <StatCard icon={Clock} label="In Progress" value={progress} color="amber" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolved} color="emerald" />
        <StatCard
          icon={user.role === "admin" ? Users : AlertOctagon}
          label={user.role === "admin" ? "Users" : "Open"}
          value={user.role === "admin" ? data.totals.users : open}
          color={user.role === "admin" ? "sky" : "rose"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Complaints — last 14 days</h3>
            <span className="chip">Live</span>
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <RTooltip
                  contentStyle={{
                    background: "rgba(18,18,28,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="font-semibold mb-4">By Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-500 py-10 text-center">No data yet.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{
                      background: "rgba(18,18,28,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.slice(0, 6).map((c, i) => (
              <span key={c.name} className="chip">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {c.name} · {c.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent activity</h3>
          <Link to="/app/complaints" className="link text-sm inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {data.recent.length === 0 ? (
          <p className="text-sm text-slate-500 py-10 text-center">No complaints yet. Be the first to raise one!</p>
        ) : (
          <div className="divide-y divide-white/5">
            {data.recent.map((c) => (
              <Link
                key={c._id}
                to={`/app/complaints/${c._id}`}
                className="flex items-center gap-4 py-3 hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: c.createdBy?.avatarColor || "#7c3aed" }}
                >
                  {c.createdBy?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.ticketId} · {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

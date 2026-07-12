import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/client";
import Loader from "../components/Loader.jsx";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const categories = ["", "Academic", "Hostel", "Infrastructure", "Faculty",
  "Administration", "Ragging", "Library", "Transport", "Other"];
const statuses = ["", "Open", "In Progress", "Resolved", "Rejected"];

export default function ComplaintsList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "", status: "", category: "", mine: "",
  });
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries({ ...filters, page, limit: 10 }).filter(([, v]) => v !== "")
      );
      const { data } = await api.get("/complaints", { params });
      setItems(data.items);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const isPriv = user.role === "admin" || user.role === "faculty";

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isPriv ? "All complaints across campus." : "Your submitted grievances."}
          </p>
        </div>
        <Link to="/app/complaints/new" className="btn-primary">
          <Plus size={16} /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="glass p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input pl-10"
              placeholder="Search title or description…"
              value={filters.q}
              onChange={(e) => { setPage(1); setFilters({ ...filters, q: e.target.value }); }}
            />
          </div>
          <select
            className="input"
            value={filters.status}
            onChange={(e) => { setPage(1); setFilters({ ...filters, status: e.target.value }); }}
          >
            {statuses.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
          </select>
          <select
            className="input"
            value={filters.category}
            onChange={(e) => { setPage(1); setFilters({ ...filters, category: e.target.value }); }}
          >
            {categories.map((c) => <option key={c} value={c}>{c || "All categories"}</option>)}
          </select>
        </div>

        {isPriv && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <Filter size={12} /> View:
            </span>
            <button
              onClick={() => setFilters({ ...filters, mine: "" })}
              className={`chip ${!filters.mine ? "bg-brand-500/20 border-brand-500/40 text-white" : ""}`}
            >
              All campus
            </button>
            <button
              onClick={() => setFilters({ ...filters, mine: "1" })}
              className={`chip ${filters.mine ? "bg-brand-500/20 border-brand-500/40 text-white" : ""}`}
            >
              Mine only
            </button>
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="glass p-16 text-center">
          <p className="text-slate-400">No complaints match your filters.</p>
          <Link to="/app/complaints/new" className="btn-primary mt-6 inline-flex">
            <Plus size={16} /> Raise the first one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/app/complaints/${c._id}`}
                className="glass p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-brand-500/30 transition group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: c.createdBy?.avatarColor || "#334155" }}
                >
                  {c.anonymous ? "?" : c.createdBy?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{c.ticketId}</span>
                    <span className="chip">{c.category}</span>
                  </div>
                  <div className="font-semibold mt-1 truncate group-hover:text-brand-300 transition">
                    {c.title}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{c.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </Link>
            </motion.div>
          ))}

          {meta.pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-slate-500">
                Page {meta.page} of {meta.pages} · {meta.total} total
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  className="btn-ghost"
                  disabled={page >= meta.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

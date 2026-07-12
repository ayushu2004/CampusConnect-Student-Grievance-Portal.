import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";

const categories = [
  "Academic", "Hostel", "Infrastructure", "Faculty",
  "Administration", "Ragging", "Library", "Transport", "Other",
];
const priorities = ["Low", "Medium", "High", "Urgent"];

export default function NewComplaint() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    priority: "Medium",
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/complaints", form);
      toast.success(`Complaint ${data.complaint.ticketId} submitted!`);
      nav(`/app/complaints/${data.complaint._id}`);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to submit";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Raise a new complaint</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Provide clear details so we can resolve it faster.
        </p>
      </div>

      <form onSubmit={submit} className="glass-strong p-6 space-y-5">
        <div>
          <label className="label">Title *</label>
          <input
            required
            minLength={4}
            maxLength={140}
            className="input"
            placeholder="Short summary of the issue"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`py-2 rounded-xl text-sm font-medium border transition
                    ${
                      form.priority === p
                        ? "bg-brand-500/20 border-brand-500/50 text-white"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/5"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            className="input resize-none"
            placeholder="Describe the problem, when it started, and any relevant context…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="text-right text-xs text-slate-500 mt-1">
            {form.description.length}/4000
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.05] transition">
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
            className="mt-0.5 w-4 h-4 accent-brand-500"
          />
          <div>
            <div className="text-sm font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-brand-400" /> Submit anonymously
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Your identity will be hidden from faculty and other students. Admins still see who
              submitted for accountability.
            </div>
          </div>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => nav(-1)} className="btn-ghost">
            Cancel
          </button>
          <button disabled={loading} className="btn-primary">
            {loading ? "Submitting…" : (<><Send size={16} /> Submit complaint</>)}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

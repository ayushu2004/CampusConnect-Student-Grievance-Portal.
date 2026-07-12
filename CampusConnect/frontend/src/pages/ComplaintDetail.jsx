import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Send, ThumbsUp, Trash2, Calendar, Tag, User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import Loader from "../components/Loader.jsx";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const statuses = ["Open", "In Progress", "Resolved", "Rejected"];
const priorities = ["Low", "Medium", "High", "Urgent"];

export default function ComplaintDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load");
      nav("/app/complaints");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [id]);

  const isPriv = user.role === "admin" || user.role === "faculty";
  const isOwner = complaint?.createdBy?._id === user.id;

  const updateField = async (patch) => {
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, patch);
      setComplaint((c) => ({ ...c, ...data.complaint }));
      toast.success("Updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/complaints/${id}/responses`, { message: reply });
      setComplaint(data.complaint);
      setReply("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const upvote = async () => {
    try {
      const { data } = await api.post(`/complaints/${id}/upvote`);
      setComplaint((c) => ({
        ...c,
        upvotes: data.upvoted
          ? [...(c.upvotes || []), user.id]
          : (c.upvotes || []).filter((u) => u !== user.id),
      }));
    } catch (err) {
      toast.error("Could not upvote");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this complaint permanently?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success("Deleted");
      nav("/app/complaints");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;
  if (!complaint) return null;

  const upvoted = (complaint.upvotes || []).some(
    (u) => (u._id || u).toString() === user.id
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <Link to="/app/complaints" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Back to complaints
      </Link>

      {/* Header card */}
      <div className="glass-strong p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">{complaint.ticketId}</span>
              <span>·</span>
              <span className="chip"><Tag size={12} /> {complaint.category}</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">{complaint.title}</h1>
            <p className="mt-3 text-slate-300 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} /> {new Date(complaint.createdAt).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserIcon size={12} />
                {complaint.anonymous && !isPriv
                  ? "Anonymous"
                  : complaint.createdBy?.name || "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={upvote}
                className={`btn-ghost ${upvoted ? "text-brand-300 border-brand-500/30" : ""}`}
              >
                <ThumbsUp size={14} /> {complaint.upvotes?.length || 0}
              </button>
              {(isOwner || user.role === "admin") && (
                <button onClick={remove} className="btn-ghost hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Admin controls */}
        {isPriv && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Update status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateField({ status: s })}
                    className={`chip ${complaint.status === s ? "bg-brand-500/25 border-brand-500/40 text-white" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateField({ priority: p })}
                    className={`chip ${complaint.priority === p ? "bg-brand-500/25 border-brand-500/40 text-white" : ""}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="glass p-6">
        <h3 className="font-semibold mb-4">
          Conversation <span className="text-slate-500 font-normal">({complaint.responses?.length || 0})</span>
        </h3>

        {complaint.responses?.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No responses yet. Start the conversation below.</p>
        ) : (
          <div className="space-y-4">
            {complaint.responses.map((r) => {
              const mine = (r.author?._id || r.author) === user.id;
              return (
                <div
                  key={r._id}
                  className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: r.author?.avatarColor || "#334155" }}
                  >
                    {r.author?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className={`max-w-[75%] ${mine ? "text-right" : ""}`}>
                    <div className="text-xs text-slate-500 mb-1">
                      <span className="font-medium text-slate-300">{r.author?.name || "User"}</span>
                      {" · "}
                      <span className="capitalize">{r.authorRole}</span>
                      {" · "}
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
                        mine
                          ? "bg-brand-500/15 border-brand-500/30 rounded-tr-sm"
                          : "bg-white/[0.04] border-white/10 rounded-tl-sm"
                      }`}
                    >
                      {r.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={sendReply} className="mt-6 flex items-end gap-2">
          <textarea
            rows={2}
            className="input resize-none flex-1"
            placeholder={isPriv ? "Reply as administration…" : "Add more details or ask for an update…"}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button disabled={sending || !reply.trim()} className="btn-primary">
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </motion.div>
  );
}

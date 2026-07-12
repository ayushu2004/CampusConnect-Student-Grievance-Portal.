import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const palette = ["#7c3aed", "#0ea5e9", "#f59e0b", "#ef4444", "#10b981", "#ec4899", "#6366f1", "#14b8a6"];

export default function Profile() {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    rollNo: user.rollNo || "",
    department: user.department || "",
    avatarColor: user.avatarColor || "#7c3aed",
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/users/me", form);
      await refreshMe();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="glass-strong p-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-glow"
          style={{ backgroundColor: form.avatarColor }}
        >
          {form.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold">{form.name}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <p className="text-xs mt-1 chip capitalize">{user.role}</p>
        </div>
      </div>

      <form onSubmit={save} className="glass p-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Roll No.</label>
            <input
              className="input"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Department</label>
            <input
              className="input"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Avatar color</label>
          <div className="flex gap-2 flex-wrap">
            {palette.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, avatarColor: c })}
                className={`w-9 h-9 rounded-xl border-2 transition ${
                  form.avatarColor === c ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

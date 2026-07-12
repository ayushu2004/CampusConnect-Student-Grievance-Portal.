import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/client";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const roles = ["student", "faculty", "admin"];

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", {
        params: { q: q || undefined, role: role || undefined, limit: 100 },
      });
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }, [q, role]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (id, newRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      setItems((arr) => arr.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setItems((arr) => arr.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Manage users</h1>
        <p className="text-slate-400 mt-1 text-sm">Change roles and remove accounts.</p>
      </div>

      <div className="glass p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search by name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ backgroundColor: u.avatarColor }}
                        >
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{u.department || "—"}</td>
                    <td className="p-4">
                      <select
                        className="input py-1.5 text-xs w-32"
                        value={u.role}
                        disabled={u.id === me.id}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        {roles.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => remove(u.id)}
                        disabled={u.id === me.id}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

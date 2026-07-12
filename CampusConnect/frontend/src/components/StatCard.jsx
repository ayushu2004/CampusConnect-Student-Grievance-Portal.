import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, trend, color = "brand" }) {
  const colorMap = {
    brand: "from-brand-500/30 to-brand-500/5 text-brand-300",
    sky: "from-sky-500/30 to-sky-500/5 text-sky-300",
    emerald: "from-emerald-500/30 to-emerald-500/5 text-emerald-300",
    amber: "from-amber-500/30 to-amber-500/5 text-amber-300",
    rose: "from-rose-500/30 to-rose-500/5 text-rose-300",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass p-5 relative overflow-hidden group"
    >
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${colorMap[color]} blur-2xl opacity-70 group-hover:opacity-100 transition`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${colorMap[color].split(" ").pop()}`}>
            <Icon size={20} />
          </div>
          {trend != null && (
            <span
              className={`text-xs font-semibold ${
                trend >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

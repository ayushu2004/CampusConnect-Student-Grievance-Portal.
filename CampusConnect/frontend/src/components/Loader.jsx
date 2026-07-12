import { motion } from "framer-motion";

export default function Loader({ fullscreen = false, label = "Loading…" }) {
  const Wrap = ({ children }) =>
    fullscreen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-ink-900">
        {children}
      </div>
    ) : (
      <div className="flex items-center justify-center py-16">{children}</div>
    );

  return (
    <Wrap>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow"
          animate={{ rotate: [0, 90, 180, 270, 360], borderRadius: ["25%", "50%", "25%", "50%", "25%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </Wrap>
  );
}

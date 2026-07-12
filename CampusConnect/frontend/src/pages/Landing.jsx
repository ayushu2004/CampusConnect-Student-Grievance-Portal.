<h1 style={{ color: "white", fontSize: "40px" }}>
  LANDING TEST
</h1>
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  { icon: Shield, title: "Secure JWT Auth", desc: "Access + refresh tokens with rotation, httpOnly cookies, and role-based access." },
  { icon: Zap, title: "Real-time Tracking", desc: "Track your complaint from Open → In Progress → Resolved with a full audit trail." },
  { icon: MessageSquare, title: "Threaded Discussions", desc: "Have a two-way conversation with faculty and admins on every ticket." },
  { icon: BarChart3, title: "Admin Analytics", desc: "Live dashboards with category, priority, status and 14-day trend charts." },
  { icon: Users, title: "Role-Based Access", desc: "Students, faculty and admins each see a tailored view of the system." },
  { icon: CheckCircle2, title: "Anonymous Mode", desc: "Report sensitive issues anonymously — identity is hidden from all non-admins." },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/app" className="btn-primary">
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 chip mb-6">
            <Sparkles size={14} className="text-brand-400" />
            <span>Modern MERN · Full-stack Grievance Portal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            A student grievance portal <br />
            that actually <span className="animated-gradient-text">gets things done.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
            CampusConnect gives students a fast, transparent way to raise complaints —
            and gives administration a beautiful dashboard to resolve them.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to={user ? "/app" : "/register"} className="btn-primary text-base px-6 py-3">
              {user ? "Go to Dashboard" : "Create free account"} <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-6 py-3">
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-brand-500/20 via-sky-500/20 to-pink-500/20 rounded-3xl" />
          <div className="relative glass-strong p-3 rounded-3xl max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/5">
              <div className="bg-ink-800/80 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Open", "In Progress", "Resolved"].map((s, i) => (
                    <div
                      key={s}
                      className="glass p-4 text-left"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      <div className="text-xs uppercase tracking-widest text-slate-500">{s}</div>
                      <div className="text-3xl font-bold mt-1">{[12, 5, 34][i]}</div>
                      <div className="mt-3 h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-500"
                          style={{ width: ["30%", "60%", "90%"][i] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 glass p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-sm font-bold">
                        AK
                      </div>
                      <div>
                        <div className="font-medium text-sm">Hostel WiFi is very slow after 8 PM</div>
                        <div className="text-xs text-slate-500">CC-9AB4Z2K7 · Hostel · High priority</div>
                      </div>
                    </div>
                    <span className="badge border bg-amber-500/15 text-amber-300 border-amber-400/30">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">Everything you need, nothing you don't.</h2>
          <p className="mt-3 text-slate-400">
            Production-grade features baked into a clean, focused UI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-6 hover:border-brand-500/30 transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/30 to-sky-500/20 border border-white/10 flex items-center justify-center text-brand-300 group-hover:scale-110 transition">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-strong p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-sky-500/10" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold">
              Ready to make your voice heard?
            </h3>
            <p className="mt-3 text-slate-400">Join CampusConnect in seconds — free for students.</p>
            <Link to="/register" className="btn-primary mt-8 text-base px-6 py-3">
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500">
        Built with the MERN stack · © {new Date().getFullYear()} CampusConnect
      </footer>
    </div>
  );
}

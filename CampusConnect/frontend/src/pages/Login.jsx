import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      nav(loc.state?.from || "/app", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") setForm({ email: "admin@campusconnect.edu", password: "Admin@12345" });
    if (role === "student") setForm({ email: "ayush@student.edu", password: "Student@123" });
    if (role === "faculty") setForm({ email: "meera@faculty.edu", password: "Faculty@123" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-sky-500/20" />
        <div className="relative">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="relative">
          <h1 className="text-5xl font-extrabold leading-tight">
            Your voice, <br /> <span className="animated-gradient-text">amplified.</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-md">
            Sign in to submit and track grievances, or manage the campus if you're an admin.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2 max-w-md">
            <button onClick={() => fillDemo("student")} className="chip hover:bg-white/10">
              👨‍🎓 Student demo
            </button>
            <button onClick={() => fillDemo("faculty")} className="chip hover:bg-white/10">
              👩‍🏫 Faculty demo
            </button>
            <button onClick={() => fillDemo("admin")} className="chip hover:bg-white/10">
              🛡️ Admin demo
            </button>
          </div>
        </div>
        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} CampusConnect
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="glass-strong p-8">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to your CampusConnect account.</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    className="input pl-10"
                    placeholder="you@campus.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    minLength={6}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button disabled={loading} className="btn-primary w-full mt-2">
                {loading ? "Signing in…" : (<>Sign in <ArrowRight size={16} /></>)}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="link font-medium">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FilePlus2,
  Inbox,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";
import toast from "react-hot-toast";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/complaints", label: "Complaints", icon: Inbox },
  { to: "/app/complaints/new", label: "New Complaint", icon: FilePlus2 },
  { to: "/app/profile", label: "Profile", icon: User },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = [...navItems];
  if (user?.role === "admin") {
    items.push({ to: "/app/admin/users", label: "Manage Users", icon: Users });
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  const Initials = () => (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white"
      style={{ backgroundColor: user?.avatarColor || "#7c3aed" }}
    >
      {user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 z-40 transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full m-3 rounded-3xl glass-strong flex flex-col p-5">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-1.5">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition
                   ${
                     isActive
                       ? "bg-gradient-to-r from-brand-600/30 to-sky-500/20 text-white border border-brand-500/30"
                       : "text-slate-400 hover:text-white hover:bg-white/5"
                   }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <Initials />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-ink-900/60 border-b border-white/5">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-sm text-slate-400">
                Welcome back,{" "}
                <span className="text-white font-medium">{user?.name?.split(" ")[0]}</span> 👋
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-white/5">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
              </button>
              <div className="hidden md:flex items-center gap-2 chip">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="capitalize">{user?.role} account</span>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          className="p-4 lg:p-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

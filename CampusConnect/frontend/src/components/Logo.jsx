export default function Logo({ size = 36 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-xl bg-gradient-to-br from-brand-500 to-sky-500 shadow-glow flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none">
          <path d="M6 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="7" r="2.6" fill="white" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="font-bold text-white">
          Campus<span className="animated-gradient-text">Connect</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500">
          Grievance Portal
        </div>
      </div>
    </div>
  );
}

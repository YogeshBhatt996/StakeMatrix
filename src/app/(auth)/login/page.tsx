"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/* ── Inline brand mark — notebook + people, navy/teal palette ── */
function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Notebook body */}
      <rect x="10" y="6" width="40" height="52" rx="4" fill="#2db8a0" />
      <rect x="14" y="10" width="32" height="44" rx="2" fill="white" />
      {/* Spiral rings */}
      {[14, 22, 30, 38, 46].map((y) => (
        <rect key={y} x="7" y={y} width="6" height="3" rx="1.5" fill="white" opacity="0.7" />
      ))}
      {/* Table header bar */}
      <rect x="17" y="13" width="26" height="5" rx="1" fill="#1a3a6b" />
      <rect x="17" y="13" width="8" height="5" rx="1" fill="#2db8a0" />
      {/* Row lines */}
      {[22, 30, 38].map((y) => (
        <g key={y}>
          {/* Avatar circle */}
          <circle cx="21" cy={y + 3} r="3" fill="#1a3a6b" opacity="0.25" />
          <circle cx="21" cy={y + 3} r="1.5" fill="#1a3a6b" opacity="0.5" />
          {/* Text lines */}
          <rect x="27" y={y + 1} width="12" height="2" rx="1" fill="#1a3a6b" opacity="0.2" />
          <rect x="27" y={y + 5} width="8" height="1.5" rx="0.75" fill="#1a3a6b" opacity="0.15" />
        </g>
      ))}
      {/* People group — bottom right overlay */}
      <circle cx="28" cy="53" r="7" fill="#1a3a6b" />
      <circle cx="36" cy="53" r="7" fill="#2db8a0" />
      <circle cx="44" cy="53" r="7" fill="#6b5acd" />
      {/* Person silhouettes */}
      {[28, 36, 44].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="50" r="2.5" fill="white" opacity="0.85" />
          <path d={`M${cx - 3} 57 Q${cx} 54 ${cx + 3} 57`} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const idleLogout     = searchParams.get("reason") === "idle";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0f2448 0%, #1a3a6b 55%, #0d3d5c 100%)" }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Top teal accent */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg,#2db8a0,#4a90d9)" }} />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-4">
          <BrandMark size={56} />
          <div>
            <p className="text-white font-bold text-lg leading-tight">Stakeholder</p>
            <p className="font-bold text-lg leading-tight" style={{ color: "#2db8a0" }}>Register</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
            Manage every<br />
            <span style={{ color: "#2db8a0" }}>stakeholder.</span><br />
            Deliver every<br />
            <span style={{ color: "#4a90d9" }}>project.</span>
          </h1>
          <p className="text-blue-200 text-lg mb-10 leading-relaxed">
            A centralised register to organise stakeholders,
            track FTEs, and keep every project team aligned.
          </p>
          <ul className="space-y-4">
            {[
              { icon: "📋", text: "Centralise all project stakeholder data in one place" },
              { icon: "👥", text: "Track influence levels, categories & Teams availability" },
              { icon: "📊", text: "Monitor signed vs deployed FTE across all shifts" },
              { icon: "📤", text: "Export full register to Excel with one click" },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <span className="text-blue-100 text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tagline */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
          <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#2db8a0" }}>
            Organize · Engage · Deliver
          </p>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Decorative blobs */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-10" style={{ background: "#2db8a0" }} />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.06]" style={{ background: "#4a90d9" }} />
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <BrandMark size={44} />
            <div>
              <p className="font-bold text-slate-900 leading-tight">Stakeholder</p>
              <p className="font-bold leading-tight" style={{ color: "#2db8a0" }}>Register</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {idleLogout && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3 mb-6">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
              </svg>
              You were signed out after 60 minutes of inactivity. Please sign in again.
            </div>
          )}

          {justRegistered && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-6">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Account created successfully! Please sign in.
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: "#2db8a0" }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3 px-4 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-60 shadow-sm hover:shadow-md hover:brightness-110"
                style={{ background: "linear-gradient(135deg,#1a3a6b,#0d3d5c)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#2db8a0" }}>
              Create one
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-8 tracking-wider uppercase lg:hidden">
            Organize · Engage · Deliver
          </p>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

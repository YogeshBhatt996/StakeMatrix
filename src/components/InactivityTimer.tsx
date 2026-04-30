"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { signOut } from "next-auth/react";

const WARN_MS   = 55 * 60 * 1000; // 55 min — show warning
const LOGOUT_MS = 60 * 60 * 1000; // 60 min — sign out
const EVENTS    = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function InactivityTimer() {
  const [showWarning, setShowWarning] = useState(false);
  const [secsLeft, setSecsLeft]       = useState(300);

  const warnRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (warnRef.current)      clearTimeout(warnRef.current);
    if (logoutRef.current)    clearTimeout(logoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const arm = useCallback(() => {
    clearAll();
    setShowWarning(false);
    setSecsLeft(300);

    warnRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecsLeft(300);
      countdownRef.current = setInterval(() => {
        setSecsLeft((prev) => {
          if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, WARN_MS);

    logoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/login?reason=idle" });
    }, LOGOUT_MS);
  }, [clearAll]);

  // Reset on any user activity
  useEffect(() => {
    arm();
    const handler = () => arm();
    EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      clearAll();
      EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [arm, clearAll]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-7 text-center">
        {/* Clock icon */}
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Still there?
        </h2>
        <p className="text-sm text-slate-500 mb-1">
          You&apos;ll be signed out automatically in
        </p>
        <p className="text-3xl font-bold text-amber-600 mb-4 tabular-nums">
          {fmt(secsLeft)}
        </p>
        <p className="text-xs text-slate-400 mb-6">
          For your security, inactive sessions are ended after 60 minutes.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-colors"
          >
            Sign out now
          </button>
          <button
            onClick={arm}
            className="flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#1a3a6b,#0d3d5c)" }}
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
}

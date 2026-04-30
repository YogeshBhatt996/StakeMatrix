"use client";

import { useState } from "react";

type StepResult = { step: string; status: "pass" | "fail"; detail?: string };
type TestReport = {
  ok: boolean;
  steps: StepResult[];
  startedAt: string;
  finishedAt: string;
  error?: string;
};

export function ForgotPasswordTestPanel() {
  const [loading,  setLoading]  = useState(false);
  const [report,   setReport]   = useState<TestReport | null>(null);

  async function run() {
    setLoading(true);
    setReport(null);
    try {
      const res  = await fetch("/api/admin/test-reset");
      const data = await res.json();
      setReport(data);
    } catch {
      setReport({
        ok: false,
        steps: [],
        error: "Network error — could not reach the test endpoint.",
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  const dur = report
    ? `${(new Date(report.finishedAt).getTime() - new Date(report.startedAt).getTime())}ms`
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Forgot Password — Self-Test
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Runs the full forgot-password / reset-password flow against the live database.
            No email is sent and no password is changed.
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Running…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Self-Test
            </>
          )}
        </button>
      </div>

      {report && (
        <div className="mt-2">
          {/* Summary bar */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-4 ${
            report.ok
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-red-50 border border-red-200"
          }`}>
            {report.ok ? (
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className={`font-semibold text-sm ${report.ok ? "text-emerald-700" : "text-red-700"}`}>
              {report.ok
                ? `All ${report.steps.length} checks passed`
                : `${report.steps.filter((s) => s.status === "fail").length} check(s) failed`}
            </span>
            <span className="ml-auto text-xs text-slate-400">{dur} · {new Date(report.startedAt).toLocaleTimeString()}</span>
          </div>

          {/* Step-by-step results */}
          <div className="space-y-2">
            {report.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                {step.status === "pass" ? (
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <div>
                  <span className={step.status === "pass" ? "text-slate-700" : "text-red-700 font-medium"}>
                    {step.step}
                  </span>
                  {step.detail && (
                    <span className="text-xs text-slate-400 ml-2">{step.detail}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {report.error && (
            <p className="text-sm text-red-600 mt-3 bg-red-50 rounded-lg px-4 py-3 border border-red-200">
              {report.error}
            </p>
          )}

          {/* SendGrid note */}
          {report.ok && (
            <p className="text-xs text-slate-400 mt-4 flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              DB flow verified ✓ — Email delivery requires{" "}
              <code className="bg-slate-100 px-1 rounded">SENDGRID_API_KEY</code>{" "}
              &amp; a verified sender set in your environment variables.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

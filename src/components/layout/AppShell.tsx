"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { InactivityTimer } from "@/components/InactivityTimer";

interface AppShellProps {
  children: React.ReactNode;
  session: Session;
}

export function AppShell({ children, session }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <InactivityTimer />
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        session={session}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} session={session} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

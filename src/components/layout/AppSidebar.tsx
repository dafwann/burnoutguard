"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  Settings,
  HeartPulse,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/predict", label: "Predict", icon: Brain },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r border-border bg-sidebar p-4 md:flex md:flex-col">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2 px-2"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
          <HeartPulse className="h-5 w-5" />
        </div>

        <div className="font-display text-lg font-bold tracking-tight">
          BurnoutGuard
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;

          return (
            <Link
              key={to}
              href={to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Card */}
      <div className="mt-auto rounded-2xl border border-border bg-gradient-to-br from-primary-light to-mint/40 p-4">
        <div className="text-sm font-semibold">
          BurnoutGuard
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Monitor risiko burnout, dapatkan rekomendasi AI, dan pantau progresmu.
        </p>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, Activity, Sparkles, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/predict", label: "Predict", icon: Brain },
  { to: "/analytics", label: "Stats", icon: Activity },
  { to: "/insights", label: "AI", icon: Sparkles },
  { to: "/recovery", label: "Plan", icon: HeartPulse },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full glass px-2 py-2 shadow-float md:hidden">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            href={to}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] font-medium transition-all",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
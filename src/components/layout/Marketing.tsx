"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/dashboard", label: "Product" },
] as const;

export function MarketingNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-4 z-40 mx-auto flex w-[min(1100px,calc(100%-2rem))] items-center justify-between rounded-full glass px-3 py-2 shadow-soft">
      <Link href="/" className="flex items-center gap-2 px-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
          <HeartPulse className="h-4 w-4" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">BurnoutGuard</span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {links.map((l) => (
          <Link
            key={l.to}
            href={l.to}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              pathname === l.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto grid w-[min(1100px,calc(100%-2rem))] gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold">BurnoutGuard</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Mental wellness, made for university life.
          </p>
        </div>
        <FooterCol title="Product" items={["Dashboard", "Predict", "Insights", "Recovery"]} />
        <FooterCol title="Company" items={["About", "Research", "Privacy", "Contact"]} />
        <FooterCol title="Resources" items={["Guides", "Crisis support", "Help center", "Press"]} />
      </div>
      <div className="mx-auto mt-10 w-[min(1100px,calc(100%-2rem))] border-t border-border pt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} BurnoutGuard. Built with care for students.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="hover:text-foreground transition cursor-pointer">{i}</li>
        ))}
      </ul>
    </div>
  );
}
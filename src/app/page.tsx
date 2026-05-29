"use client";

import Link from "next/link";

import { MarketingNav, MarketingFooter } from "@/components/layout/Marketing";
import { GradientBlobs } from "@/components/visual/GradientBlobs";
import { StudentsIllustration } from "@/components/visual/Illustrations";
import { ScoreRing } from "@/components/visual/ScoreRing";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Sparkles,
  Brain,
  HeartPulse,
  ShieldCheck,
  Activity,
  Quote,
  Check,
  Minus,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="relative">
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <GradientBlobs />

        <div className="relative mx-auto grid w-[min(1100px,calc(100%-2rem))] gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Built for Gen-Z student life
            </div>

            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Understand your burnout
              <br />
              <span className="text-gradient">
                before it becomes dangerous.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              BurnoutGuard reads the small signals — sleep, screens, mood,
              workload — and tells you what's actually happening. No lectures.
              Just one small thing to try today.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/predict"
                className="group inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
              >
                Check my burnout risk

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold"
              >
                View dashboard
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
              <Trust label="Used at 40+ universities" />
              <Trust label="GDPR · FERPA aligned" />
              <Trust label="No data sold, ever" />
            </div>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary-light to-mint/40 blur-2xl opacity-70" />

            <div className="relative rounded-[32px] border border-border bg-surface p-5 shadow-float">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Today
                  </div>

                  <div className="font-display text-xl font-bold">
                    Burnout score
                  </div>
                </div>

                <div className="rounded-full bg-mint/40 px-2.5 py-0.5 text-xs font-semibold text-success">
                  Live
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-5">
                <ScoreRing value={42} size={150} />

                <div className="space-y-2">
                  <Bar label="Sleep" pct={62} />
                  <Bar label="Focus" pct={75} />
                  <Bar label="Mood" pct={58} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-primary-light/70 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI suggestion
                </div>

                <div className="mt-1 text-sm font-medium">
                  Phone away 30 min before bed. Predicted:{" "}
                  <span className="text-success">−18% risk</span> tomorrow.
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-6 -bottom-8 hidden rounded-2xl border border-border bg-surface p-3 shadow-float md:block animate-float">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-mint/50 text-success">
                  <HeartPulse className="h-4 w-4" />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Streak
                  </div>

                  <div className="text-sm font-bold">9 days</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 top-8 hidden rounded-2xl border border-border bg-surface p-3 shadow-float md:block animate-float"
              style={{ animationDelay: "-2s" }}
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary-light text-primary">
                  <Brain className="h-4 w-4" />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Focus
                  </div>

                  <div className="text-sm font-bold">+12%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check className="h-3.5 w-3.5 text-success" />
      {label}
    </span>
  );
}

function Bar({
  label,
  pct,
}: {
  label: string;
  pct: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="font-medium">{label}</span>

        <span className="text-muted-foreground tabular-nums">
          {pct}
        </span>
      </div>

      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-primary-light">
        <div
          className="h-full gradient-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft transition hover:shadow-float">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-light text-primary">
        {icon}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function Cell({
  children,
  head,
  className = "",
}: {
  children: React.ReactNode;
  head?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`bg-background px-5 py-4 ${
        head ? "font-semibold" : "text-muted-foreground"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ContrastRow({
  label,
  a,
  b,
}: {
  label: string;
  a: boolean;
  b: boolean;
}) {
  return (
    <>
      <Cell>{label}</Cell>

      <Cell className="bg-primary-light/30">
        {a ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Cell>

      <Cell>
        {b ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        )}
      </Cell>
    </>
  );
}
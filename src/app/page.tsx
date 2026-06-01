"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, HeartPulse, Check } from "lucide-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

// ── Marketing Nav ──────────────────────────────────────────────────────────────
function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(720px,calc(100%-1.5rem))]">
      <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface/80 px-4 py-2.5 shadow-float backdrop-blur-md">
        {/* Logo — selalu tampil */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
            <HeartPulse className="h-4 w-4" />
          </div>

          <span className="font-display text-base font-bold text-foreground">
            BurnoutGuard
          </span>
        </Link>

        {/* Nav links — sembunyikan di mobile agar tidak overflow */}
        <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition">
            Beranda
          </Link>
          <Link href="/about" className="hover:text-foreground transition">
            Tentang
          </Link>
        </nav>

        {/* Buttons — "Masuk" hanya tampil sm ke atas */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold hover:bg-accent transition"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="rounded-full gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden rounded-full p-2 hover:bg-accent"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

    </header>
  );
}

// ── Marketing Footer ───────────────────────────────────────────────────────────
function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface/60 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-base font-bold">BurnoutGuard</div>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Deteksi dini risiko burnout mahasiswa dengan kecerdasan buatan.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BurnoutGuard. Seluruh hak dilindungi.
        </p>
      </div>
    </footer>
  );
}

// ── Gradient Blobs ─────────────────────────────────────────────────────────────
function GradientBlobs() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "linear-gradient(160deg, var(--primary-light) 0%, var(--mint, #d4f7e8) 40%, var(--background) 80%)",
        }}
      />
      {/* Blob kiri — diperkecil agar tidak overflow di mobile */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl -z-10 sm:-top-40 sm:-left-40 sm:h-[700px] sm:w-[700px]"
        style={{ background: "var(--primary-light)" }}
      />
      {/* Blob kanan — dipotong agar tidak bikin horizontal scroll */}
      <div
        className="pointer-events-none absolute top-10 -right-20 h-[300px] w-[300px] rounded-full opacity-20 blur-3xl -z-10 sm:top-20 sm:right-0 sm:h-[500px] sm:w-[500px]"
        style={{ background: "var(--mint, #d4f7e8)" }}
      />
    </>
  );
}

// ── Risk helpers ───────────────────────────────────────────────────────────────
const riskColor = (level: string) => {
  if (level === "Low") return { bg: "var(--mint)", text: "var(--success)" };
  if (level === "High")
    return {
      bg: "color-mix(in oklab,var(--danger) 20%,transparent)",
      text: "var(--danger)",
    };
  return {
    bg: "color-mix(in oklab,var(--warning) 25%,transparent)",
    text: "var(--warning)",
  };
};
const riskLabel = (level: string) =>
  level === "Low" ? "Rendah" : level === "High" ? "Tinggi" : "Sedang";

const demoPrediction = {
  prediction: "Medium" as "Low" | "Medium" | "High",
  confidence: 0.78,
  probabilities: { Low: 0.13, Medium: 0.78, High: 0.09 },
  created_at: new Date().toISOString(),
};

// ── Hero Burnout Card ──────────────────────────────────────────────────────────
function HeroBurnoutCard() {
  const latest = demoPrediction;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-light via-surface to-mint/40 p-5 shadow-float sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Prediksi Terakhir
        </div>
        <div className="rounded-full bg-mint/40 px-2.5 py-0.5 text-xs font-semibold text-success">
          Live
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Risk label */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-3xl font-bold sm:text-4xl">
              {riskLabel(latest.prediction)}
            </h3>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: riskColor(latest.prediction).bg,
                color: riskColor(latest.prediction).text,
              }}
            >
              {riskLabel(latest.prediction)}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Kepercayaan model:{" "}
            <strong>{Math.round(latest.confidence * 100)}%</strong>
          </p>

          {/* Probability bars */}
          <div className="mt-3 space-y-1.5">
            {(["Low", "Medium", "High"] as const).map((k) => (
              <div key={k} className="flex items-center gap-2 text-xs">
                <span className="w-14 text-muted-foreground shrink-0">
                  {riskLabel(k)}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-light min-w-0">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((latest.probabilities[k] ?? 0) * 100)}%`,
                      background:
                        k === "Low"
                          ? "var(--success)"
                          : k === "High"
                          ? "var(--danger)"
                          : "var(--warning)",
                    }}
                  />
                </div>
                <span className="w-9 text-right font-semibold tabular-nums shrink-0">
                  {Math.round((latest.probabilities[k] ?? 0) * 100)}%
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(latest.created_at).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Emoji indicator — lebih kecil di mobile */}
        <div
          className="grid h-20 w-20 place-items-center rounded-2xl text-3xl font-black shadow-soft shrink-0 sm:h-28 sm:w-28 sm:rounded-3xl sm:text-4xl"
          style={{
            background: riskColor(latest.prediction).bg,
            color: riskColor(latest.prediction).text,
          }}
        >
          {latest.prediction === "Low"
            ? "😌"
            : latest.prediction === "Medium"
            ? "😐"
            : "😰"}
        </div>
      </div>

      {/* AI suggestion */}
      <div className="mt-5 rounded-2xl bg-primary-light/70 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          Langkah Rekomendasi 
        </div>
        <div className="mt-1 text-sm font-medium">
          Singkirkan HP 30 menit sebelum tidur. Prediksi:{" "}
          <span className="text-success">−18% risiko</span> besok.
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    // overflow-x-hidden mencegah blob horizontal scroll
    <div className="relative min-h-screen overflow-x-hidden">
      <GradientBlobs />
      <MarketingNav />

      {/* HERO */}
      <section className="relative pt-24 pb-24 sm:pt-28 sm:pb-32">
        <div className="relative mx-auto grid w-[min(1100px,calc(100%-2rem))] gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Dirancang untuk kehidupan mahasiswa
            </div>

            {/* Heading — bertahap dari mobile ke desktop */}
            <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.05]">
              Kenali burnout-mu
              <br />
              <span className="text-gradient">sebelum jadi berbahaya.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
BurnoutGuard membaca pola harianmu—tidur, screen time, mood, dan beban kerja—untuk menunjukkan apa yang sebenarnya memengaruhi kondisimu. Hanya satu langkah kecil yang relevan untuk dicoba hari ini.

            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <Link
                href="/predict"
                className="group inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 sm:px-6 sm:py-3"
              >
                Cek risiko burnout saya
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold sm:px-6 sm:py-3"
              >
                Lihat dashboard
              </Link>
            </div>
          </motion.div>

          {/* Right — burnout card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-primary-light to-mint/40 blur-2xl opacity-60 sm:-inset-6 sm:rounded-[40px] sm:opacity-70" />

            <div className="relative">
              <HeroBurnoutCard />
            </div>

            {/* Floating streak badge — hanya md ke atas agar tidak keluar layar */}
            <div className="absolute -left-4 -bottom-6 hidden rounded-2xl border border-border bg-surface p-3 shadow-float md:-left-6 md:-bottom-8 md:block animate-float">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-mint/50 text-success">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Streak
                  </div>
                  <div className="text-sm font-bold">7 hari</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-16 w-[min(1100px,calc(100%-2rem))] text-center rounded-3xl border border-border bg-gradient-to-br from-primary-light via-surface to-mint/40 p-6 shadow-soft sm:p-10"
      >
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Mulai deteksi burnout-mu sekarang.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Gratis, cepat, dan tanpa ceramah. Isi satu form singkat dan
          BurnoutGuard akan memberitahumu apa yang sebenarnya terjadi.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 justify-center sm:mt-6">
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition sm:px-6 sm:py-3"
          >
            Cek Risiko Burnout
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-accent transition sm:px-6 sm:py-3"
          >
            Daftar Gratis
          </Link>
        </div>
      </motion.section>

      <MarketingFooter />
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check className="h-3.5 w-3.5 text-success shrink-0" />
      {label}
    </span>
  );
}
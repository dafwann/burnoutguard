"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Brain,
  HeartPulse,
  ShieldCheck,
  BarChart2,
  Sparkles,
  Users,
  Code2,
  Database,
  Globe,
  Menu,
  X,
} from "lucide-react";


// ── Marketing Nav ──────────────────────────────────────────────────────────────
function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(720px,calc(100%-1.5rem))]">
      <div className="relative">
        <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface/80 px-4 py-2.5 shadow-float backdrop-blur-md">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>

            <span className="font-display text-base font-bold text-foreground">
              BurnoutGuard
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition">
              Beranda
            </Link>

            <Link
              href="/about"
              className="text-foreground font-semibold"
            >
              Tentang
            </Link>
          </nav>

          {/* Desktop Buttons */}
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
              Daftar Gratis
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

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-surface p-4 shadow-float backdrop-blur sm:hidden">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-medium"
              >
                Beranda
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="font-semibold text-primary"
              >
                Tentang
              </Link>

              <div className="h-px bg-border" />

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-center font-medium"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl gradient-primary px-4 py-2 text-center font-semibold text-primary-foreground"
              >
                Daftar Gratis
              </Link>
            </nav>
          </div>
        )}
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
            Bantu deteksi dini risiko burnout berbasis AI.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BurnoutGuard. Seluruh hak dilindungi.
        </p>
      </div>
    </footer>
  );
}

// ── Background ─────────────────────────────────────────────────────────────────
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
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl -z-10 sm:-top-40 sm:-left-40 sm:h-[700px] sm:w-[700px]"
        style={{ background: "var(--primary-light)" }}
      />
      <div
        className="pointer-events-none absolute top-10 -right-20 h-[300px] w-[300px] rounded-full opacity-15 blur-3xl -z-10 sm:top-20 sm:right-0 sm:h-[500px] sm:w-[500px]"
        style={{ background: "var(--mint, #d4f7e8)" }}
      />
    </>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    id: "CFCC208D6Y1547",
    name: "Andi Muh. Daffa Dermawan",
    role: "Full-Stack Web Developer",
    icon: Code2,
    color: "var(--success)",
    bg: "var(--mint)",
  },
  {
    id: "CACC208D6Y1660",
    name: "Ahmad Farel Algifhari",
    role: "AI Engineer",
    icon: Brain,
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    id: "CDCC208D6Y0375",
    name: "Imam Dza Qhoir",
    role: "Data Science",
    icon: Database,
    color: "var(--warning)",
    bg: "color-mix(in oklab, var(--warning) 15%, transparent)",
  },
  {
    id: "CACC208D6Y0537",
    name: "Muhammad Fadhil Mulyadi",
    role: "AI Engineer",
    icon: Brain,
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    id: "CFCC438D6X2443",
    name: "Nur Fadhilah Amaliah",
    role: "Full-Stack Web Developer",
    icon: Globe,
    color: "var(--success)",
    bg: "var(--mint)",
  },
  {
    id: "CDC208D6X1265",
    name: "Nurul Fakhira Amanah M. Adil",
    role: "Data Science",
    icon: Database,
    color: "var(--warning)",
    bg: "color-mix(in oklab, var(--warning) 15%, transparent)",
  },
];

const FEATURES = [
  {
    icon: HeartPulse,
    title: "Input Form Gaya Hidup",
    body: "Pengguna dapat mengisi data harian seperti jam tidur, screen time, jam belajar, tingkat kecemasan dan lainnya.",
  },
  {
    icon: Brain,
    title: "Prediksi AI Akurat",
    body: "Model Deep Learning berbasis TensorFlow yang mengelompokkan risiko burnout ke tiga level: Rendah, Sedang, dan Tinggi — dengan target akurasi minimal 85%.",
  },
  {
    icon: Sparkles,
    title: "Rekomendasi Actionable",
    body: "Sistem memberikan saran konkret seperti \"kurangi screen time 30 menit sebelum tidur\" atau \"tingkatkan waktu tidur\", bukan hanya angka.",
  },
  {
    icon: BarChart2,
    title: "Dashboard & Visualisasi",
    body: "Grafik kondisi pengguna berupa bar chart, heatmap, tren risiko, dan distribusi probabilitas untuk memahami pola burnout dari waktu ke waktu.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi & Keamanan",
    body: "Data pengguna dikelola dengan aman. Tidak ada data yang dijual atau dibagikan ke pihak ketiga.",
  },
  {
    icon: Users,
    title: "Dibangun untuk Mahasiswa",
    body: "Dirancang khusus untuk mahasiswa Indonesia yang menghadapi tekanan akademik, sosial, dan gaya hidup digital sehari-hari.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GradientBlobs />
      <MarketingNav />

      <main className="mx-auto w-[min(1000px,calc(100%-2rem))] space-y-16 pt-24 pb-20 sm:space-y-24 sm:pt-32 sm:pb-24">

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur mb-4 sm:mb-5">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="text-center">
              Coding Camp 2026 · DBS Foundation · CC26-PSU126
            </span>
          </div>

          {/* Heading bertahap */}
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Tentang <span className="text-gradient">BurnoutGuard</span>
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-sm text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
            BurnoutGuard adalah sistem deteksi dini risiko burnout berbasis AI yang membantu
            mahasiswa mengenali tanda-tanda kelelahan mental sejak awal sebelum berdampak
            lebih jauh pada aktivitas sehari-hari.
          </p>

          {/* Badge tema — wrap di mobile */}
          <div className="mt-4 inline-flex flex-wrap justify-center items-center gap-1 rounded-2xl border border-border bg-surface/60 px-4 py-2 text-sm text-muted-foreground">
            Tema Capstone:
            <span className="font-semibold text-foreground">
              Healthy Lives &amp; Well-being
            </span>
          </div>
        </motion.section>

        {/* ── Latar Belakang ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Latar Belakang</SectionLabel>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Mengapa burnout mahasiswa penting?
          </h2>

          {/* Stats — 1 kolom di mobile, 3 di md */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatHighlight
              value="30%"
              label="masyarakat Indonesia diperkirakan mengalami penyakit mental"
              source="Menkes Budi Gunadi Sadikin"
            />
            <StatHighlight
              value="15,5 juta"
              label="remaja usia 15–24 tahun mengalami gangguan kecemasan & depresi"
              source="Data nasional"
            />
            <StatHighlight
              value="9%"
              label="yang mendapat akses layanan psikolog profesional"
              source="Data nasional"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Krisis kesehatan mental di kalangan mahasiswa Indonesia telah
              mencapai tingkat yang mengkhawatirkan, namun sebagian besar kasus
              tidak terdeteksi secara dini karena minimnya kesadaran dan akses
              layanan. Survei di UNESA terhadap 1.219 mahasiswa menemukan{" "}
              <strong className="text-foreground">
                21,9% berada dalam kelompok risiko tinggi
              </strong>{" "}
              kesehatan mental. Rasio psikolog di Indonesia baru mencapai
              1:200.000 penduduk — jauh dari standar WHO 1:30.000.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              BurnoutGuard hadir sebagai{" "}
              <strong className="text-foreground">
                lapisan pertama (first layer of defense)
              </strong>{" "}
              yang mendorong mahasiswa mengambil langkah awal sebelum kondisinya
              memburuk, dengan memanfaatkan data gaya hidup sehari-hari yang
              mudah diisi — jam tidur, screen time, jam belajar, tingkat kecemasan dan lainnya.
            </p>
          </div>
        </motion.section>

        {/* ── Fitur ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Fitur Utama</SectionLabel>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Apa saja yang dapat dilakukan BurnoutGuard? {/* ── atau mau ambil yang ini? : Fitur yang tersedia di BurnoutGuard ── */}
          </h2>

          {/* 1 kolom mobile → 2 kolom sm → 3 kolom lg */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-3xl border border-border bg-surface p-5 shadow-soft hover:shadow-float transition sm:p-6"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-light text-primary shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Team ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Tim Pengembang</SectionLabel>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            6 orang, 3 keahlian, satu tujuan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            BurnoutGuard dikembangkan oleh tim yang terdiri dari anggota dengan keahlian di
            bidang AI Engineering, Data Science, dan Full-Stack Web Development.
          </p>

          {/* 1 kolom mobile → 2 kolom sm → 3 kolom lg */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-3xl border border-border bg-surface p-5 shadow-soft hover:shadow-float transition"
              >
                {/* Avatar */}
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl text-base font-black shrink-0"
                  style={{ background: member.bg, color: member.color }}
                >
                  {member.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Nama — bisa panjang, biarkan wrap */}
                <h3 className="mt-3 font-display text-sm font-bold leading-snug break-words">
                  {member.name}
                </h3>

                <div className="mt-1 flex items-center gap-1.5">
                  <member.icon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: member.color }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: member.color }}
                  >
                    {member.role}
                  </span>
                </div>

                {/* ID — font mono kecil, biarkan overflow wrap */}
                <div className="mt-2 text-[10px] font-mono text-muted-foreground/60 break-all">
                  {member.id}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <MarketingFooter />
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
      <span className="h-px w-6 bg-primary/40 inline-block" />
      {children}
    </div>
  );
}

function StatHighlight({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft text-center">
      <div className="font-display text-3xl font-black text-gradient sm:text-4xl">
        {value}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-[10px] text-muted-foreground/60 italic">{source}</p>
    </div>
  );
}

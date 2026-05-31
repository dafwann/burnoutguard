"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  Flame, TrendingUp, Clock, BarChart2, Quote, ChevronRight, Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface PredictionRecord {
  id: string;
  created_at: string;
  timestamp?: string;
  prediction: "Low" | "Medium" | "High";
  confidence: number;
  probabilities: { Low: number; Medium: number; High: number };
  recommendations?: string[];
  anxiety_level?: number;
  peer_pressure?: number;
  screen_time?: number;
  sleep_hours?: number;
  study_hours?: number;
  family_support?: number;
}

// ── Quotes ─────────────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "Istirahat bukan hadiah setelah selesai — tapi strategi untuk mulai.", author: "Anonim" },
  { text: "Kelelahan bukan lencana kehormatan. Jaga dirimu.", author: "BurnoutGuard" },
  { text: "Satu langkah kecil hari ini lebih baik daripada tidak sama sekali.", author: "Lao Tzu" },
  { text: "Mahasiswa terbaik bukan yang paling rajin, tapi yang paling sehat.", author: "BurnoutGuard" },
  { text: "Tidur yang cukup adalah investasi terbaik untuk otakmu.", author: "Matthew Walker" },
  { text: "Jangan bandingkan perjalananmu dengan orang lain. Fokus pada dirimu.", author: "Anonim" },
  { text: "Setiap hari adalah kesempatan baru untuk merawat dirimu sendiri.", author: "BurnoutGuard" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function computeStreak(records: PredictionRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(records.map((r) => new Date(r.created_at).toDateString()));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) streak++;
    else break;
  }
  return streak;
}

const riskColor = (level: string) => {
  if (level === "Low") return { bg: "var(--mint)", text: "var(--success)" };
  if (level === "High") return { bg: "color-mix(in oklab,var(--danger) 20%,transparent)", text: "var(--danger)" };
  return { bg: "color-mix(in oklab,var(--warning) 25%,transparent)", text: "var(--warning)" };
};

const riskLabel = (level: string) => {
  if (level === "Low") return "Rendah";
  if (level === "High") return "Tinggi";
  return "Sedang";
};

const tip = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

// ── Shared Components ──────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-light text-primary shrink-0">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const c = riskColor(level);
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0"
      style={{ background: c.bg, color: c.text }}
    >
      {riskLabel(level)}
    </span>
  );
}

// ── Streak Widget ──────────────────────────────────────────────────────────────
function StreakWidget({ records }: { records: PredictionRecord[] }) {
  const today = new Date();
  const activeDays = new Set(records.map((r) => new Date(r.created_at).toDateString()));
  const streak = computeStreak(records);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const label = d.toLocaleDateString("id-ID", { weekday: "short" });
    const active = activeDays.has(d.toDateString());
    const isToday = i === 6;
    return { label, active, isToday };
  });

  return (
    <Card>
      <CardTitle icon={<Flame className="h-4 w-4" />}>Streak Harian</CardTitle>
      {/* gap-1 + min-w-0 agar tidak overflow di layar kecil */}
      <div className="mt-4 flex items-end justify-between gap-1 min-w-0">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1 min-w-0">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center transition sm:h-8 sm:w-8 ${
                d.active
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : d.isToday
                  ? "border-2 border-primary bg-surface text-primary"
                  : "bg-accent/60 text-muted-foreground"
              }`}
            >
              {d.active
                ? <Flame className="h-3.5 w-3.5" />
                : <span className="text-[10px]">·</span>
              }
            </div>
            <span className="text-[9px] text-muted-foreground sm:text-[10px]">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold">{streak}</span>
        <span className="text-xs text-muted-foreground">/ 7 hari aktif</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {streak === 0
          ? "Mulai prediksi hari ini untuk membangun streak!"
          : streak === 7
          ? "Sempurna! Kamu aktif selama 7 hari berturut-turut 🎉"
          : `${7 - streak} hari lagi untuk streak sempurna minggu ini.`}
      </p>
    </Card>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, delta, tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  tone?: "good" | "bad" | "neutral";
}) {
  const color =
    tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-muted-foreground";
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-light text-primary shrink-0">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-bold sm:text-3xl">{value}</span>
        <span className={`text-xs font-semibold text-right ${color}`}>{delta}</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [range, setRange] = useState<"week" | "month">("week");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setDisplayName(
          user.user_metadata?.full_name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "User"
        );

        const { data, error } = await supabase
          .from("predictions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) { console.error(error); return; }

        setRecords(
          (data || []).map((item) => ({
            ...item,
            probabilities: {
              Low: Number(item.low_probability ?? 0),
              Medium: Number(item.medium_probability ?? 0),
              High: Number(item.high_probability ?? 0),
            },
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    loadPredictions();
  }, []);

  const latest = records[records.length - 1] ?? null;
  const quote = getDailyQuote();
  const total = records.length;
  const avgConf = total
    ? Math.round((records.reduce((a, r) => a + r.confidence, 0) / total) * 100)
    : 0;
  const highCount = records.filter((r) => r.prediction === "High").length;

  const trendData = records.slice(-7).map((r, i) => ({
    idx: `#${records.length - Math.min(7, records.length) + i + 1}`,
    Risiko: r.prediction === "Low" ? 1 : r.prediction === "Medium" ? 2 : 3,
  }));

  const distData = (() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    records.forEach((r) => counts[r.prediction]++);
    return [
      { name: "Rendah", value: counts.Low, fill: "var(--success)" },
      { name: "Sedang", value: counts.Medium, fill: "var(--warning)" },
      { name: "Tinggi", value: counts.High, fill: "var(--danger)" },
    ].filter((d) => d.value > 0);
  })();

  const filteredRecords = records.filter((r) => {
    const diff = (Date.now() - new Date(r.created_at).getTime()) / 86400000;
    return range === "week" ? diff <= 7 : diff <= 30;
  });

  const avg = (key: keyof PredictionRecord) =>
    filteredRecords.reduce((a, r) => a + ((r[key] as number) ?? 0), 0) /
    Math.max(filteredRecords.length, 1);

  const riskFactors = [
    { label: "Kecemasan", value: avg("anxiety_level") },
    { label: "Tekanan Teman", value: avg("peer_pressure") },
    { label: "Screen Time", value: avg("screen_time") },
    { label: "Tidur", value: avg("sleep_hours") },
  ];

  const heatmapData = Array.from({ length: 28 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (27 - i));
    const dayStr = day.toDateString();
    const dayRecords = records.filter(
      (r) => new Date(r.created_at).toDateString() === dayStr
    );
    if (!dayRecords.length) return { day: dayStr, intensity: 0, hasData: false };
    const a =
      dayRecords.reduce(
        (acc, r) => acc + (r.prediction === "Low" ? 20 : r.prediction === "Medium" ? 55 : 90),
        0
      ) / dayRecords.length;
    return { day: dayStr, intensity: Math.round(a), hasData: true };
  });

  const timeMixRaw = [
    { name: "Tidur", value: avg("sleep_hours") },
    { name: "Belajar", value: avg("study_hours") },
    { name: "Screen Time", value: avg("screen_time") },
  ];
  const timeMixTotal = timeMixRaw.reduce((a, d) => a + d.value, 0) || 1;
  const timeMixData = timeMixRaw.map((d) => ({
    ...d,
    pct: Math.round((d.value / timeMixTotal) * 100),
  }));
  const TIME_MIX_COLORS = ["var(--primary)", "var(--warning)", "var(--mint)"];

  const radarData = [
    { axis: "Tidur", value: avg("sleep_hours") },
    { axis: "Belajar", value: avg("study_hours") },
    { axis: "Kecemasan", value: avg("anxiety_level") },
    { axis: "Dukungan", value: avg("family_support") },
  ];

  return (
    // overflow-x-hidden cegah chart overflow di mobile
    <div className="mx-auto max-w-7xl space-y-5 overflow-x-hidden p-4 sm:space-y-6 md:p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Selamat datang kembali{" "}
            <span className="font-semibold text-foreground">{displayName}</span>
          </p>
          {/* Heading lebih kecil di mobile */}
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Dasbor BurnoutGuard
          </h2>
        </div>
        <div className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
          {total} prediksi tersimpan
        </div>
      </div>

      {/* ── Hero + Quote ── */}
      {/* 1 kolom di mobile, 3 kolom di lg */}
      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-light via-surface to-mint/40 p-5 shadow-soft sm:p-6 lg:col-span-2"
        >
          {latest ? (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Prediksi Terakhir
                </div>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <h3 className="font-display text-3xl font-bold sm:text-4xl">
                    {riskLabel(latest.prediction)}
                  </h3>
                  <RiskBadge level={latest.prediction} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Kepercayaan model:{" "}
                  <strong>{Math.round(latest.confidence * 100)}%</strong>
                </p>
                {/* Probability bars — min-w-0 cegah overflow */}
                <div className="mt-3 space-y-1.5">
                  {(["Low", "Medium", "High"] as const).map((k) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <span className="w-14 shrink-0 text-muted-foreground">{riskLabel(k)}</span>
                      <div className="h-1.5 flex-1 min-w-0 overflow-hidden rounded-full bg-primary-light">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round((latest.probabilities[k] ?? 0) * 100)}%`,
                            background:
                              k === "Low" ? "var(--success)"
                              : k === "High" ? "var(--danger)"
                              : "var(--warning)",
                          }}
                        />
                      </div>
                      <span className="w-9 shrink-0 text-right font-semibold tabular-nums">
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
              {/* Emoji box — lebih kecil di mobile */}
              <div
                className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl font-black shadow-soft sm:h-28 sm:w-28 sm:rounded-3xl sm:text-4xl"
                style={{
                  background: riskColor(latest.prediction).bg,
                  color: riskColor(latest.prediction).text,
                }}
              >
                {latest.prediction === "Low" ? "😌"
                  : latest.prediction === "Medium" ? "😐"
                  : "😰"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Belum Ada Prediksi
              </div>
              <h3 className="font-display text-2xl font-bold leading-snug">
                Mulai prediksi pertamamu.
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Pergi ke halaman Prediksi, isi form, dan lihat hasilnya di sini.
              </p>
              <Link
                href="/predict"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
              >
                Mulai Prediksi <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quote */}
        <Card className="bg-gradient-to-br from-mint/50 to-primary-light flex flex-col justify-between">
          <div>
            <Quote className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-base font-semibold leading-snug sm:text-lg">
              &ldquo;{quote.text}&rdquo;
            </p>
            <div className="mt-2 text-xs text-muted-foreground">— {quote.author}</div>
          </div>
          <div className="mt-4 text-[10px] font-medium uppercase tracking-widest text-primary/60">
            Quotes Hari Ini
          </div>
        </Card>
      </div>

      {/* ── Recommendations ── */}
      {latest?.recommendations && latest.recommendations.length > 0 && (
        <Card>
          <CardTitle icon={<Zap className="h-4 w-4" />}>
            Langkah Rekomendasi
          </CardTitle>
          <div className="mt-4 space-y-3">
            {latest.recommendations.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-background p-3 text-sm sm:p-4"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Stats ── */}
      {/* 1 kolom di mobile → 3 kolom md */}
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        <StatCard
          icon={<BarChart2 className="h-4 w-4" />}
          label="Total Prediksi"
          value={String(total)}
          delta="keseluruhan"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Rata-rata Kepercayaan"
          value={total ? `${avgConf}%` : "—"}
          delta="model AI"
        />
        <StatCard
          icon={<Zap className="h-4 w-4" />}
          label="Risiko Tinggi"
          value={String(highCount)}
          delta={total ? `dari ${total} prediksi` : "belum ada"}
          tone={highCount > 0 ? "bad" : "good"}
        />
      </div>

      {/* ── Streak + Tren ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <StreakWidget records={records} />

        <Card className="lg:col-span-2">
          <CardTitle icon={<TrendingUp className="h-4 w-4" />}>
            Tren Risiko Burnout
          </CardTitle>
          {trendData.length > 1 ? (
            <div className="mt-4 h-48 sm:h-52">
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gRisk" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="idx" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis
                    domain={[0.5, 3.5]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) => (v === 1 ? "Rendah" : v === 2 ? "Sedang" : "Tinggi")}
                    stroke="var(--muted-foreground)"
                    fontSize={9}
                    width={46}
                  />
                  <Tooltip
                    contentStyle={tip}
                    formatter={(v: number) =>
                      v === 1 ? "Rendah" : v === 2 ? "Sedang" : "Tinggi"
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="Risiko"
                    stroke="var(--primary)"
                    fill="url(#gRisk)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 flex h-48 items-center justify-center text-sm text-muted-foreground text-center px-4">
              Butuh minimal 2 prediksi untuk menampilkan tren.
            </div>
          )}
        </Card>
      </div>

      {/* ── Distribusi + Riwayat ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardTitle>Distribusi Risiko</CardTitle>
          {distData.length > 0 ? (
            <>
              <div className="mt-2 h-44 sm:h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={distData} dataKey="value" innerRadius={44} outerRadius={72} paddingAngle={3}>
                      {distData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={tip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {distData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value}x</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 flex h-44 items-center justify-center text-sm text-muted-foreground">
              Belum ada data distribusi.
            </div>
          )}
        </Card>

        {/* Riwayat */}
        <Card className="lg:col-span-2">
          <CardTitle icon={<Clock className="h-4 w-4" />}>Riwayat Prediksi</CardTitle>
          {records.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {[...records].reverse().slice(0, 6).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {new Date(r.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {Math.round(r.confidence * 100)}%
                    </span>
                    <RiskBadge level={r.prediction} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="text-3xl">📊</div>
              <p className="text-sm text-muted-foreground">
                Belum ada riwayat prediksi. Lakukan prediksi pertama dan simpan hasilnya.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Bar Chart Rata-rata Probabilitas ── */}
      {records.length > 0 && (
        <Card>
          <CardTitle icon={<BarChart2 className="h-4 w-4" />}>
            Rata-rata Probabilitas Semua Prediksi
          </CardTitle>
          <div className="mt-4 h-44 sm:h-48">
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: "Rendah", nilai: Math.round((records.reduce((a, r) => a + (r.probabilities.Low ?? 0), 0) / total) * 100) },
                  { name: "Sedang", nilai: Math.round((records.reduce((a, r) => a + (r.probabilities.Medium ?? 0), 0) / total) * 100) },
                  { name: "Tinggi", nilai: Math.round((records.reduce((a, r) => a + (r.probabilities.High ?? 0), 0) / total) * 100) },
                ]}
                barSize={40}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  width={36}
                />
                <Tooltip contentStyle={tip} formatter={(v: number) => [`${v}%`, "Rata-rata"]} />
                <Bar dataKey="nilai" radius={[8, 8, 0, 0]}>
                  {[
                    { fill: "var(--success)" },
                    { fill: "var(--warning)" },
                    { fill: "var(--danger)" },
                  ].map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* ── Faktor Risiko + Radar ── */}
      {/* 1 kolom mobile → 2 kolom lg */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Faktor Risiko Burnout</CardTitle>
          <div className="mt-4 flex justify-end">
            <div className="flex gap-1 rounded-full bg-accent p-1">
              {(["week", "month"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    range === r ? "bg-surface shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {riskFactors.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-xs">
                  <span>{f.label}</span>
                  <span>{f.value.toFixed(1)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-accent">
                  <div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${Math.min((f.value / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Wellness Radar</CardTitle>
          <div className="mt-4 h-64 sm:h-72">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                <Radar
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Heatmap + Time Mix ── */}
      {/* 1 kolom mobile → lg: heatmap 2 kolom, time mix 1 kolom */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Heatmap Burnout · 28 Hari Terakhir</CardTitle>
          <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="text-center text-[9px] font-medium text-muted-foreground pb-1 sm:text-[10px]">
                {d}
              </div>
            ))}
            {heatmapData.map((cell, i) => (
              <div
                key={i}
                title={`${cell.day}: ${cell.hasData ? `${cell.intensity}% burnout` : "Tidak ada data"}`}
                className="aspect-square rounded-sm transition-transform hover:scale-110 cursor-default sm:rounded-md"
                style={{
                  background: cell.hasData
                    ? `color-mix(in oklab, var(--danger) ${cell.intensity}%, var(--primary-light))`
                    : "var(--accent)",
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Rendah</span>
            <div
              className="h-2 w-20 rounded-full sm:w-24"
              style={{
                background:
                  "linear-gradient(to right, var(--primary-light), color-mix(in oklab, var(--danger) 90%, var(--primary-light)))",
              }}
            />
            <span>Tinggi burnout</span>
          </div>
        </Card>

        <Card>
          <CardTitle>Komposisi Waktu Harian</CardTitle>
          {timeMixData.some((d) => d.value > 0) ? (
            <>
              <div className="mt-2 h-48 sm:h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={timeMixData} dataKey="pct" innerRadius={44} outerRadius={78} paddingAngle={3}>
                      {timeMixData.map((_, i) => (
                        <Cell key={i} fill={TIME_MIX_COLORS[i % TIME_MIX_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tip}
                      formatter={(v: number, _name: string, entry: any) => [
                        `${v}% (${entry.payload.value.toFixed(1)} jam)`,
                        entry.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-2">
                {timeMixData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TIME_MIX_COLORS[i] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {d.value.toFixed(1)}j · {d.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 flex h-48 items-center justify-center text-sm text-muted-foreground">
              Belum ada data waktu.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
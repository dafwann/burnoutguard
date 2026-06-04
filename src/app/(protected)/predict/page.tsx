"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Brain, Sparkles, Save, AlertCircle, CheckCircle2, HelpCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
interface PredictionResult {
  prediction: "Low" | "Medium" | "High";
  confidence: number;
  probabilities: { Low: number; Medium: number; High: number };
}

interface FormState {
  Age: string;
  Study_Hours: string;
  Class_Attendance: string;
  Exam_Frequency: string;
  Assignment_Load: string;
  Sleep_Hours: string;
  Social_Media_Use: string;
  Screen_Time: string;
  Peer_Pressure: string;
  Family_Support: string;
  Anxiety_Level: string;
}

interface FormErrors {
  [key: string]: string;
}

interface RecommendationData {
  intro: string;
  tips: string[];
}

// ── Constants ──────────────────────────────────────────────────────────────────
const FIELD_META: {
  key: keyof FormState;
  label: string;
  min: number;
  max: number;
  hint: string;
  description: string;
}[] = [
  {
    key: "Age",
    label: "Usia",
    min: 15,
    max: 60,
    hint: "tahun",
    description:
      "Usia kamu saat ini dalam satuan tahun. Usia dapat mempengaruhi seberapa baik seseorang mampu mengelola beban akademik dan tekanan kehidupan kampus. Perbedaan usia seringkali menentukan cara dan kematangan mahasiswa dalam menghadapi stres.",
  },
  {
    key: "Study_Hours",
    label: "Jam Belajar",
    min: 0,
    max: 24,
    hint: "jam/hari",
    description:
      "Rata-rata waktu (dalam jam) yang kamu habiskan setiap harinya untuk belajar, membaca materi, atau mereview catatan di luar jam kelas resmi. Belajar terlalu lama tanpa istirahat yang cukup dapat secara drastis mempercepat terjadinya kelelahan mental.",
  },
  {
    key: "Class_Attendance",
    label: "Kehadiran Kelas",
    min: 0,
    max: 100,
    hint: "%",
    description:
      "Persentase kehadiran kamu di kelas selama semester berjalan. Tingkat kehadiran yang rendah seringkali memicu kecemasan akibat materi yang tertinggal, sementara kehadiran tinggi menunjukkan rutinitas yang baik meskipun tetap harus diimbangi dengan istirahat.",
  },
  {
    key: "Exam_Frequency",
    label: "Frekuensi Ujian",
    min: 0,
    max: 30,
    hint: "per bulan",
    description:
      "Jumlah ujian, kuis, atau evaluasi akademik yang kamu hadapi dalam periode satu bulan. Frekuensi ujian yang terlalu padat merupakan salah satu pemicu stres terbesar dan berhubungan erat dengan peningkatan drastis risiko burnout.",
  },
  {
    key: "Assignment_Load",
    label: "Beban Tugas",
    min: 0,
    max: 20,
    hint: "tugas/minggu",
    description:
      "Jumlah tugas akademik, presentasi, atau proyek yang harus kamu selesaikan dalam setiap minggunya. Menumpuknya beban tugas tanpa pengaturan manajemen waktu yang baik akan meningkatkan tekanan psikologis secara signifikan.",
  },
  {
    key: "Sleep_Hours",
    label: "Jam Tidur",
    min: 0,
    max: 24,
    hint: "jam/hari",
    description:
      "Rata-rata jumlah waktu yang kamu gunakan untuk tidur setiap harinya. Kurang tidur kronis adalah salah satu prediktor utama terjadinya kelelahan fisik dan mental yang berujung pada burnout. Tubuh manusia idealnya membutuhkan 7-8 jam waktu tidur.",
  },
  {
    key: "Social_Media_Use",
    label: "Penggunaan Media Sosial",
    min: 0,
    max: 24,
    hint: "jam/hari",
    description:
      "Waktu rata-rata yang kamu habiskan secara spesifik untuk berselancar di media sosial setiap harinya. Penggunaan berlebihan terbukti dapat mengurangi kualitas waktu istirahat dan memicu rasa cemas akibat fenomena FOMO (Fear Of Missing Out).",
  },
  {
    key: "Screen_Time",
    label: "Waktu Layar",
    min: 0,
    max: 24,
    hint: "jam/hari",
    description:
      "Total durasi waktu kumulatif (dalam jam) yang kamu habiskan di depan layar setiap harinya, baik itu layar HP, tablet, maupun laptop untuk segala keperluan. Overstimulasi layar sering menjadi penyebab utama kelelahan mata dan pikiran.",
  },
  {
    key: "Peer_Pressure",
    label: "Tekanan Teman Sebaya",
    min: 0,
    max: 10,
    hint: "skala 0–10",
    description:
      "Evaluasi subyektif (0 = tidak ada tekanan, 10 = tekanan ekstrem) mengenai seberapa besar dorongan yang kamu rasakan untuk mengikuti standar sosial, tren, dan gaya hidup teman-teman di kampus. Tekanan sosial ini sangat menguras energi emosional.",
  },
  {
    key: "Family_Support",
    label: "Dukungan Keluarga",
    min: 0,
    max: 10,
    hint: "skala 0–10",
    description:
      "Tingkat dukungan keluarga dengan skala 0 (tanpa dukungan) hingga 10 (sangat didukung). Dukungan ini mencakup aspek emosional, moral, dan finansial. Keluarga yang suportif terbukti kuat menjadi pelindung (buffer) alami dari stres akademik.",
  },
  {
    key: "Anxiety_Level",
    label: "Tingkat Kecemasan",
    min: 0,
    max: 10,
    hint: "skala 0–10",
    description:
      "Estimasi tingkat kecemasan atau stres harian kamu pada rentang 0 (sangat tenang) hingga 10 (sangat panik/khawatir). Kecemasan yang dibiarkan tanpa kelola dapat mempercepat burnout, menurunkan fokus, dan merusak rutinitas harian.",
  },
];

const WHEEL_KEYS: (keyof FormState)[] = ["Peer_Pressure", "Family_Support", "Anxiety_Level"];
const ATTENDANCE_KEY: keyof FormState = "Class_Attendance";

// ── Helpers ────────────────────────────────────────────────────────────────────
const riskLabel = (level: string) => {
  if (level === "Low") return "Rendah";
  if (level === "High") return "Tinggi";
  return "Sedang";
};

const riskColor = (level: string) => {
  if (level === "Low") return { bg: "var(--mint)", text: "var(--success)", accent: "#22c55e" };
  if (level === "High")
    return {
      bg: "color-mix(in oklab,var(--danger) 20%,transparent)",
      text: "var(--danger)",
      accent: "#ef4444",
    };
  return {
    bg: "color-mix(in oklab,var(--warning) 25%,transparent)",
    text: "var(--warning)",
    accent: "#f59e0b",
  };
};

const riskEmoji = (level: string) =>
  level === "Low" ? "😌" : level === "Medium" ? "😐" : "😰";

function generateRecommendations(
  prediction: "Low" | "Medium" | "High",
  form: FormState
): RecommendationData {
  const tips: string[] = [];
  const screenTime = Number(form.Screen_Time);
  const sleepHours = Number(form.Sleep_Hours);
  const anxiety = Number(form.Anxiety_Level);
  const assignment = Number(form.Assignment_Load);
  const exam = Number(form.Exam_Frequency);
  const family = Number(form.Family_Support);
  const socialMedia = Number(form.Social_Media_Use);
  const peerPressure = Number(form.Peer_Pressure);
  const studyHours = Number(form.Study_Hours);
  const attendance = Number(form.Class_Attendance);
  let intro = "";

  if (prediction === "High") {
    intro =
      "Mentalmu lagi di titik jenuh banget, dan ngerasa overwhelmed itu valid kok. Tapi inget, health comes first. Fokus ke dirimu dulu.";
    if (screenTime >= 10)
      tips.push("Screen time kamu sangat tinggi. Coba digital sunset dengan mematikan gadget 1 jam sebelum tidur.");
    if (sleepHours <= 5)
      tips.push("Kurang tidur memperparah burnout. Prioritaskan tidur malam ini dan targetkan 7–8 jam.");
    if (anxiety >= 8)
      tips.push("Tingkat kecemasanmu tinggi. Coba teknik grounding 5-4-3-2-1 atau konsultasi dengan konselor kampus.");
    if (assignment >= 10)
      tips.push("Fokuskan diri pada satu tugas paling mendesak terlebih dahulu.");
    if (exam >= 8)
      tips.push("Gunakan metode Pomodoro agar persiapan ujian lebih efektif.");
    if (family <= 3)
      tips.push("Cari support system dari teman dekat atau layanan konseling kampus.");
    if (socialMedia >= 8)
      tips.push("Kurangi penggunaan media sosial beberapa hari untuk mengurangi overstimulasi.");
    if (peerPressure >= 8)
      tips.push("Fokus pada progresmu sendiri, bukan pencapaian orang lain.");
    if (studyHours >= 12)
      tips.push("Belajar terlalu lama dapat meningkatkan risiko burnout. Tambahkan waktu istirahat.");
  }
  if (prediction === "Medium") {
    intro =
      "Kamu mulai menguras energi lebih cepat dari biasanya. Ini saat yang tepat untuk mengatur ulang ritme aktivitasmu.";
    if (screenTime >= 8)
      tips.push("Kurangi screen time dan ganti sebagian waktunya dengan aktivitas offline.");
    if (sleepHours <= 6)
      tips.push("Mulai prioritaskan tidur minimal 7 jam setiap malam.");
    if (anxiety >= 6)
      tips.push("Luangkan waktu untuk journaling atau latihan pernapasan.");
    if (assignment >= 8)
      tips.push("Pecah tugas besar menjadi target-target kecil.");
    if (exam >= 6)
      tips.push("Hindari belajar sistem kebut semalam.");
    if (socialMedia >= 7)
      tips.push("Buat aturan no-phone zone saat belajar.");
    if (attendance <= 60)
      tips.push("Coba tingkatkan kehadiran kelas secara bertahap.");
  }
  if (prediction === "Low") {
    intro =
      "Kondisi mentalmu saat ini cukup stabil. Pertahankan kebiasaan positif yang sudah berjalan.";
    if (sleepHours >= 7 && sleepHours <= 9)
      tips.push("Jam tidurmu sudah optimal dan membantu menjaga kesehatan mental.");
    if (socialMedia <= 4)
      tips.push("Penggunaan media sosialmu sudah cukup terkontrol.");
    if (screenTime <= 6)
      tips.push("Screen time yang sehat membantu menjaga fokus dan keseimbangan hidup.");
    if (family >= 8)
      tips.push("Dukungan keluarga yang baik menjadi faktor pelindung burnout.");
    if (studyHours >= 3 && studyHours <= 8)
      tips.push("Pola belajar yang seimbang merupakan kebiasaan yang baik.");
  }

  return { intro, tips: tips.slice(0, 3) };
}

// ── Info Card Tooltip ──────────────────────────────────────────────────────────
function InfoCard({
  label,
  description,
  onClose,
}: {
  label: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 4 }}
        transition={{ duration: 0.18 }}
        className="absolute z-50 left-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface shadow-lg p-4"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.13)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-semibold text-sm text-foreground">{label}</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition flex-shrink-0 mt-0.5"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-primary-light text-primary text-xs font-semibold py-2 hover:opacity-80 transition"
        >
          Tutup
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Attendance Slider ──────────────────────────────────────────────────────────
function AttendanceSlider({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const numVal = value === "" ? 0 : Math.min(100, Math.max(0, Number(value)));

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") { onChange(""); return; }
    const n = Math.min(100, Math.max(0, parseInt(raw, 10)));
    onChange(String(n));
  }

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div
      className={`mt-1.5 flex items-center gap-2 rounded-xl border bg-background px-3 transition ${
        hasError ? "border-danger" : "border-border"
      }`}
      style={{ height: "42px" }}
    >
      {/* Number input */}
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        value={value}
        onChange={handleInput}
        placeholder="0"
        className="w-12 shrink-0 bg-transparent text-sm font-semibold text-foreground outline-none text-center tabular-nums"
        style={{ MozAppearance: "textfield" }}
      />
      <span className="text-xs text-muted-foreground shrink-0">%</span>
      {/* Divider */}
      <div className="w-px h-5 bg-border shrink-0" />
      {/* Slider */}
      <div className="flex-1 relative flex items-center">
        <style>{`
          .attendance-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 9999px;
            outline: none;
            cursor: pointer;
            background: linear-gradient(
              to right,
              var(--primary) 0%,
              var(--primary) ${numVal}%,
              var(--accent) ${numVal}%,
              var(--accent) 100%
            );
          }
          .attendance-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--primary);
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.18);
            cursor: pointer;
            transition: transform 0.15s;
          }
          .attendance-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          .attendance-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--primary);
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.18);
            cursor: pointer;
          }
        `}</style>
        <input
          type="range"
          min={0}
          max={100}
          value={numVal}
          onChange={handleSlider}
          className="attendance-slider"
        />
      </div>
    </div>
  );
}

// ── Wheel Picker ───────────────────────────────────────────────────────────
function WheelPicker({
  value,
  min,
  max,
  onChange,
  hasError,
}: {
  value: string;
  min: number;
  max: number;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const ITEM_W = 44;

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startIndex = useRef(0);

  const motionX = useMotionValue(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const currentVal =
    value === ""
      ? min
      : Math.min(max, Math.max(min, parseInt(value, 10)));

  const currentIndex = currentVal - min;

  // sync external value
  useEffect(() => {
    if (!isDragging.current) {
      motionX.set(-currentIndex * ITEM_W);
      setActiveIndex(currentIndex);
    }
  }, [currentIndex]);

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  function getIndexFromX(x: number) {
    return clamp(Math.round(-x / ITEM_W), 0, items.length - 1);
  }

  function rubberBand(value: number, min: number, max: number, damping = 0.25) {
    if (value < min) return min + (value - min) * damping;
    if (value > max) return max + (value - max) * damping;
    return value;
  }

  function snapToIndex(idx: number) {
    const clamped = clamp(idx, 0, items.length - 1);

    onChange(String(items[clamped]));

    animate(motionX, -clamped * ITEM_W, {
      type: "spring",
      stiffness: 260,
      damping: 28,
    });

    setActiveIndex(clamped);
  }

  function onPointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    startX.current = e.clientX;
    startIndex.current = getIndexFromX(motionX.get());

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;

    const deltaRaw = e.clientX - startX.current;

    // 🔥 MOBILE FEEL: lebih "berat"
    const DRAG_SENSITIVITY = 0.85; // < 1 = lebih berat
    const delta = deltaRaw * DRAG_SENSITIVITY;

    let rawX = -startIndex.current * ITEM_W + delta;

    const minX = -(items.length - 1) * ITEM_W;
    const maxX = 0;

    // 🔥 RUBBER BANDING (biar tidak licin keluar batas)
    rawX = rubberBand(rawX, minX, maxX, 0.22);

    motionX.set(rawX);

    const newIndex = getIndexFromX(rawX);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  }

  function onPointerUp() {
    if (!isDragging.current) return;

    isDragging.current = false;

    const finalX = motionX.get();
    const index = getIndexFromX(finalX);

    snapToIndex(index);
  }

  function onItemClick(idx: number) {
    snapToIndex(idx);
  }

  return (
    <div
      className={`mt-1.5 rounded-xl border bg-background overflow-hidden select-none transition ${
        hasError ? "border-danger" : "border-border"
      }`}
      style={{ height: "42px", position: "relative" }}
    >
      {/* CENTER HIGHLIGHT */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: ITEM_W,
          background: "color-mix(in oklab, var(--primary) 10%, transparent)",
          border: "1px solid color-mix(in oklab, var(--primary) 25%, transparent)",
          borderRadius: 12,
        }}
      />

      {/* fade */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none z-20"
        style={{
          width: 48,
          background:
            "linear-gradient(to right, var(--background) 60%, transparent)",
        }}
      />

      <div
        className="absolute inset-y-0 right-0 pointer-events-none z-20"
        style={{
          width: 48,
          background:
            "linear-gradient(to left, var(--background) 60%, transparent)",
        }}
      />

      {/* TRACK */}
      <div
        className="absolute inset-0 flex items-center cursor-grab z-10"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <motion.div
          className="flex items-center"
          style={{
            x: motionX,
            paddingLeft: `calc(50% - ${ITEM_W / 2}px)`,
            paddingRight: `calc(50% - ${ITEM_W / 2}px)`,
          }}
        >
          {items.map((item, idx) => {
            const dist = Math.abs(idx - activeIndex);
            const isActive = idx === activeIndex;

            const scale = isActive ? 1.02 : dist === 1 ? 0.92 : 0.8;

            const opacity =
              isActive ? 1 : dist === 1 ? 0.72 : dist === 2 ? 0.45 : 0.25;

            return (
              <motion.button
                key={item}
                type="button"
                onClick={() => onItemClick(idx)}
                className="flex-shrink-0 flex items-center justify-center tabular-nums"
                style={{
                  width: ITEM_W,
                  height: 42,

                  // 🔥 lebih kecil + soft
                  fontSize: isActive ? 14 : 12,

                  color: isActive
                    ? "color-mix(in oklab, var(--primary) 78%, var(--foreground))"
                    : "var(--muted-foreground)",

                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: isActive ? "-0.01em" : "0em",

                  scale,
                  opacity,
                }}
                animate={{ scale, opacity }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 34, // 🔥 lebih “sendat”
                }}
              >
                {item}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ── Field wrapper with Info Card ───────────────────────────────────────────────
function FieldWrapper({
  meta,
  children,
  errorMsg,
}: {
  meta: (typeof FIELD_META)[number];
  children: React.ReactNode;
  errorMsg?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-foreground">
        <span>
          {meta.label}
          <span className="font-normal text-muted-foreground">
            {" "}({meta.hint})
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex align-middle ml-1 text-muted-foreground hover:text-primary transition"
            aria-label={`Info tentang ${meta.label}`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </span>
      </label>

      {children}

      {errorMsg && (
        <p className="mt-1 flex items-start gap-1 text-xs text-danger">
          <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          {errorMsg}
        </p>
      )}

      {open && (
        <InfoCard label={meta.label} description={meta.description} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PredictPage() {
  const supabase = createClient();
  const [form, setForm] = useState<FormState>({
    Age: "",
    Study_Hours: "",
    Class_Attendance: "",
    Exam_Frequency: "",
    Assignment_Load: "",
    Sleep_Hours: "",
    Social_Media_Use: "",
    Screen_Time: "",
    Peer_Pressure: "",
    Family_Support: "",
    Anxiety_Level: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);

  // ── Validation ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: FormErrors = {};
    FIELD_META.forEach(({ key, label, min, max }) => {
      const v = form[key].trim();
      if (v === "") {
        newErrors[key] = `${label} wajib diisi.`;
        return;
      }
      if (!/^-?\d+$/.test(v)) {
        newErrors[key] = `${label} harus berupa bilangan bulat.`;
        return;
      }
      const n = parseInt(v, 10);
      if (n < min || n > max) {
        newErrors[key] = `${label} harus antara ${min} dan ${max}.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── API call ─────────────────────────────────────────────────────────────────
  async function handlePredict() {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    setResult(null);
    setSaved(false);

    const payload = {
      Age: parseInt(form.Age),
      Study_Hours: parseInt(form.Study_Hours),
      Class_Attendance: parseInt(form.Class_Attendance),
      Exam_Frequency: parseInt(form.Exam_Frequency),
      Assignment_Load: parseInt(form.Assignment_Load),
      Sleep_Hours: parseInt(form.Sleep_Hours),
      Social_Media_Use: parseInt(form.Social_Media_Use),
      Screen_Time: parseInt(form.Screen_Time),
      Peer_Pressure: parseInt(form.Peer_Pressure),
      Family_Support: parseInt(form.Family_Support),
      Anxiety_Level: parseInt(form.Anxiety_Level),
    };

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server error ${res.status}`);
      }
      const data: PredictionResult = await res.json();
      setResult(data);
      setRecommendation(generateRecommendations(data.prediction, form));
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Gagal terhubung ke server. Coba beberapa saat lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Save result ───────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!result) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { alert("Silakan login terlebih dahulu."); return; }
    try {
      const { error } = await supabase.from("predictions").insert({
        user_id: user.id,
        prediction: result.prediction,
        confidence: result.confidence,
        low_probability: result.probabilities.Low,
        medium_probability: result.probabilities.Medium,
        high_probability: result.probabilities.High,
        age: Number(form.Age),
        study_hours: Number(form.Study_Hours),
        class_attendance: Number(form.Class_Attendance),
        exam_frequency: Number(form.Exam_Frequency),
        assignment_load: Number(form.Assignment_Load),
        sleep_hours: Number(form.Sleep_Hours),
        social_media_use: Number(form.Social_Media_Use),
        screen_time: Number(form.Screen_Time),
        peer_pressure: Number(form.Peer_Pressure),
        family_support: Number(form.Family_Support),
        anxiety_level: Number(form.Anxiety_Level),
        recommendations: recommendation?.tips ?? [],
      });
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan hasil.");
    }
  }

  // ── Field change ──────────────────────────────────────────────────────────────
  function handleChange(key: keyof FormState, value: string) {
    const cleaned = value.replace(/[^0-9]/g, "");
    setForm((f) => ({ ...f, [key]: cleaned }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function handleWheelChange(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function handleAttendanceChange(value: string) {
    setForm((f) => ({ ...f, Class_Attendance: value }));
    if (errors["Class_Attendance"]) setErrors((e) => ({ ...e, Class_Attendance: "" }));
  }

  const c = result ? riskColor(result.prediction) : null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
          <Brain className="h-3.5 w-3.5" /> Model AI BurnoutGuard
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold">Prediksi Risiko Burnout</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Isi detail aktivitas harianmu di bawah ini. Kami akan menganalisis potensi tingkat risiko
          burnout kamu berdasarkan 11 indikator aktivitas yang divalidasi secara ilmiah.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Form ──────────────────────────────────────────────────────────── */}
        <div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <div className="text-sm font-semibold text-muted-foreground">
            Data Mahasiswa ({FIELD_META.length} bidang)
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FIELD_META.map((meta) => {
              const { key, min, max } = meta;
              const isWheel = WHEEL_KEYS.includes(key);
              const isAttendance = key === ATTENDANCE_KEY;

              return (
                <FieldWrapper key={key} meta={meta} errorMsg={errors[key]}>
                  {isAttendance ? (
                    <AttendanceSlider
                      value={form[key]}
                      onChange={handleAttendanceChange}
                      hasError={!!errors[key]}
                    />
                  ) : isWheel ? (
                    <WheelPicker
                      value={form[key]}
                      min={min}
                      max={max}
                      onChange={(v) => handleWheelChange(key, v)}
                      hasError={!!errors[key]}
                    />
                  ) : (
                    <input
                      type="number"
                      inputMode="numeric"
                      min={min}
                      max={max}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={`${min}–${max}`}
                      className={`mt-1.5 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary ${
                        errors[key] ? "border-danger" : "border-border"
                      }`}
                      style={{ height: "42px" }}
                    />
                  )}
                </FieldWrapper>
              );
            })}
          </div>

          {/* API error */}
          {apiError && (
            <div className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30" strokeLinecap="round" />
                </svg>
                Menganalisis data...
              </span>
            ) : (
              "Prediksi Risiko Burnout"
            )}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Data yang kamu masukkan hanya digunakan untuk prediksi dan tidak akan digunakan tanpa izinmu.
          </p>
        </div>

        {/* ── Result panel ──────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-light via-surface to-mint/30 p-6 shadow-soft">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
              >
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-surface shadow-soft">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Isi form dan klik tombol prediksi. Hasilnya akan muncul di sini.
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
              >
                <svg className="h-16 w-16 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeLinecap="round" opacity={0.3} />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-muted-foreground">Model sedang menganalisis data kamu...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Risk level big display */}
                <div className="flex flex-col items-center gap-3 py-4">
                  <div
                    className="grid h-32 w-32 place-items-center rounded-3xl text-5xl shadow-soft"
                    style={{ background: c!.bg }}
                  >
                    {riskEmoji(result.prediction)}
                  </div>
                  <div>
                    <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Tingkat Risiko Burnout
                    </p>
                    <p
                      className="text-center font-display text-4xl font-black"
                      style={{ color: c!.text }}
                    >
                      {riskLabel(result.prediction)}
                    </p>
                  </div>
                  <div
                    className="rounded-full px-4 py-1 text-sm font-semibold"
                    style={{ background: c!.bg, color: c!.text }}
                  >
                    {result.prediction}
                  </div>
                </div>

                {/* Confidence */}
                <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Tingkat Kepercayaan</span>
                    <span className="font-display text-2xl font-bold">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-light">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>

                {/* Probability distribution */}
                <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">Distribusi Probabilitas</p>
                  {(
                    [
                      { key: "Low", label: "Rendah", accent: "#22c55e" },
                      { key: "Medium", label: "Sedang", accent: "#f59e0b" },
                      { key: "High", label: "Tinggi", accent: "#ef4444" },
                    ] as const
                  ).map(({ key, label, accent }) => {
                    const pct = Math.round((result.probabilities[key] ?? 0) * 100);
                    return (
                      <div key={key} className="mb-2.5">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium">{label}</span>
                          <span className="tabular-nums font-semibold">{pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-accent">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: accent }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations */}
                {recommendation && (
                  <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur">
                    <h3 className="mb-3 font-semibold">Langkah Rekomendasi</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{recommendation.intro}</p>
                    <ul className="space-y-2">
                      {recommendation.tips.map((tip, index) => (
                        <li key={index} className="rounded-xl bg-background p-3 text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Save button */}
                {saved ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-success/30 bg-success/10 py-3 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Hasil berhasil disimpan ke Dashboard!
                  </div>
                ) : (
                  <button
                    onClick={handleSave}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-80"
                  >
                    <Save className="h-4 w-4" />
                    Simpan Hasil ke Dashboard
                  </button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
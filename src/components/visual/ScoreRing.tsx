"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  value: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ value, size = 180, label }: ScoreRingProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const status = value < 35 ? "Low" : value < 60 ? "Medium" : "High";
  const color = value < 35 ? "var(--success)" : value < 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--primary-light)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display text-5xl font-bold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {value}
        </motion.span>
        <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label ?? status} risk
        </span>
      </div>
    </div>
  );
}
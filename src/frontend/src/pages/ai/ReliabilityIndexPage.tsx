import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const HABITS = [
  {
    id: "meds",
    label: "Morning Medication",
    streak: 7,
    goal: 7,
    color: "#60a5fa",
  },
  {
    id: "water",
    label: "Daily Hydration (2L)",
    streak: 5,
    goal: 7,
    color: "#34d399",
  },
  {
    id: "exercise",
    label: "30-min Exercise",
    streak: 3,
    goal: 5,
    color: "#f9a8c9",
  },
  { id: "sleep", label: "10 PM Bedtime", streak: 4, goal: 7, color: "#a78bfa" },
  { id: "meals", label: "Regular Meals", streak: 6, goal: 7, color: "#fbbf24" },
];

export default function ReliabilityIndexPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const overallScore = Math.round(
    HABITS.reduce((acc, h) => acc + (h.streak / h.goal) * 100, 0) /
      HABITS.length,
  );

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-3xl mx-auto">
      <motion.button
        type="button"
        data-ocid="reliability.back.button"
        onClick={() => navigate({ to: "/ai" })}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to AI Hub
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,255,200,0.15)",
              border: "1px solid rgba(0,255,200,0.4)",
            }}
          >
            <Star size={18} style={{ color: "#00ffc8" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Care Reliability Index
            </h1>
            <p className="text-sm text-muted-foreground">
              Track wellness consistency, medication adherence, and habit
              streaks
            </p>
          </div>
        </div>
      </motion.div>

      {/* Score ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-8"
      >
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <title>Care reliability score</title>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#00ffc8"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${Math.PI * 2 * 50}`}
              initial={{ strokeDashoffset: Math.PI * 2 * 50 }}
              animate={{
                strokeDashoffset: Math.PI * 2 * 50 * (1 - overallScore / 100),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 8px rgba(0,255,200,0.5))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: "#00ffc8" }}>
              {overallScore}%
            </span>
            <span className="text-xs text-muted-foreground">Reliability</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {HABITS.map((h, i) => (
          <motion.div
            key={h.id}
            data-ocid={`reliability.habit.${i + 1}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {h.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {h.streak}/{h.goal} days
                </span>
                <button
                  type="button"
                  data-ocid={`reliability.check.${i + 1}`}
                  onClick={() =>
                    setChecked((c) => ({ ...c, [h.id]: !c[h.id] }))
                  }
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: h.color,
                    background: checked[h.id] ? h.color : "transparent",
                  }}
                >
                  {checked[h.id] && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: h.goal }).map((_, d) => (
                <motion.div
                  key={`${h.label}-dot-${d}`}
                  className="h-1.5 flex-1 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 + d * 0.05 }}
                  style={{
                    background:
                      d < h.streak ? h.color : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

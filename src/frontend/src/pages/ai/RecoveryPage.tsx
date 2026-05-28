import { useNavigate } from "@tanstack/react-router";
import { Activity, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const RECOVERY_PLAN = [
  {
    day: "Day 1–2",
    title: "Rest & Hydration",
    done: true,
    tip: "Complete bed rest, 2.5L water daily, light stretching only.",
  },
  {
    day: "Day 3–4",
    title: "Gentle Movement",
    done: true,
    tip: "10-minute walks, avoid exertion, continue hydration.",
  },
  {
    day: "Day 5–6",
    title: "Rebuild Routine",
    done: false,
    tip: "Return to normal meals, 20-minute light exercise.",
  },
  {
    day: "Day 7",
    title: "Full Assessment",
    done: false,
    tip: "AI checks your vitals and updates your recovery score.",
  },
];

const METRICS = [
  { label: "Recovery Progress", value: 62, color: "#4ade80" },
  { label: "Energy Level", value: 48, color: "#60a5fa" },
  { label: "Inflammation Score", value: 35, color: "#fbbf24", invert: true },
];

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([0, 1]);

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-3xl mx-auto">
      <motion.button
        type="button"
        data-ocid="recovery.back.button"
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
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.4)",
            }}
          >
            <Activity size={18} style={{ color: "#4ade80" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Recovery Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Adaptive healing plans with milestone tracking
            </p>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl text-center"
            style={{
              background: `${m.color}0a`,
              border: `1px solid ${m.color}25`,
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>
              {m.value}%
            </div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recovery arc */}
      <div className="relative">
        {RECOVERY_PLAN.map((step, i) => (
          <motion.div
            key={step.day}
            data-ocid={`recovery.step.${i + 1}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 mb-4"
          >
            <div className="flex flex-col items-center">
              <button
                type="button"
                data-ocid={`recovery.complete.${i + 1}`}
                onClick={() =>
                  setCompletedDays((d) =>
                    d.includes(i) ? d.filter((x) => x !== i) : [...d, i],
                  )
                }
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: completedDays.includes(i)
                    ? "#4ade80"
                    : "rgba(255,255,255,0.2)",
                  background: completedDays.includes(i)
                    ? "rgba(74,222,128,0.2)"
                    : "transparent",
                  boxShadow: completedDays.includes(i)
                    ? "0 0 12px rgba(74,222,128,0.3)"
                    : "none",
                }}
              >
                {completedDays.includes(i) && (
                  <span className="text-xs" style={{ color: "#4ade80" }}>
                    ✓
                  </span>
                )}
              </button>
              {i < RECOVERY_PLAN.length - 1 && (
                <div
                  className="w-0.5 h-8 mt-1"
                  style={{
                    background: completedDays.includes(i)
                      ? "rgba(74,222,128,0.4)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">
                  {step.day}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{step.tip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

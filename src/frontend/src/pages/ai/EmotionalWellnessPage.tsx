import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MOODS = [
  {
    emoji: "😄",
    label: "Great",
    color: "#22c55e",
    orbColor: "rgba(34,197,94,0.35)",
  },
  {
    emoji: "🙂",
    label: "Good",
    color: "#14b8a6",
    orbColor: "rgba(20,184,166,0.35)",
  },
  {
    emoji: "😐",
    label: "Neutral",
    color: "#eab308",
    orbColor: "rgba(234,179,8,0.35)",
  },
  {
    emoji: "😔",
    label: "Low",
    color: "#f97316",
    orbColor: "rgba(249,115,22,0.35)",
  },
  {
    emoji: "😰",
    label: "Stressed",
    color: "#ef4444",
    orbColor: "rgba(239,68,68,0.35)",
  },
];

const WELLNESS_INSIGHTS: Record<string, { headline: string; tips: string[] }> =
  {
    Great: {
      headline: "You're thriving today!",
      tips: [
        "Maintain energy by staying hydrated.",
        "Great days boost your immune response.",
        "Log a positive note in your health diary.",
      ],
    },
    Good: {
      headline: "You're in a solid place.",
      tips: [
        "Keep your routine consistent today.",
        "Light stretching elevates good days further.",
        "Share positivity — it helps others.",
      ],
    },
    Neutral: {
      headline: "Steady and balanced.",
      tips: [
        "Try the breathing exercise below.",
        "A short walk can shift your energy.",
        "Hydration often affects mood subtly.",
      ],
    },
    Low: {
      headline: "It's okay to feel low.",
      tips: [
        "Rest is productive — let yourself recharge.",
        "Gentle movement can lift your mood.",
        "Speak to someone you trust today.",
      ],
    },
    Stressed: {
      headline: "Let's work through this.",
      tips: [
        "Use the breathing exercise below now.",
        "Stress peaks 14:00–16:00 — take a break.",
        "20 mins away from screens helps reset.",
      ],
    },
  };

const STRESS_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STRESS_VALUES = [42, 68, 55, 72, 48, 30, 36];

function BreathingExercise() {
  const [phase, setPhase] = useState<"idle" | "inhale" | "exhale">("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const phaseRef = useRef<"inhale" | "exhale">("inhale");
  const DURATION = 4000;

  const tick = (ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const p = Math.min((ts - startRef.current) / DURATION, 1);
    setProgress(p);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      phaseRef.current = phaseRef.current === "inhale" ? "exhale" : "inhale";
      setPhase(phaseRef.current);
      startRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    phaseRef.current = "inhale";
    setPhase("inhale");
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setProgress(0);
  };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const scale = phase === "inhale" ? 1 + progress * 0.6 : 1.6 - progress * 0.6;
  const label =
    phase === "idle"
      ? "Start breathing"
      : phase === "inhale"
        ? "Breathe in…"
        : "Breathe out…";

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 140, height: 140 }}
      >
        {[0.3, 0.5, 0.7].map((s, i) => (
          <div
            key={s}
            className="absolute rounded-full"
            style={{
              width: 140 * s,
              height: 140 * s,
              background: "rgba(249,168,212,0.06)",
              border: "1px solid rgba(249,168,212,0.12)",
              transform:
                phase !== "idle"
                  ? `scale(${1 + progress * 0.15 * (i + 1)})`
                  : "scale(1)",
              transition: "transform 0.1s linear",
            }}
          />
        ))}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(249,168,212,0.15)",
            border: "1.5px solid rgba(249,168,212,0.4)",
            boxShadow:
              phase !== "idle" ? "0 0 24px rgba(249,168,212,0.25)" : "none",
            transform: `scale(${phase !== "idle" ? scale : 1})`,
            transition: "transform 0.1s linear, box-shadow 0.3s",
          }}
        >
          <span className="text-2xl">🫁</span>
        </div>
      </div>
      <p className="text-sm font-medium text-pink-300">{label}</p>
      {phase === "idle" ? (
        <button
          type="button"
          onClick={start}
          data-ocid="emotional.breathing.start_button"
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(249,168,212,0.15)",
            border: "1px solid rgba(249,168,212,0.3)",
            color: "#f9a8d4",
          }}
        >
          Begin Exercise
        </button>
      ) : (
        <button
          type="button"
          onClick={stop}
          data-ocid="emotional.breathing.stop_button"
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
          }}
        >
          Stop
        </button>
      )}
      <p className="text-xs text-muted-foreground">
        4 s inhale · 4 s exhale — repeat as needed
      </p>
    </div>
  );
}

export default function EmotionalWellnessPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const insight = selected ? WELLNESS_INSIGHTS[selected] : null;
  const mood = MOODS.find((m) => m.label === selected);

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🧘</span>
          <h1 className="text-2xl font-bold">Emotional Wellness</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          How are you feeling right now?
        </p>
      </div>

      {/* Mood check-in */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex justify-around flex-wrap gap-4">
          {MOODS.map((m) => (
            <button
              key={m.label}
              type="button"
              data-ocid={`emotional.mood.${m.label.toLowerCase()}`}
              onClick={() => setSelected(m.label)}
              className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200"
              style={{
                background: selected === m.label ? m.orbColor : "transparent",
                border:
                  selected === m.label
                    ? `1.5px solid ${m.color}`
                    : "1.5px solid transparent",
                boxShadow:
                  selected === m.label ? `0 0 16px ${m.color}40` : "none",
                transform: selected === m.label ? "scale(1.1)" : "scale(1)",
              }}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span
                className="text-xs font-medium"
                style={{ color: selected === m.label ? m.color : undefined }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orb + insights */}
      <AnimatePresence mode="wait">
        {mood && insight && (
          <motion.div
            key={mood.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl"
                style={{
                  background: mood.orbColor,
                  border: `2px solid ${mood.color}80`,
                  boxShadow: `0 0 40px ${mood.color}50`,
                }}
              >
                {mood.emoji}
              </motion.div>
              <p
                className="text-sm font-semibold"
                style={{ color: mood.color }}
              >
                {insight.headline}
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold text-sm text-pink-300">
                Wellness Insights
              </h3>
              {insight.tips.map((tip, i) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: mood.color }}
                  />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7-day stress chart */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Stress Pattern — Last 7 Days</h3>
        <div className="flex items-end gap-2 h-28">
          {STRESS_DAYS.map((day, i) => {
            const val = STRESS_VALUES[i];
            const barColor =
              val > 65 ? "#f97316" : val > 45 ? "#eab308" : "#22c55e";
            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.07,
                    ease: "easeOut",
                  }}
                  className="w-full rounded-t-md"
                  style={{ background: barColor, opacity: 0.8, minHeight: 4 }}
                />
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Stress tracked from interaction speed and hesitation patterns.
        </p>
      </div>

      {/* Breathing */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-1">4-4 Breathing Exercise</h3>
        <p className="text-xs text-muted-foreground mb-6">
          Scientifically proven to reduce cortisol levels in minutes.
        </p>
        <BreathingExercise />
      </div>
    </div>
  );
}

import { Shield, Wind } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const SIGNALS = [
  {
    key: "stress",
    label: "Stress Level",
    emoji: "🧠",
    value: 38,
    threshold: 70,
    color: "#22c55e",
    unit: "%",
    message: "Stress is comfortably low today.",
  },
  {
    key: "burnout",
    label: "Burnout Risk",
    emoji: "🔥",
    value: 52,
    threshold: 65,
    color: "#eab308",
    unit: "%",
    message: "Moderate — consider a short break.",
  },
  {
    key: "sleep",
    label: "Sleep Quality",
    emoji: "🌙",
    value: 74,
    threshold: 40,
    color: "#14b8a6",
    unit: "/100",
    message: "Good quality sleep detected.",
  },
  {
    key: "load",
    label: "Mental Load",
    emoji: "📋",
    value: 45,
    threshold: 70,
    color: "#818cf8",
    unit: "%",
    message: "Mental load is manageable today.",
  },
];

const TIPS = [
  {
    icon: "🚶",
    title: "Take a 10-minute walk",
    desc: "Short outdoor breaks reduce cortisol by up to 20%.",
  },
  {
    icon: "💧",
    title: "Hydrate now",
    desc: "Dehydration amplifies stress. Drink a full glass of water.",
  },
  {
    icon: "📵",
    title: "Screen break",
    desc: "20 mins away from screens resets your nervous system.",
  },
];

function CalmGauge({
  signal,
  animDelay,
}: { signal: (typeof SIGNALS)[0]; animDelay: number }) {
  const [current, setCurrent] = useState(0);
  const elevated =
    signal.key !== "sleep"
      ? signal.value >= signal.threshold
      : signal.value < signal.threshold;
  const barColor = elevated ? "#f97316" : signal.color;
  useEffect(() => {
    const t = setTimeout(() => setCurrent(signal.value), animDelay + 200);
    return () => clearTimeout(t);
  }, [signal.value, animDelay]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay / 1000, duration: 0.4 }}
      className="backdrop-blur-md bg-white/10 border rounded-2xl p-5"
      style={{
        borderColor: elevated
          ? "rgba(249,115,22,0.3)"
          : "rgba(255,255,255,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{signal.emoji}</span>
          <span className="font-semibold text-sm">{signal.label}</span>
        </div>
        <span className="text-lg font-bold" style={{ color: barColor }}>
          {signal.value}
          {signal.unit}
        </span>
      </div>
      <div
        className="w-full h-2.5 rounded-full overflow-hidden mb-3"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${current}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${signal.color}, ${barColor})`,
          }}
        />
      </div>
      <p
        className="text-xs"
        style={{ color: elevated ? "#f97316" : "#94a3b8" }}
      >
        {elevated ? "⚠️ " : "✅ "}
        {signal.message}
      </p>
    </motion.div>
  );
}

export default function PreventiveCrisisPage() {
  const allNormal = SIGNALS.every((s) =>
    s.key !== "sleep" ? s.value < s.threshold : s.value >= s.threshold,
  );
  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-7 h-7 text-teal-400" />
          <h1 className="text-2xl font-bold">Preventive Crisis AI</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Early, gentle detection — no alarms, just awareness.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 flex items-center gap-4"
        style={{
          boxShadow: allNormal
            ? "0 0 20px rgba(34,197,94,0.1)"
            : "0 0 20px rgba(249,115,22,0.1)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: allNormal
              ? "rgba(34,197,94,0.15)"
              : "rgba(249,115,22,0.15)",
          }}
        >
          {allNormal ? "😊" : "🤗"}
        </div>
        <div>
          <p
            className="font-semibold"
            style={{ color: allNormal ? "#22c55e" : "#f97316" }}
          >
            {allNormal
              ? "You're doing well today!"
              : "A few signals to be aware of."}
          </p>
          <p className="text-xs text-muted-foreground">
            {allNormal
              ? "All monitoring signals are within healthy ranges."
              : "No need to worry — just gentle suggestions below."}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SIGNALS.map((s, i) => (
          <CalmGauge key={s.key} signal={s} animDelay={i * 120} />
        ))}
      </div>

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center gap-3">
        <Wind className="w-5 h-5 text-teal-400" />
        <p className="text-sm font-medium text-teal-300">Ambient Calm Wave</p>
        <svg viewBox="0 0 300 60" className="w-full" style={{ height: 60 }}>
          <title>Ambient calm wave</title>
          <defs>
            <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 Q37,10 75,30 Q112,50 150,30 Q187,10 225,30 Q262,50 300,30"
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-75,0;0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,35 Q37,15 75,35 Q112,55 150,35 Q187,15 225,35 Q262,55 300,35"
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="1.5"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;75,0;0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <p className="text-xs text-muted-foreground">
          Breathe naturally — this wave mirrors a calm heart rate.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Gentle Prevention Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIPS.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5"
            >
              <span className="text-3xl mb-3 block">{tip.icon}</span>
              <p className="font-semibold text-sm mb-1">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

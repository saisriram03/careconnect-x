import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  Grid3X3,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Mic,
  Palette,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAI } from "../../ai/AIContext";
import type { HealthPrediction, PredictionSeverity } from "../../ai/types";
function severityColor(severity: PredictionSeverity): string {
  switch (severity) {
    case "critical":
      return "#fb7185";
    case "high":
      return "#fb923c";
    case "medium":
      return "#fbbf24";
    default:
      return "#34d399";
  }
}

function NeuralBrainViz() {
  return (
    <motion.svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      aria-hidden="true"
    >
      {/* Outer glow ring */}
      <motion.circle
        cx="80"
        cy="80"
        r="72"
        fill="none"
        stroke="rgba(249,168,212,0.18)"
        strokeWidth="1"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx="80"
        cy="80"
        r="56"
        fill="none"
        stroke="rgba(232,121,249,0.2)"
        strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{ originX: "80px", originY: "80px" }}
      />
      {/* Neural nodes */}
      {[
        { cx: 80, cy: 24, color: "#f9a8d4" },
        { cx: 136, cy: 80, color: "#e879f9" },
        { cx: 80, cy: 136, color: "#60a5fa" },
        { cx: 24, cy: 80, color: "#a78bfa" },
        { cx: 125, cy: 35, color: "#f9a8d4" },
        { cx: 125, cy: 125, color: "#22d3ee" },
        { cx: 35, cy: 35, color: "#e879f9" },
        { cx: 35, cy: 125, color: "#60a5fa" },
      ].map((n) => (
        <motion.circle
          key={`${n.cx}-${n.cy}`}
          cx={n.cx}
          cy={n.cy}
          r="5"
          fill={n.color}
          animate={{ opacity: [0.4, 1, 0.4], r: [4, 6, 4] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Neural lines */}
      {[
        "M80,24 L136,80",
        "M136,80 L80,136",
        "M80,136 L24,80",
        "M24,80 L80,24",
        "M80,24 L125,35",
        "M125,35 L136,80",
        "M136,80 L125,125",
        "M125,125 L80,136",
        "M80,136 L35,125",
        "M35,125 L24,80",
        "M24,80 L35,35",
        "M35,35 L80,24",
      ].map((d) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="rgba(249,168,212,0.25)"
          strokeWidth="0.8"
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Core */}
      <motion.circle
        cx="80"
        cy="80"
        r="16"
        fill="url(#brainGrad)"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ originX: "80px", originY: "80px" }}
      />
      <defs>
        <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e879f9" stopOpacity="0.5" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

interface ModuleCardProps {
  mod: (typeof MODULE_CARDS)[number];
  index: number;
  onNavigate: (route: string) => void;
}

function ModuleCard({ mod, index, onNavigate }: ModuleCardProps) {
  return (
    <motion.div
      key={mod.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 + index * 0.05, duration: 0.4 }}
      className="group rounded-2xl p-4 flex flex-col gap-3 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${mod.colorClass.replace("from-", "").replace(" to-", ", ")})`,
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        border: `1px solid ${mod.borderClass.replace("border-", "")}`,
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onNavigate(mod.route)}
      data-ocid={`ai_hub.module.${mod.id}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${mod.iconColorClass}15`,
            border: `1px solid ${mod.iconColorClass}30`,
          }}
        >
          <mod.Icon size={18} style={{ color: mod.iconColorClass }} />
        </div>
        <ChevronRight
          size={14}
          className="opacity-0 group-hover:opacity-100"
          style={{ color: mod.iconColorClass, transition: "opacity 0.2s" }}
        />
      </div>
      <div className="flex-1">
        <p
          className="text-xs font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {mod.name}
        </p>
        <p
          className="text-[10px] mt-1 leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {mod.description}
        </p>
      </div>
    </motion.div>
  );
}

function TrendSparkline() {
  const points = [30, 45, 38, 58, 52, 68, 62, 74, 70, 80, 77, 85];
  const max = 85;
  const w = 260;
  const h = 48;
  const pts = points
    .map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`)
    .join(" L ");
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ height: "48px" }}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#e879f9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${pts} L ${w},${h} L 0,${h} Z`}
        fill="url(#sparkFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      />
      <motion.polyline
        points={pts}
        fill="none"
        stroke="url(#sparkGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

const AI_TIMELINE = [
  { label: "Predictive scan", time: "09:12", icon: "🔮", color: "#f9a8d4" },
  { label: "Memory updated", time: "10:05", icon: "🧠", color: "#a78bfa" },
  { label: "Risk assessed", time: "11:30", icon: "⚡", color: "#fbbf24" },
  { label: "UI adapted", time: "13:00", icon: "🎨", color: "#60a5fa" },
  { label: "Wellness check", time: "15:45", icon: "💚", color: "#34d399" },
  { label: "Insight ready", time: "17:20", icon: "✨", color: "#e879f9" },
];

const HEALTH_MEMORY_ENTRIES = [
  {
    title: "Reported headache",
    detail: "Linked to low sleep — 3 occurrences",
    icon: "🤕",
    color: "#fb7185",
  },
  {
    title: "Medication logged",
    detail: "Ibuprofen 400mg — consistent",
    icon: "💊",
    color: "#34d399",
  },
  {
    title: "Stress spike",
    detail: "Tuesday afternoon pattern detected",
    icon: "⚡",
    color: "#fbbf24",
  },
  {
    title: "Doctor interaction",
    detail: "Dr. Chen — BP check follow-up",
    icon: "👨‍⚕️",
    color: "#60a5fa",
  },
  {
    title: "Sleep pattern",
    detail: "Avg 6.2h — below 7h target",
    icon: "🌙",
    color: "#a78bfa",
  },
];

const RECOMMENDATIONS = [
  {
    icon: "🌙",
    title: "Improve Sleep Consistency",
    detail:
      "Sleeping 1 hour more per night may reduce your stress risk by up to 28% this week.",
    color: "#a78bfa",
    action: "View Sleep Insights",
    route: "/ai/predictive-care",
  },
  {
    icon: "💧",
    title: "Hydration Reminder",
    detail:
      "Your activity logs suggest you may be under-hydrated on high-stress days. Aim for 2L daily.",
    color: "#22d3ee",
    action: "Track Hydration",
    route: "/ai/outcome-simulator",
  },
  {
    icon: "🫀",
    title: "Medication Adherence",
    detail:
      "You missed 2 doses last week. Consistent adherence can raise your Care Reliability Index by 15 points.",
    color: "#34d399",
    action: "View Care Index",
    route: "/ai/reliability-index",
  },
];

const MODULE_CARDS = [
  {
    id: "predictive-care",
    name: "Predictive Care Engine",
    description:
      "AI forecasts burnout, stress spikes, and health decline before they happen.",
    Icon: Activity,
    colorClass: "from-pink-500/20 to-rose-500/20",
    borderClass: "border-pink-500/25",
    iconColorClass: "#f9a8d4",
    route: "/ai/predictive-care",
  },
  {
    id: "health-memory",
    name: "AI Health Memory",
    description:
      "Never forgets your symptoms, routines, and contextual health history.",
    Icon: Brain,
    colorClass: "from-purple-500/20 to-violet-500/20",
    borderClass: "border-purple-500/25",
    iconColorClass: "#a78bfa",
    route: "/ai/health-memory",
  },
  {
    id: "outcome-simulator",
    name: "Health Outcome Simulator",
    description:
      "Simulate future health scenarios and visualise lifestyle improvement paths.",
    Icon: TrendingUp,
    colorClass: "from-cyan-500/20 to-teal-500/20",
    borderClass: "border-cyan-500/25",
    iconColorClass: "#22d3ee",
    route: "/ai/outcome-simulator",
  },
  {
    id: "reliability-index",
    name: "Care Reliability Index",
    description:
      "Track wellness consistency, medication adherence, and routine habits positively.",
    Icon: CheckCircle,
    colorClass: "from-amber-500/20 to-yellow-500/20",
    borderClass: "border-amber-500/25",
    iconColorClass: "#fbbf24",
    route: "/ai/reliability-index",
  },
  {
    id: "marketplace",
    name: "Care Modules Marketplace",
    description:
      "Enable or disable healthcare AI plugins to personalise your care experience.",
    Icon: Grid3X3,
    colorClass: "from-orange-500/20 to-amber-500/20",
    borderClass: "border-orange-500/25",
    iconColorClass: "#fb923c",
    route: "/ai/marketplace",
  },
  {
    id: "preventive-crisis",
    name: "Preventive Crisis AI",
    description:
      "Detects early signs of panic, burnout, and cognitive overload — calmly.",
    Icon: ShieldAlert,
    colorClass: "from-red-500/20 to-rose-500/20",
    borderClass: "border-red-500/25",
    iconColorClass: "#fb7185",
    route: "/ai/preventive-crisis",
  },
  {
    id: "family-guardian",
    name: "Family Guardian System",
    description:
      "Shared health reminders and care coordination for your entire family.",
    Icon: Users,
    colorClass: "from-teal-500/20 to-cyan-500/20",
    borderClass: "border-teal-500/25",
    iconColorClass: "#2dd4bf",
    route: "/ai/family-guardian",
  },
  {
    id: "digital-brain",
    name: "Digital Brain",
    description:
      "Master AI system — cognitive healthcare profile, predictive orchestration, and real-time adaptation.",
    Icon: Cpu,
    colorClass: "from-fuchsia-500/20 to-pink-500/20",
    borderClass: "border-fuchsia-500/25",
    iconColorClass: "#e879f9",
    route: "/ai/digital-brain",
  },
];

export default function AIHubPage() {
  const navigate = useNavigate();
  const { healthPredictions, livingInsight, emotionalWellness, moodAdaptive } =
    useAI();

  const topPrediction: HealthPrediction | null = healthPredictions[0] ?? null;
  const wellnessScore = emotionalWellness.wellnessScore;
  const wellnessLabel =
    wellnessScore >= 80
      ? "Optimal"
      : wellnessScore >= 60
        ? "Balanced"
        : wellnessScore >= 40
          ? "Moderate"
          : "Needs Care";
  const wellnessColor =
    wellnessScore >= 80
      ? "#34d399"
      : wellnessScore >= 60
        ? "#60a5fa"
        : wellnessScore >= 40
          ? "#fbbf24"
          : "#fb7185";

  const handleNavigate = (route: string) => navigate({ to: route });

  const TREND_BARS = [
    { val: 40, opacity: 0.2, delay: 1.0 },
    { val: 55, opacity: 0.28, delay: 1.07 },
    { val: 48, opacity: 0.36, delay: 1.14 },
    { val: 65, opacity: 0.44, delay: 1.21 },
    { val: 58, opacity: 0.52, delay: 1.28 },
    { val: 72, opacity: 0.6, delay: 1.35 },
    { val: 70, opacity: 0.68, delay: 1.42 },
  ] as const;

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "var(--background)" }}
    >
      {/* Background dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(249,168,212,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          zIndex: 0,
        }}
      />
      {/* Ambient glow blobs */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,168,212,0.1) 0%, transparent 65%), " +
            "radial-gradient(ellipse 40% 40% at 90% 85%, rgba(96,165,250,0.07) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-6">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(249,168,212,0.08) 0%, rgba(96,165,250,0.06) 50%, rgba(232,121,249,0.07) 100%)",
            border: "1px solid rgba(249,168,212,0.2)",
            backdropFilter: "blur(20px)",
          }}
          data-ocid="ai_hub.hero_section"
        >
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(249,168,212,0.6), rgba(96,165,250,0.4), transparent)",
            }}
          />
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: Text */}
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(52,211,153,0.12)",
                      color: "#34d399",
                      border: "1px solid rgba(52,211,153,0.3)",
                    }}
                    data-ocid="ai_hub.status_indicator"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    AI Active
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: `${wellnessColor}15`,
                      color: wellnessColor,
                      border: `1px solid ${wellnessColor}35`,
                    }}
                    data-ocid="ai_hub.wellness_indicator"
                  >
                    <Heart size={10} />
                    {wellnessLabel} {wellnessScore}%
                  </span>
                  {topPrediction && (
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: `${severityColor(topPrediction.severity)}12`,
                        color: severityColor(topPrediction.severity),
                        border: `1px solid ${severityColor(topPrediction.severity)}30`,
                      }}
                      data-ocid="ai_hub.prediction_badge"
                    >
                      {topPrediction.title} {topPrediction.confidence}%
                    </span>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h1
                    className="text-3xl sm:text-4xl font-bold leading-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    AI Healthcare
                    <span
                      style={{
                        background: "linear-gradient(90deg, #f9a8d4, #e879f9)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {" "}
                      Intelligence Hub
                    </span>
                  </h1>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    A living healthcare intelligence system that understands,
                    predicts, adapts, and genuinely cares.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    background: "rgba(249,168,212,0.07)",
                    border: "1px solid rgba(249,168,212,0.2)",
                  }}
                  data-ocid="ai_hub.daily_insight"
                >
                  <Zap
                    size={15}
                    style={{ color: "#f9a8d4", flexShrink: 0, marginTop: 1 }}
                  />
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {livingInsight}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: topPrediction
                      ? `${severityColor(topPrediction.severity)}10`
                      : "rgba(52,211,153,0.08)",
                    border: topPrediction
                      ? `1px solid ${severityColor(topPrediction.severity)}25`
                      : "1px solid rgba(52,211,153,0.2)",
                  }}
                  data-ocid="ai_hub.prediction_summary"
                >
                  {topPrediction ? (
                    <>
                      <AlertTriangle
                        size={14}
                        style={{
                          color: severityColor(topPrediction.severity),
                          flexShrink: 0,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold"
                          style={{
                            color: severityColor(topPrediction.severity),
                          }}
                        >
                          {topPrediction.title}
                        </p>
                        <p
                          className="text-[11px] mt-0.5 truncate"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {topPrediction.preventiveAction}
                        </p>
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: severityColor(topPrediction.severity) }}
                      >
                        {topPrediction.confidence}%
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle
                        size={14}
                        style={{ color: "#34d399", flexShrink: 0 }}
                      />
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#34d399" }}
                      >
                        No risk flags detected today
                      </p>
                    </>
                  )}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Adaptive mode:{" "}
                  <span style={{ color: "#f9a8d4", fontWeight: 600 }}>
                    {moodAdaptive.themeVariant}
                  </span>
                  {" - "}
                  {moodAdaptive.greeting}
                </motion.p>
              </div>

              {/* Right: Neural Brain Viz */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
              >
                <div
                  className="relative p-6 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(249,168,212,0.1) 0%, rgba(232,121,249,0.05) 60%, transparent 100%)",
                    border: "1px solid rgba(249,168,212,0.15)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ border: "1px solid rgba(249,168,212,0.3)" }}
                  />
                  <NeuralBrainViz />
                </div>
                <div className="flex items-center gap-2">
                  <Cpu size={16} style={{ color: "#e879f9" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Digital Brain
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: "rgba(232,121,249,0.15)",
                      color: "#e879f9",
                      border: "1px solid rgba(232,121,249,0.3)",
                    }}
                  >
                    Live
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,168,212,0.2), rgba(232,121,249,0.2))",
                    border: "1px solid rgba(249,168,212,0.35)",
                    color: "#f9a8d4",
                    transition: "transform 0.2s",
                  }}
                  onClick={() => handleNavigate("/ai/digital-brain")}
                  data-ocid="ai_hub.open_digital_brain_button"
                >
                  <Cpu size={13} /> Open Digital Brain
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* MODULE GRID */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain size={18} style={{ color: "#f9a8d4" }} />
              <h2
                className="text-base font-bold"
                style={{ color: "var(--foreground)" }}
              >
                AI Healthcare Modules
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  background: "rgba(249,168,212,0.12)",
                  color: "#f9a8d4",
                  border: "1px solid rgba(249,168,212,0.25)",
                }}
              >
                {MODULE_CARDS.length} modules
              </span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--muted-foreground)" }}
              data-ocid="ai_hub.refresh_button"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          <div
            data-ocid="ai_hub.module_grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {MODULE_CARDS.map((mod, index) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                index={index}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
            data-ocid="ai_hub.timeline_section"
          >
            <h3
              className="text-sm font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <Activity size={14} style={{ color: "#f9a8d4" }} />
              AI Activity Timeline
            </h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                {AI_TIMELINE.map((event) => (
                  <motion.div
                    key={event.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col items-center gap-1"
                    style={{ minWidth: "80px" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        background: `${event.color}15`,
                        border: `1px solid ${event.color}30`,
                      }}
                    >
                      {event.icon}
                    </div>
                    <p
                      className="text-[10px] text-center leading-tight"
                      style={{ color: "var(--foreground)", maxWidth: "72px" }}
                    >
                      {event.label}
                    </p>
                    <span
                      className="text-[9px]"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {event.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Predictive Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
            data-ocid="ai_hub.trends_section"
          >
            <h3
              className="text-sm font-bold mb-1 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <TrendingUp size={14} style={{ color: "#22d3ee" }} />
              Predictive Health Trends
            </h3>
            <p
              className="text-[10px] mb-3"
              style={{ color: "var(--muted-foreground)" }}
            >
              AI-generated wellness trajectory over 12 checkpoints
            </p>
            <TrendSparkline />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#f9a8d4" }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Wellness score
                </span>
              </div>
              <span
                className="text-[11px] font-bold"
                style={{
                  background: "linear-gradient(90deg,#f9a8d4,#e879f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                +23% trend
              </span>
            </div>
            <div className="mt-3 flex items-end gap-1 h-7">
              {TREND_BARS.map((bar) => (
                <motion.div
                  key={`bar-${bar.val}`}
                  className="flex-1 rounded-t"
                  style={{
                    background: `rgba(249,168,212,${bar.opacity})`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(bar.val / 72) * 28}px` }}
                  transition={{
                    delay: bar.delay,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span
                  key={d}
                  className="text-[9px] flex-1 text-center"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {d}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Health Memory Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
            data-ocid="ai_hub.memory_timeline_section"
          >
            <h3
              className="text-sm font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <Brain size={14} style={{ color: "#a78bfa" }} />
              Health Memory Timeline
            </h3>
            <div className="space-y-3">
              {HEALTH_MEMORY_ENTRIES.map((entry) => (
                <motion.div
                  key={entry.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: `${entry.color}15`,
                      border: `1px solid ${entry.color}30`,
                    }}
                  >
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "var(--foreground)" }}
                    >
                      {entry.title}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {entry.detail}
                    </p>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: entry.color }}
                  />
                </motion.div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full text-xs py-2 rounded-xl font-semibold"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.25)",
                color: "#a78bfa",
                transition: "transform 0.2s",
              }}
              onClick={() => handleNavigate("/ai/health-memory")}
              data-ocid="ai_hub.view_memory_button"
            >
              View Full Memory Timeline
            </button>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.5 }}
          className="mt-6"
          data-ocid="ai_hub.recommendations_section"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{ color: "#fbbf24" }} />
            <h3
              className="text-sm font-bold"
              style={{ color: "var(--foreground)" }}
            >
              AI-Generated Recommendations
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((rec) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  background: `${rec.color}08`,
                  border: `1px solid ${rec.color}20`,
                  backdropFilter: "blur(10px)",
                }}
                data-ocid={`ai_hub.recommendation.${RECOMMENDATIONS.indexOf(rec) + 1}`}
              >
                <div className="text-2xl">{rec.icon}</div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {rec.title}
                  </p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {rec.detail}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold self-start px-3 py-1.5 rounded-lg"
                  style={{
                    background: `${rec.color}15`,
                    border: `1px solid ${rec.color}30`,
                    color: rec.color,
                    transition: "transform 0.2s",
                  }}
                  onClick={() => handleNavigate(rec.route)}
                  data-ocid={`ai_hub.recommendation.${RECOMMENDATIONS.indexOf(rec) + 1}.action_button`}
                >
                  {rec.action} <ArrowRight size={11} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

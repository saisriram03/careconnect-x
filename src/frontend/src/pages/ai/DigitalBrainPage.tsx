import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Database,
  Eye,
  FileCheck,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAI } from "../../ai/AIContext";
import GlassCard from "../../components/ui/GlassCard";
import { useTheme } from "../../hooks/useTheme";

const BEHAVIOR_CATEGORIES = [
  {
    name: "Health Checks",
    key: "/dashboard",
    color: "#f9a8d4",
    count: 24,
    lastActive: "2 hours ago",
  },
  {
    name: "Doctor Bookings",
    key: "/doctors",
    color: "#60a5fa",
    count: 11,
    lastActive: "Yesterday",
  },
  {
    name: "Emergency Alerts",
    key: "/emergency",
    color: "#EF4444",
    count: 3,
    lastActive: "3 days ago",
  },
  {
    name: "Community Support",
    key: "/community",
    color: "#FBBF24",
    count: 17,
    lastActive: "5 hours ago",
  },
  {
    name: "AI Hub Usage",
    key: "/ai",
    color: "#00ffc8",
    count: 29,
    lastActive: "30 minutes ago",
  },
  {
    name: "Symptom Checks",
    key: "/symptoms",
    color: "#a78bfa",
    count: 8,
    lastActive: "1 day ago",
  },
  {
    name: "Medicine Orders",
    key: "/medicine",
    color: "#34d399",
    count: 5,
    lastActive: "2 days ago",
  },
  {
    name: "Record Uploads",
    key: "/records",
    color: "#fb923c",
    count: 14,
    lastActive: "4 hours ago",
  },
];

const TWIN_ACTIONS = [
  "Check health metrics",
  "Book a doctor appointment",
  "Explore AI features",
  "Review medical records",
  "Use symptom checker",
  "Browse medicine delivery",
  "Visit community support",
];

function NeuralBrainIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Digital Brain neural network icon"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="#00ffc8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 16 16"
          to="360 16 16"
          dur="12s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="16"
        cy="16"
        r="7"
        fill="rgba(0,255,200,0.15)"
        stroke="#00ffc8"
        strokeWidth="1"
      />
      <circle cx="16" cy="16" r="3" fill="#00ffc8" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <line
        x1="16"
        y1="2"
        x2="16"
        y2="9"
        stroke="#00ffc8"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="16"
        y1="23"
        x2="16"
        y2="30"
        stroke="#00ffc8"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="2"
        y1="16"
        x2="9"
        y2="16"
        stroke="#00ffc8"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="23"
        y1="16"
        x2="30"
        y2="16"
        stroke="#00ffc8"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
}

function AutonomousSystems() {
  const [systems, setSystems] = useState({
    zeroclickPredictions: true,
    behaviorLearning: true,
    adaptiveUI: true,
    collectiveInsights: false,
    predictiveAlerts: true,
  });
  const toggle = (key: keyof typeof systems) =>
    setSystems((prev) => ({ ...prev, [key]: !prev[key] }));
  const items = [
    {
      key: "zeroclickPredictions" as const,
      label: "Zero-Click Predictions",
      desc: "Predicts your next action automatically",
      color: "text-blue-400",
    },
    {
      key: "behaviorLearning" as const,
      label: "Behavior Learning",
      desc: "Continuously learns your patterns",
      color: "text-purple-400",
    },
    {
      key: "adaptiveUI" as const,
      label: "Adaptive UI",
      desc: "Adjusts interface to your mood and pace",
      color: "text-teal-400",
    },
    {
      key: "collectiveInsights" as const,
      label: "Collective Insights",
      desc: "Anonymized patterns from all users",
      color: "text-amber-400",
    },
    {
      key: "predictiveAlerts" as const,
      label: "Predictive Alerts",
      desc: "Gentle early health warnings",
      color: "text-green-400",
    },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-card/50 p-4 flex items-start gap-3">
        <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-400">
            Privacy Protection — Always Active
          </p>
          <p className="text-xs text-muted-foreground">
            Your data is protected at all times and cannot be disabled.
          </p>
        </div>
      </div>
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl border border-white/10 bg-card/50 p-4 flex items-center gap-3"
        >
          <div className="flex-1">
            <p className={`font-medium text-sm ${item.color}`}>{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <button
            type="button"
            onClick={() => toggle(item.key)}
            className={`w-10 h-5 rounded-full transition-colors relative ${systems[item.key] ? "bg-pink-500" : "bg-white/20"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${systems[item.key] ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function AIGovernancePanel() {
  const [permissions, setPermissions] = useState({
    healthMetrics: true,
    appUsage: true,
    emotionalSignals: false,
    locationData: false,
  });
  const [resetMsg, setResetMsg] = useState(false);
  const togglePerm = (key: keyof typeof permissions) =>
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleReset = () => {
    if (window.confirm("Reset all AI memory? This cannot be undone.")) {
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 3000);
    }
  };
  const permItems = [
    {
      key: "healthMetrics" as const,
      label: "Health Metrics",
      desc: "Heart rate, BP, sleep data",
    },
    {
      key: "appUsage" as const,
      label: "App Usage Patterns",
      desc: "Which features you use and when",
    },
    {
      key: "emotionalSignals" as const,
      label: "Emotional Signals",
      desc: "Interaction speed and hesitation",
    },
    {
      key: "locationData" as const,
      label: "Location Data",
      desc: "For emergency and hospital features",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-card/50 p-4">
        <h3 className="font-semibold mb-3 text-sm">What AI Can See</h3>
        <div className="space-y-2">
          {permItems.map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePerm(item.key)}
                className={`w-10 h-5 rounded-full transition-colors relative ${permissions[item.key] ? "bg-pink-500" : "bg-white/20"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${permissions[item.key] ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Predictions Made", val: 12 },
          { label: "UI Adaptations", val: 3 },
          { label: "Insights Generated", val: 7 },
          { label: "Alerts Sent", val: 1 },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-card/50 p-3 text-center"
          >
            <div className="text-xl font-bold text-pink-300">{s.val}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "🔒", text: "You own your data" },
          { icon: "🚫", text: "AI never shares data" },
          { icon: "🔄", text: "Reset memory anytime" },
        ].map((r) => (
          <div
            key={r.text}
            className="rounded-xl border border-white/10 bg-card/50 p-3 text-center"
          >
            <div className="text-xl mb-1">{r.icon}</div>
            <p className="text-xs text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
      {resetMsg && (
        <div className="rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-sm p-3 text-center">
          AI memory cleared successfully.
        </div>
      )}
      <button
        type="button"
        onClick={handleReset}
        className="w-full py-2 px-4 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
      >
        Reset AI Memory
      </button>
    </div>
  );
}

function NeuralActivityMap() {
  const [activeConn, setActiveConn] = useState<number[]>([0, 4]);
  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const newActive: number[] = [];
      while (newActive.length < count) {
        const n = Math.floor(Math.random() * 12);
        if (!newActive.includes(n)) newActive.push(n);
      }
      setActiveConn(newActive);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const inputNodes = [
    { x: 60, y: 60 },
    { x: 60, y: 110 },
    { x: 60, y: 160 },
    { x: 60, y: 210 },
  ];
  const hiddenNodes = [
    { x: 180, y: 50 },
    { x: 180, y: 90 },
    { x: 180, y: 130 },
    { x: 180, y: 170 },
    { x: 180, y: 210 },
    { x: 180, y: 250 },
  ];
  const outputNodes = [
    { x: 300, y: 80 },
    { x: 300, y: 130 },
    { x: 300, y: 180 },
    { x: 300, y: 230 },
  ];

  const connections = [
    { from: inputNodes[0], to: hiddenNodes[0], idx: 0 },
    { from: inputNodes[0], to: hiddenNodes[2], idx: 1 },
    { from: inputNodes[1], to: hiddenNodes[1], idx: 2 },
    { from: inputNodes[1], to: hiddenNodes[3], idx: 3 },
    { from: inputNodes[2], to: hiddenNodes[2], idx: 4 },
    { from: inputNodes[2], to: hiddenNodes[4], idx: 5 },
    { from: inputNodes[3], to: hiddenNodes[3], idx: 6 },
    { from: inputNodes[3], to: hiddenNodes[5], idx: 7 },
    { from: hiddenNodes[0], to: outputNodes[0], idx: 8 },
    { from: hiddenNodes[1], to: outputNodes[1], idx: 9 },
    { from: hiddenNodes[2], to: outputNodes[0], idx: 10 },
    { from: hiddenNodes[3], to: outputNodes[2], idx: 11 },
    { from: hiddenNodes[4], to: outputNodes[2], idx: 12 },
    { from: hiddenNodes[5], to: outputNodes[3], idx: 13 },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-card/50 p-4">
      <svg
        viewBox="0 0 360 290"
        className="w-full max-w-sm mx-auto"
        style={{ height: 200 }}
        role="img"
        aria-label="Neural network visualization diagram"
      >
        {connections.map((conn) => (
          <line
            key={conn.idx}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke={
              activeConn.includes(conn.idx)
                ? "#f9a8d4"
                : "rgba(255,255,255,0.15)"
            }
            strokeWidth={activeConn.includes(conn.idx) ? 2 : 1}
            style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
          />
        ))}
        {inputNodes.map((n) => (
          <circle
            key={`in-${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={10}
            fill="#3b82f6"
            stroke="#60a5fa"
            strokeWidth={1.5}
          />
        ))}
        {hiddenNodes.map((n) => (
          <circle
            key={`h-${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={10}
            fill="#7c3aed"
            stroke="#a78bfa"
            strokeWidth={1.5}
          />
        ))}
        {outputNodes.map((n) => (
          <circle
            key={`out-${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={10}
            fill="#ec4899"
            stroke="#f9a8d4"
            strokeWidth={1.5}
          />
        ))}
        <text x={60} y={278} textAnchor="middle" fontSize="10" fill="#94a3b8">
          Health Data
        </text>
        <text x={180} y={278} textAnchor="middle" fontSize="10" fill="#94a3b8">
          AI Processing
        </text>
        <text x={300} y={278} textAnchor="middle" fontSize="10" fill="#94a3b8">
          Insights
        </text>
      </svg>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Pink connections indicate active neural pathways
      </p>
    </div>
  );
}

function PrivacyIntelligenceCenter() {
  const [settings, setSettings] = useState({
    healthMetrics: true,
    behaviorPatterns: true,
    locationData: false,
    voiceData: false,
  });
  const toggles = [
    {
      key: "healthMetrics" as const,
      label: "Health Metrics Tracking",
      desc: "Heart rate, sleep, blood pressure patterns",
    },
    {
      key: "behaviorPatterns" as const,
      label: "Behavior Pattern Analysis",
      desc: "How you interact with the app",
    },
    {
      key: "locationData" as const,
      label: "Location Data",
      desc: "GPS location for emergency services",
    },
    {
      key: "voiceData" as const,
      label: "Voice Data",
      desc: "Voice commands from Voice Care Assistant",
    },
  ];
  return (
    <section className="mb-8">
      <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 border border-pink-300/30 dark:border-pink-400/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-pink-400 mb-1">
          Privacy Intelligence Center
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Control exactly what your AI companion observes and acts on
        </p>
        <div className="space-y-4">
          {toggles.map((t) => (
            <div
              key={t.key}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="font-medium text-sm dark:text-white">{t.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, [t.key]: !prev[t.key] }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[t.key] ? "bg-pink-400" : "bg-gray-300 dark:bg-gray-600"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${settings[t.key] ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <span>🔒</span> All data stays on your device. Nothing is shared
          externally.
        </p>
      </div>
    </section>
  );
}

function AIGovernanceAuditLog() {
  const auditEntries = [
    {
      timestamp: "2 min ago",
      action: "Mood detected: Calm",
      confidence: "94%",
      status: "Applied",
    },
    {
      timestamp: "15 min ago",
      action: "UI simplified during typing",
      confidence: "87%",
      status: "Applied",
    },
    {
      timestamp: "1 hr ago",
      action: "Predicted stress spike",
      confidence: "76%",
      status: "Monitored",
    },
    {
      timestamp: "3 hr ago",
      action: "Recovery plan adjusted",
      confidence: "91%",
      status: "Applied",
    },
    {
      timestamp: "6 hr ago",
      action: "Sleep quality analyzed",
      confidence: "98%",
      status: "Applied",
    },
  ];
  return (
    <section className="mb-8">
      <div className="backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold dark:text-white mb-1">
          AI Governance
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Full transparency on every AI decision made for you
        </p>
        <div className="space-y-3 mb-4">
          {auditEntries.map((entry) => (
            <div
              key={entry.action}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-xs text-gray-400 w-16 shrink-0">
                {entry.timestamp}
              </span>
              <span className="text-sm dark:text-white flex-1">
                {entry.action}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-400/20 text-pink-400 border border-pink-400/30">
                {entry.confidence}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${entry.status === "Applied" ? "bg-green-400/10 text-green-400 border-green-400/30" : "bg-amber-400/10 text-amber-400 border-amber-400/30"}`}
              >
                {entry.status}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            alert(
              "Feature coming soon — you will be able to review and override individual AI decisions.",
            )
          }
          className="w-full py-2 rounded-xl border border-pink-400/40 text-pink-400 text-sm hover:bg-pink-400/10 transition-colors"
        >
          Override any AI decision
        </button>
      </div>
    </section>
  );
}

export default function DigitalBrainPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { digitalBrain } = useAI();
  const isDark = theme === "dark";

  const [twinAction, setTwinAction] = useState(() => TWIN_ACTIONS[0]);
  const [twinConf, setTwinConf] = useState(
    () => 72 + Math.floor(Math.random() * 20),
  );
  const [twinRefreshing, setTwinRefreshing] = useState(false);

  // Refresh twin prediction every 20s
  useEffect(() => {
    const id = setInterval(() => {
      const idx = Math.floor(Math.random() * TWIN_ACTIONS.length);
      setTwinAction(TWIN_ACTIONS[idx]);
      setTwinConf(62 + Math.floor(Math.random() * 32));
    }, 20000);
    return () => clearInterval(id);
  }, []);

  const handleRefreshTwin = () => {
    setTwinRefreshing(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * TWIN_ACTIONS.length);
      setTwinAction(TWIN_ACTIONS[idx]);
      setTwinConf(62 + Math.floor(Math.random() * 32));
      setTwinRefreshing(false);
    }, 800);
  };

  // Build bar chart data from behavior insights + static page visits
  const behaviorData = BEHAVIOR_CATEGORIES.map((cat) => ({
    name: cat.name,
    value: cat.count,
    color: cat.color,
  }));

  const textColor = isDark ? "#ffffff" : "#1e3a5f";
  const mutedColor = isDark ? "#888888" : "#4a5568";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(96,165,250,0.07)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(96,165,250,0.2)";

  const coordinationLog = digitalBrain.coordinationLog;
  const totalInteractions = digitalBrain.totalInteractions;
  const activeSince = digitalBrain.activeSince;
  const intelligenceLevel = digitalBrain.intelligenceLevel;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/ai" })}
          className="p-2 rounded-xl hover:text-pink-400 transition-colors"
          style={{ color: mutedColor }}
          aria-label="Back to AI Hub"
          data-ocid="digital_brain.back.button"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <NeuralBrainIcon />
          <div>
            <h1 className="text-xl font-bold" style={{ color: textColor }}>
              Digital Brain{" "}
              <span style={{ color: "#00ffc8" }}>— Your AI Twin</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: mutedColor }}>
              Real-time cognitive model of your behavior & predicted future
              actions
            </p>
          </div>
        </div>
        {/* Stats row */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-bold" style={{ color: "#00ffc8" }}>
              {totalInteractions}
            </p>
            <p className="text-[10px]" style={{ color: mutedColor }}>
              interactions
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold" style={{ color: "#f9a8c9" }}>
              {activeSince}
            </p>
            <p className="text-[10px]" style={{ color: mutedColor }}>
              active since
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#00ffc8" }}
              />
              <p className="text-xs font-bold" style={{ color: "#00ffc8" }}>
                Learning
              </p>
            </div>
            <p className="text-[10px]" style={{ color: mutedColor }}>
              in progress
            </p>
          </div>
        </div>
      </div>

      {/* Learning Progress Bar */}
      <GlassCard className="p-4" glowColor="teal">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#00ffc8" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "#00ffc8" }}
            >
              Digital Twin Learning Progress
            </span>
          </div>
          <span className="text-xs" style={{ color: mutedColor }}>
            {intelligenceLevel}% complete
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: 6,
            background: isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(96,165,250,0.15)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${intelligenceLevel}%`,
              background: "linear-gradient(90deg, #00ffc8, #60a5fa)",
            }}
          />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: mutedColor }}>
          Intelligence level: {intelligenceLevel}% · {totalInteractions}{" "}
          interactions recorded
        </p>
      </GlassCard>

      {/* 3-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel 1: Cognitive Profile */}
        <GlassCard className="p-5" glowColor="teal">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: "#00ffc8" }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#00ffc8" }}
            >
              Cognitive Profile
            </span>
          </div>

          {/* Consistency Ring */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div
              className="relative flex items-center justify-center"
              style={{ width: 100, height: 100 }}
            >
              <svg
                width={100}
                height={100}
                className="-rotate-90"
                role="img"
                aria-label="Care consistency score"
              >
                <circle
                  cx={50}
                  cy={50}
                  r={40}
                  fill="none"
                  stroke={
                    isDark ? "rgba(255,255,255,0.07)" : "rgba(96,165,250,0.15)"
                  }
                  strokeWidth={8}
                />
                <circle
                  cx={50}
                  cy={50}
                  r={40}
                  fill="none"
                  stroke="#00ffc8"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    40 *
                    (1 - digitalBrain.cognitiveProfile.careConsistency / 100)
                  }
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span
                  className="text-xl font-bold"
                  style={{ color: "#00ffc8" }}
                >
                  {digitalBrain.cognitiveProfile.careConsistency}%
                </span>
                <span className="text-[9px]" style={{ color: mutedColor }}>
                  consistency
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold" style={{ color: "#00ffc8" }}>
                {digitalBrain.cognitiveProfile.primaryHealthFocus}
              </p>
              <p className="text-[11px] mt-1" style={{ color: mutedColor }}>
                Style: {digitalBrain.cognitiveProfile.engagementStyle}
              </p>
            </div>
          </div>

          {/* Behavior Insights */}
          <div className="space-y-2">
            {digitalBrain.behaviorInsights.map((insight) => (
              <div key={insight.label} className="flex items-center gap-2">
                <span className="text-sm flex-shrink-0">{insight.icon}</span>
                <span
                  className="text-[10px] w-28 flex-shrink-0"
                  style={{ color: mutedColor }}
                >
                  {insight.label}
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: textColor }}
                >
                  {insight.value}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[9px] mt-3" style={{ color: mutedColor }}>
            Risk awareness: {digitalBrain.cognitiveProfile.riskAwareness}
          </p>
        </GlassCard>

        {/* Panel 2: Behavior Patterns */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: "#f9a8c9" }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#f9a8c9" }}
            >
              Behavior Patterns
            </span>
          </div>
          <p className="text-[11px] mb-3" style={{ color: mutedColor }}>
            Top 5 activity categories this session
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={behaviorData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fill: mutedColor, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: isDark ? "#111" : "#eff6ff",
                  border: "1px solid rgba(0,255,200,0.3)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: textColor,
                }}
                cursor={false}
                formatter={(v) => [`${v} visits`, "Count"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {behaviorData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Panel 3: Coordination Log */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} style={{ color: "#a78bfa" }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#a78bfa" }}
            >
              AI Coordination Log
            </span>
          </div>
          <p className="text-[11px] mb-3" style={{ color: mutedColor }}>
            Recent AI module activity
          </p>
          <div
            className="space-y-2.5 overflow-y-auto"
            style={{ maxHeight: 230 }}
          >
            {coordinationLog.length === 0 ? (
              <p className="text-[11px]" style={{ color: mutedColor }}>
                No AI activity recorded yet.
              </p>
            ) : (
              coordinationLog.slice(0, 10).map((entry, i) => {
                const ts = new Date(entry.timestamp);
                const timeStr = ts.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={`${entry.timestamp}-${i}`}
                    className="flex items-start gap-2 pb-2"
                    style={{
                      borderBottom:
                        i < Math.min(coordinationLog.length, 10) - 1
                          ? `1px solid ${cardBorder}`
                          : "none",
                    }}
                  >
                    <span className="text-sm flex-shrink-0">{entry.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-medium truncate"
                        style={{ color: textColor }}
                      >
                        {entry.module} — {entry.action}
                      </p>
                      <p className="text-[9px]" style={{ color: mutedColor }}>
                        {timeStr}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>

      {/* Digital Twin Simulation */}
      <GlassCard className="p-6" glowColor="teal">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,255,200,0.12)",
                border: "1px solid rgba(0,255,200,0.3)",
              }}
            >
              <NeuralBrainIcon />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#00ffc8" }}>
                Digital Twin Simulation
              </p>
              <p className="text-[11px]" style={{ color: mutedColor }}>
                Simulating your next likely action
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="digital_brain.twin.refresh_button"
            onClick={handleRefreshTwin}
            className="p-2 rounded-xl transition-all hover:scale-110"
            style={{
              background: "rgba(0,255,200,0.1)",
              border: "1px solid rgba(0,255,200,0.25)",
              color: "#00ffc8",
            }}
            aria-label="Re-simulate"
          >
            <RefreshCw
              size={15}
              className={twinRefreshing ? "animate-spin" : ""}
            />
          </button>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(0,255,200,0.06)",
            border: "1px solid rgba(0,255,200,0.2)",
          }}
        >
          <p className="text-xs" style={{ color: mutedColor }}>
            Your Digital Twin predicts:
          </p>
          <p className="text-base font-bold mt-1" style={{ color: "#ffffff" }}>
            {twinRefreshing ? "Simulating…" : twinAction}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(0,255,200,0.12)",
                color: "#00ffc8",
                border: "1px solid rgba(0,255,200,0.3)",
              }}
            >
              {twinConf}% confidence
            </div>
            <span className="text-[10px]" style={{ color: mutedColor }}>
              Auto-refreshes every 20s
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Active Since", value: activeSince, color: "#f9a8c9" },
            {
              label: "Total Interactions",
              value: String(totalInteractions),
              color: "#00ffc8",
            },
            {
              label: "Intelligence Level",
              value: `${intelligenceLevel}%`,
              color: "#a78bfa",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <p className="text-sm font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: mutedColor }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Memory Engine */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-400" />
          Memory Engine
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Health Patterns", count: 87, color: "blue", icon: "💊" },
            {
              label: "Behavioral Routines",
              count: 34,
              color: "purple",
              icon: "🔄",
            },
            {
              label: "Emotional Context",
              count: 52,
              color: "pink",
              icon: "💗",
            },
            { label: "Medical History", count: 19, color: "green", icon: "📋" },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-card/50 p-4 text-center"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-2xl font-bold text-pink-300">
                {cat.count}
              </div>
              <div className="text-xs text-muted-foreground">{cat.label}</div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                Last updated: {i * 5 + 2}m ago
              </div>
            </motion.div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-card/50 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Memory Utilization</span>
            <span className="text-pink-300">67%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-pink-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-card/50 p-4">
          <h3 className="font-semibold mb-3">Core Memories</h3>
          <div className="space-y-2">
            {[
              {
                text: "Peak health hours: 8–10am",
                time: "2 days ago",
                badge: "High",
              },
              {
                text: "Monday stress patterns detected",
                time: "5 days ago",
                badge: "High",
              },
              {
                text: "Better sleep when exercise logged",
                time: "1 week ago",
                badge: "Medium",
              },
              {
                text: "Blood pressure improved after diet change",
                time: "2 weeks ago",
                badge: "High",
              },
              {
                text: "Weekend health scores consistently higher",
                time: "3 weeks ago",
                badge: "Medium",
              },
            ].map((mem, i) => (
              <motion.div
                key={mem.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-2 rounded-lg bg-white/5"
              >
                <div className="w-2 h-2 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{mem.text}</p>
                  <p className="text-xs text-muted-foreground">{mem.time}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${mem.badge === "High" ? "bg-pink-500/20 text-pink-300" : "bg-blue-500/20 text-blue-300"}`}
                >
                  {mem.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Autonomous Systems */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Autonomous Systems
        </h2>
        <AutonomousSystems />
      </section>

      {/* AI Governance */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          AI Governance
        </h2>
        <AIGovernancePanel />
      </section>

      {/* Neural Activity Map */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          Neural Activity Map
        </h2>
        <NeuralActivityMap />
      </section>

      {/* Privacy Intelligence Center */}
      <section className="space-y-4" data-ocid="digital_brain.privacy.section">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Eye className="w-5 h-5 text-pink-400" />
          Privacy Intelligence Center
        </h2>
        <PrivacyIntelligenceCenter />
      </section>

      {/* AI Governance Audit Log */}
      <section className="space-y-4" data-ocid="digital_brain.audit.section">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-green-400" />
          AI Governance Audit Log
        </h2>
        <AIGovernanceAuditLog />
      </section>
    </div>
  );
}

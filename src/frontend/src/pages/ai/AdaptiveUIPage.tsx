import {
  BookOpen,
  Compass,
  Contrast,
  Eye,
  Focus,
  Layers,
  LayoutGrid,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const toggles = [
  {
    id: "focus",
    label: "Focus Mode",
    description: "Minimize distractions and show only essential elements",
    icon: Focus,
    default: false,
  },
  {
    id: "calm",
    label: "Calm Transitions",
    description: "Use slower, gentler animations throughout the app",
    icon: Eye,
    default: true,
  },
  {
    id: "contrast",
    label: "High Contrast",
    description: "Increase contrast for better readability",
    icon: Contrast,
    default: false,
  },
  {
    id: "compact",
    label: "Compact Cards",
    description: "Reduce card padding and spacing for density",
    icon: LayoutGrid,
    default: false,
  },
];

const MODE_CARDS = [
  {
    id: "fast_user",
    label: "Fast User",
    icon: Zap,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/15",
    description: "Minimal interface, quick actions",
    preview: ["100%", "80%", "60%"],
    previewColor: "bg-amber-400",
    detailText:
      "Optimized for speed and efficiency. Key actions surface immediately, secondary info is hidden by default. You navigate 3× faster than average.",
    detailMockUI: [
      { label: "Actions surfaced", value: "Top 3 only" },
      { label: "Avg. load time", value: "0.3s" },
      { label: "Steps saved", value: "12 today" },
    ],
    detailCardBg: "bg-amber-400/5",
    detailCardBorder: "border-amber-400/20",
  },
  {
    id: "explorer",
    label: "Explorer",
    icon: Compass,
    iconColor: "text-teal-400",
    iconBg: "bg-teal-400/15",
    description: "Detailed insights, full data views",
    preview: ["100%", "100%", "90%", "75%"],
    previewColor: "bg-teal-400",
    detailText:
      "Full insights mode. Every section shows rich data, expanded context, and deep analytics. You tend to discover 40% more features than most users.",
    detailMockUI: [
      { label: "Panels visible", value: "All active" },
      { label: "Features explored", value: "8 / 11" },
      { label: "Insights read", value: "24 this week" },
    ],
    detailCardBg: "bg-teal-400/5",
    detailCardBorder: "border-teal-400/20",
  },
  {
    id: "passive_user",
    label: "Passive User",
    icon: BookOpen,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/15",
    description: "Step-by-step guidance, tutorials",
    preview: ["70%", "50%", "40%"],
    previewColor: "bg-purple-400",
    detailText:
      "Gentle guided mode. The app walks you through each step with context and tips. Complexity is hidden until you're ready. Perfect for focused, calm sessions.",
    detailMockUI: [
      { label: "Guidance steps", value: "Active" },
      { label: "Tooltips shown", value: "6 today" },
      { label: "Complexity level", value: "Minimal" },
    ],
    detailCardBg: "bg-purple-400/5",
    detailCardBorder: "border-purple-400/20",
  },
];

const history = [
  {
    time: "Today, 08:30",
    action: "Switched to Morning Mode",
    detail: "Brighter palette, energetic layout",
  },
  {
    time: "Yesterday, 20:15",
    action: "Activated Calm Transitions",
    detail: "Reduced motion intensity by 40%",
  },
  {
    time: "2 days ago, 14:00",
    action: "Detected Explorer Pattern",
    detail: "Expanded detail panels automatically",
  },
  {
    time: "3 days ago, 23:00",
    action: "Night Mode Triggered",
    detail: "Dimmed accents, softer typography",
  },
  {
    time: "5 days ago, 09:00",
    action: "First-time Setup Complete",
    detail: "Default preferences applied",
  },
];

function getTimeMode() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)
    return {
      label: "Morning",
      icon: Sunrise,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    };
  if (hour >= 12 && hour < 17)
    return {
      label: "Afternoon",
      icon: Sun,
      color: "text-orange-400",
      bg: "bg-orange-400/10 border-orange-400/20",
    };
  if (hour >= 17 && hour < 21)
    return {
      label: "Evening",
      icon: Sunset,
      color: "text-pink-400",
      bg: "bg-pink-400/10 border-pink-400/20",
    };
  return {
    label: "Night",
    icon: Moon,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10 border-indigo-400/20",
  };
}

export default function AdaptiveUIPage() {
  const [selectedMode, setSelectedMode] = useState<string>("explorer");
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      for (const t of toggles) {
        init[t.id] = t.default;
      }
      return init;
    },
  );

  const [stressPercent, setStressPercent] = useState(0);
  const mode = getTimeMode();
  const ModeIcon = mode.icon;

  useEffect(() => {
    const timer = setTimeout(() => setStressPercent(24), 400);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (id: string) => {
    setToggleState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stressPercent / 100) * circumference;

  const currentModeData = MODE_CARDS.find((m) => m.id === selectedMode);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-7 h-7 text-pink-400" />
          <h1 className="text-2xl font-bold">Adaptive UI Intelligence</h1>
        </div>
        <p className="text-muted-foreground">Your interface evolves with you</p>
      </div>

      {/* Current Mode Detected */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 backdrop-blur-md bg-white/5 flex items-center gap-4 ${mode.bg}`}
      >
        <div className="relative">
          <ModeIcon className={`w-8 h-8 ${mode.color}`} />
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`absolute inset-0 rounded-full ${mode.color.replace("text-", "bg-")} opacity-20`}
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">
            Current Mode Detected
          </div>
          <div className={`text-lg font-semibold ${mode.color}`}>
            {mode.label} Mode Active
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className={`w-2.5 h-2.5 rounded-full ${mode.color.replace("text-", "bg-")}`}
        />
      </motion.div>

      {/* Mode Selection Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Select Your UI Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODE_CARDS.map((card, i) => {
            const Icon = card.icon;
            const isSelected = selectedMode === card.id;
            return (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode(card.id)}
                data-ocid={`adaptive.mode.${card.id}`}
                className={`relative text-left rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 ${
                  isSelected
                    ? "border-pink-400/60 bg-pink-400/10 shadow-[0_0_20px_rgba(249,168,212,0.25)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="mode-glow"
                    className="absolute inset-0 rounded-2xl bg-pink-400/5"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="font-semibold mb-1">{card.label}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {card.description}
                </p>
                {/* Mock UI preview */}
                <div className="rounded-lg bg-white/5 border border-white/10 p-2 space-y-1.5">
                  {card.preview.map((row, ri) => (
                    <div
                      key={`${card.id}-row-${ri}`}
                      className={`rounded h-2 ${card.previewColor} opacity-${50 - ri * 10}`}
                      style={{ width: row }}
                    />
                  ))}
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-pink-400 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* AnimatePresence Mode Detail Panel */}
      <AnimatePresence mode="wait">
        {currentModeData && (
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="rounded-2xl border border-pink-400/30 bg-pink-400/5 backdrop-blur-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <currentModeData.icon
                className={`w-6 h-6 ${currentModeData.iconColor}`}
              />
              <h3 className="font-bold text-lg">
                {currentModeData.label} Mode
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {currentModeData.detailText}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {currentModeData.detailMockUI.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border ${currentModeData.detailCardBorder} ${currentModeData.detailCardBg} p-3`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </div>
                  <div
                    className={`text-sm font-semibold ${currentModeData.iconColor}`}
                  >
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Adaptations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Adaptations</h2>
        <div className="space-y-3">
          {toggles.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <t.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.description}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(t.id)}
                data-ocid={`adaptive.toggle.${t.id}`}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${toggleState[t.id] ? "bg-pink-400" : "bg-muted"}`}
                aria-pressed={toggleState[t.id]}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${toggleState[t.id] ? "translate-x-5" : ""}`}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stress Level Ring */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm flex items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg
            className="w-24 h-24 -rotate-90"
            viewBox="0 0 80 80"
            role="img"
            aria-label="Stress level indicator ring"
          >
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-green-400"
            />
          </svg>
          <div className="absolute text-sm font-bold">{stressPercent}%</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Stress Level</div>
          <div className="text-lg font-semibold text-green-400">Normal</div>
          <div className="text-xs text-muted-foreground mt-1">
            Within healthy range
          </div>
        </div>
      </div>

      {/* Evolution History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">UI Evolution History</h2>
        <div className="space-y-3">
          {history.map((h, i) => (
            <motion.div
              key={h.time || String(i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{h.action}</span>
                <span className="text-xs text-muted-foreground">{h.time}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {h.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

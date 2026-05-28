import { Clock, Cpu, LayoutGrid, Minimize2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const TIME_MODES = [
  {
    id: "morning",
    label: "Morning",
    time: "05:00 – 12:00",
    emoji: "🌅",
    palette: {
      bg: "#fef3c7",
      accent: "#f59e0b",
      text: "#78350f",
      card: "#fde68a",
    },
    desc: "Bright & energetic — maximum clarity for a productive start.",
    preview: ["#fbbf24", "#fde68a", "#fef3c7"],
  },
  {
    id: "afternoon",
    label: "Afternoon",
    time: "12:00 – 17:00",
    emoji: "☀️",
    palette: {
      bg: "#eff6ff",
      accent: "#3b82f6",
      text: "#1e3a5f",
      card: "#bfdbfe",
    },
    desc: "Balanced & focused — clean layouts to maintain peak performance.",
    preview: ["#3b82f6", "#93c5fd", "#eff6ff"],
  },
  {
    id: "evening",
    label: "Evening",
    time: "17:00 – 21:00",
    emoji: "🌆",
    palette: {
      bg: "#1e1b4b",
      accent: "#f9a8d4",
      text: "#e0e7ff",
      card: "#312e81",
    },
    desc: "Calm & warm — reduced brightness, softer transitions.",
    preview: ["#f9a8d4", "#a78bfa", "#1e1b4b"],
  },
  {
    id: "night",
    label: "Night",
    time: "21:00 – 05:00",
    emoji: "🌙",
    palette: {
      bg: "#09090b",
      accent: "#6366f1",
      text: "#d4d4d8",
      card: "#18181b",
    },
    desc: "Dark & minimal — only what matters, nothing to strain your eyes.",
    preview: ["#6366f1", "#4338ca", "#09090b"],
  },
];

function getActive() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function MockUI({ mode }: { mode: (typeof TIME_MODES)[0] }) {
  const p = mode.palette;
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: p.bg, minHeight: 120 }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: p.accent }}
        />
        <div className="h-2 w-20 rounded-full" style={{ background: p.card }} />
        <div
          className="ml-auto h-2 w-8 rounded-full"
          style={{ background: p.accent, opacity: 0.5 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-lg p-2"
            style={{ background: p.card, opacity: 0.85 }}
          >
            <div
              className="h-1.5 w-10 rounded-full mb-1.5"
              style={{ background: p.accent }}
            />
            <div
              className="h-1 w-14 rounded-full"
              style={{ background: p.text, opacity: 0.3 }}
            />
          </div>
        ))}
      </div>
      <div
        className="h-6 w-full rounded-lg flex items-center justify-center"
        style={{ background: p.accent, opacity: 0.9 }}
      >
        <div className="h-1.5 w-12 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

export default function MoodAdaptivePage() {
  const active = getActive();
  const [selected, setSelected] = useState(active);
  const [simplified, setSimplified] = useState(false);
  const selectedMode =
    TIME_MODES.find((m) => m.id === selected) ?? TIME_MODES[0];

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Clock className="w-7 h-7 text-purple-400" />
          <h1 className="text-2xl font-bold">Mood-Adaptive Interface</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          UI that changes with the time of day and your energy level.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-4"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(249,168,212,0.15)",
            border: "1px solid rgba(249,168,212,0.3)",
          }}
        >
          <Cpu className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Currently Detected Mode
          </p>
          <p className="font-bold text-pink-300">
            {TIME_MODES.find((m) => m.id === active)?.emoji}{" "}
            {TIME_MODES.find((m) => m.id === active)?.label} Mode
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Active</span>
        </div>
      </motion.div>

      <div>
        <h3 className="font-semibold mb-4">Time-Based UI Previews</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TIME_MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              type="button"
              data-ocid={`mood.mode.${mode.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(mode.id)}
              className="rounded-2xl overflow-hidden text-left transition-all duration-200"
              style={{
                border:
                  selected === mode.id
                    ? "2px solid rgba(249,168,212,0.6)"
                    : "1.5px solid rgba(255,255,255,0.12)",
                boxShadow:
                  selected === mode.id
                    ? "0 0 18px rgba(249,168,212,0.2)"
                    : "none",
              }}
            >
              <div className="flex h-3">
                {mode.preview.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{mode.emoji}</span>
                  <span className="font-semibold text-sm">{mode.label}</span>
                  {mode.id === active && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      NOW
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{mode.time}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {selectedMode.emoji} {selectedMode.label} Mode Preview
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MockUI mode={selectedMode} />
            <div className="flex flex-col justify-center gap-3">
              <p className="text-sm text-muted-foreground">
                {selectedMode.desc}
              </p>
              <div className="flex gap-2">
                {selectedMode.preview.map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 rounded-full border-2 border-white/20"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Minimize2 className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-semibold text-sm">Simplified Mode</p>
              <p className="text-xs text-muted-foreground">
                Reduce UI to essential elements during high-stress periods.
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="mood.simplified.toggle"
            onClick={() => setSimplified((p) => !p)}
            className="relative w-11 h-6 rounded-full transition-colors duration-300"
            style={{
              background: simplified
                ? "rgba(249,168,212,0.6)"
                : "rgba(255,255,255,0.12)",
            }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300"
              style={{
                left: simplified ? "calc(100% - 22px)" : "2px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            />
          </button>
        </div>
        <AnimatePresence>
          {simplified && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-3">
                <p className="text-xs text-blue-300">
                  ✓ Simplified mode active — only critical health actions shown.
                  Animations and decorative elements minimized.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SCENARIOS = [
  {
    id: "exercise",
    label: "Add 30 min exercise daily",
    delta: { sleep: +12, stress: -18, energy: +22, heart: +15 },
  },
  {
    id: "sleep",
    label: "Fix sleep schedule (10pm bedtime)",
    delta: { sleep: +28, stress: -15, energy: +18, heart: +10 },
  },
  {
    id: "diet",
    label: "Reduce processed food by 50%",
    delta: { sleep: +8, stress: -10, energy: +14, heart: +20 },
  },
  {
    id: "stress",
    label: "Daily 10-min mindfulness",
    delta: { sleep: +10, stress: -25, energy: +12, heart: +8 },
  },
  {
    id: "hydration",
    label: "Drink 2.5L water daily",
    delta: { sleep: +6, stress: -8, energy: +16, heart: +12 },
  },
];

const BASE = { sleep: 62, stress: 68, energy: 55, heart: 70 };

export default function OutcomeSimulatorPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === selected);
  const metrics = scenario
    ? {
        sleep: Math.min(100, BASE.sleep + scenario.delta.sleep),
        stress: Math.min(100, Math.max(0, BASE.stress + scenario.delta.stress)),
        energy: Math.min(100, BASE.energy + scenario.delta.energy),
        heart: Math.min(100, BASE.heart + scenario.delta.heart),
      }
    : BASE;

  const metricList = [
    { key: "sleep", label: "Sleep Quality", color: "#a78bfa" },
    { key: "stress", label: "Stress Level", color: "#fb7185", invert: true },
    { key: "energy", label: "Energy Score", color: "#34d399" },
    { key: "heart", label: "Heart Health", color: "#f9a8c9" },
  ] as {
    key: keyof typeof BASE;
    label: string;
    color: string;
    invert?: boolean;
  }[];

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-4xl mx-auto">
      <motion.button
        type="button"
        data-ocid="outcome_sim.back.button"
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
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.4)",
            }}
          >
            <FlaskConical size={18} style={{ color: "#fbbf24" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Health Outcome Simulator
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a lifestyle change to simulate your predicted health
              improvements
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Choose a scenario
          </p>
          {SCENARIOS.map((s, i) => (
            <motion.button
              type="button"
              key={s.id}
              data-ocid={`outcome_sim.scenario.${i + 1}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background:
                  selected === s.id
                    ? "rgba(251,191,36,0.12)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${selected === s.id ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: selected === s.id ? "#fbbf24" : "var(--foreground)",
                boxShadow:
                  selected === s.id ? "0 0 16px rgba(251,191,36,0.2)" : "none",
              }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {selected ? "Predicted outcomes" : "Current baseline"}
          </p>
          {metricList.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground">{m.label}</span>
                <span className="text-sm font-bold" style={{ color: m.color }}>
                  {metrics[m.key]}%
                  {selected && scenario && (
                    <span
                      className="text-xs ml-1"
                      style={{
                        color:
                          scenario.delta[m.key] >= 0 ? "#4ade80" : "#fb7185",
                      }}
                    >
                      ({scenario.delta[m.key] >= 0 ? "+" : ""}
                      {scenario.delta[m.key]})
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10">
                <motion.div
                  className="h-2 rounded-full"
                  initial={{ width: `${BASE[m.key]}%` }}
                  animate={{ width: `${metrics[m.key]}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(90deg, ${m.color}60, ${m.color})`,
                  }}
                />
              </div>
            </motion.div>
          ))}
          {selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground italic mt-2"
            >
              Predictions are AI estimates based on published health research.
              Consult your doctor before making changes.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

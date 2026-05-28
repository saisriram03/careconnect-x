import { useCallback, useState } from "react";
import type { CareModule } from "./types";

const STORAGE_KEY = "ccx_care_modules";

const MODULE_DEFINITIONS: CareModule[] = [
  {
    id: "elderly_care",
    name: "Elderly Care",
    description:
      "Monitor elderly family members, track medications, and receive caregiver alerts for aging-related health changes.",
    icon: "🧓",
    enabled: false,
    category: "elderly",
    features: [
      "Medication tracking",
      "Fall risk alerts",
      "Daily wellness check",
      "Caregiver dashboard",
    ],
  },
  {
    id: "pregnancy_care",
    name: "Pregnancy Care",
    description:
      "Week-by-week pregnancy tracking, prenatal reminders, nutrition guidance, and appointment scheduling.",
    icon: "🤱",
    enabled: false,
    category: "maternal",
    features: [
      "Trimester tracking",
      "Prenatal reminders",
      "Nutrition AI",
      "OB appointment sync",
    ],
  },
  {
    id: "mental_wellness",
    name: "Mental Wellness",
    description:
      "Daily mood tracking, CBT-inspired exercises, stress management tools, and therapist connection.",
    icon: "🧠",
    enabled: true,
    category: "mental",
    features: [
      "Mood journal",
      "Breathing exercises",
      "Stress heatmap",
      "Crisis hotline access",
    ],
  },
  {
    id: "diabetes_monitoring",
    name: "Diabetes Monitoring",
    description:
      "Blood glucose tracking, A1C trends, meal impact analysis, and insulin reminder system.",
    icon: "🩸",
    enabled: false,
    category: "chronic",
    features: [
      "Glucose log",
      "A1C trend",
      "Meal analysis",
      "Insulin reminders",
    ],
  },
  {
    id: "nutrition_ai",
    name: "Nutrition AI",
    description:
      "Personalized meal plans, calorie intelligence, nutrient gap detection, and food interaction warnings.",
    icon: "🥗",
    enabled: false,
    category: "nutrition",
    features: [
      "Meal planner",
      "Nutrient analysis",
      "Food interactions",
      "Hydration tracker",
    ],
  },
  {
    id: "fitness_sync",
    name: "Fitness Sync",
    description:
      "Activity goal tracking, workout plans, recovery monitoring, and fitness device integration.",
    icon: "🏃",
    enabled: false,
    category: "fitness",
    features: ["Activity goals", "Workout plans", "Recovery AI", "Device sync"],
  },
];

function loadToggles(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveToggles(overrides: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

export function useHealthcareModules() {
  const [modules, setModules] = useState<CareModule[]>(() => {
    const overrides = loadToggles();
    return MODULE_DEFINITIONS.map((m) => ({
      ...m,
      enabled: overrides[m.id] !== undefined ? overrides[m.id] : m.enabled,
    }));
  });

  const toggleModule = useCallback((id: string) => {
    setModules((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, enabled: !m.enabled } : m,
      );
      const overrides: Record<string, boolean> = {};
      for (const m of updated) {
        const def = MODULE_DEFINITIONS.find((d) => d.id === m.id);
        if (def && def.enabled !== m.enabled) {
          overrides[m.id] = m.enabled;
        }
      }
      saveToggles(overrides);
      return updated;
    });
  }, []);

  const isEnabled = useCallback(
    (id: string) => modules.find((m) => m.id === id)?.enabled ?? false,
    [modules],
  );

  return { modules, toggleModule, isEnabled };
}

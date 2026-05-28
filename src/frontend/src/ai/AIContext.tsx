import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type {
  CareModule,
  CareReliabilityData,
  DigitalBrainState,
  EmotionalWellnessData,
  FamilyMember,
  HealthMemoryEntry,
  HealthPrediction,
  MoodAdaptiveState,
} from "./types";
import { useCareReliabilityIndex } from "./useCareReliabilityIndex";
import { useHealthPredictions } from "./useHealthPredictions";
import { useHealthcareModules } from "./useHealthcareModules";
import { useMoodAdaptive } from "./useMoodAdaptive";

// ─── Healthcare Living Insight ────────────────────────────────────────────────

const HEALTHCARE_INSIGHTS = [
  "Your sleep consistency is key to reducing stress levels this week",
  "Staying hydrated can improve your focus and reduce headache risk by up to 40%",
  "Regular medication timing helps your body maintain optimal therapeutic levels",
  "A 10-minute walk can reduce anxiety by 20% — consider stepping outside today",
  "Your body recovers best between 10 PM and 2 AM — prioritize sleep in this window",
  "Deep breathing for 5 minutes activates your parasympathetic nervous system",
  "Consistent meal timing regulates metabolism and supports medication effectiveness",
  "Your healthcare consistency has been improving — keep up the momentum",
];

function pickLivingInsight(): string {
  try {
    const cached = localStorage.getItem("ai_living_insight");
    if (cached) {
      const { text, timestamp } = JSON.parse(cached) as {
        text: string;
        timestamp: number;
      };
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) return text;
    }
  } catch {
    /* ignore */
  }
  const text =
    HEALTHCARE_INSIGHTS[Math.floor(Math.random() * HEALTHCARE_INSIGHTS.length)];
  try {
    localStorage.setItem(
      "ai_living_insight",
      JSON.stringify({ text, timestamp: Date.now() }),
    );
  } catch {
    /* ignore */
  }
  return text;
}

// ─── Default States ───────────────────────────────────────────────────────────

const defaultDigitalBrain: DigitalBrainState = {
  cognitiveProfile: {
    primaryHealthFocus: "Preventive Care",
    engagementStyle: "Consistent",
    riskAwareness: "moderate",
    careConsistency: 72,
  },
  behaviorInsights: [
    { label: "Health check time", value: "Morning", icon: "🌅" },
    { label: "Appointment booking", value: "Mid-week", icon: "📅" },
    { label: "Medication consistency", value: "Weekdays", icon: "💊" },
  ],
  coordinationLog: [
    {
      module: "Predictive Care Engine",
      action: "Synced",
      timestamp: Date.now() - 300000,
      icon: "🔮",
    },
    {
      module: "AI Health Memory",
      action: "Updated",
      timestamp: Date.now() - 600000,
      icon: "🧠",
    },
    {
      module: "Mood Adaptive",
      action: "Calibrated",
      timestamp: Date.now() - 900000,
      icon: "🎯",
    },
  ],
  totalInteractions: 0,
  activeSince: new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }),
  intelligenceLevel: 42,
};

const defaultEmotionalWellness: EmotionalWellnessData = {
  enabled: false,
  currentState: "neutral",
  stressLevel: 30,
  wellnessScore: 72,
  trend: "stable",
  privacyNote:
    "Emotional wellness tracking is optional and privacy-first. Your data never leaves this device.",
};

// ─── Context Type ─────────────────────────────────────────────────────────────

interface AIContextType {
  // Healthcare Predictions
  healthPredictions: HealthPrediction[];
  refreshPredictions: () => void;
  // Care Reliability Index
  careReliabilityIndex: CareReliabilityData;
  // Mood Adaptive
  moodAdaptive: MoodAdaptiveState;
  // Health Memory
  healthMemory: HealthMemoryEntry[];
  addHealthMemory: (entry: Omit<HealthMemoryEntry, "id" | "timestamp">) => void;
  // Family Guardian
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  // Care Modules Marketplace
  careModules: CareModule[];
  toggleCareModule: (id: string) => void;
  isCareModuleEnabled: (id: string) => boolean;
  // Digital Brain
  digitalBrain: DigitalBrainState;
  // Emotional Wellness (opt-in)
  emotionalWellness: EmotionalWellnessData;
  toggleEmotionalWellness: () => void;
  // Living Insight
  livingInsight: string;
  // Focus Mode
  focusModeActive: boolean;
  toggleFocusMode: () => void;
  // Navigation tracking
  trackNavigation: (path: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AIContext = createContext<AIContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AIProvider({ children }: { children: ReactNode }) {
  const { predictions, refresh: refreshPredictions } = useHealthPredictions();
  const careReliabilityRaw = useCareReliabilityIndex();
  const moodAdaptive = useMoodAdaptive();
  const {
    modules,
    toggleModule,
    isEnabled: isCareModuleEnabled,
  } = useHealthcareModules();

  // Build CareReliabilityData from the spread return
  const careReliabilityData: CareReliabilityData = {
    medicationAdherence: careReliabilityRaw.medicationAdherence,
    appointmentAttendance: careReliabilityRaw.appointmentAttendance,
    healthyHabits: careReliabilityRaw.healthyHabits,
    routineConsistency: careReliabilityRaw.routineConsistency,
    overallScore: careReliabilityRaw.overallScore,
    trend: careReliabilityRaw.trend,
    weeklyData: careReliabilityRaw.weeklyData,
    supportiveInsight: careReliabilityRaw.supportiveInsight,
  };

  const [healthMemory, setHealthMemory] = useState<HealthMemoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ai_health_memory") || "[]");
    } catch {
      return [];
    }
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ai_family_members") || "[]");
    } catch {
      return [];
    }
  });

  const [emotionalWellness, setEmotionalWellness] =
    useState<EmotionalWellnessData>(() => {
      try {
        const saved = localStorage.getItem("ai_emotional_wellness");
        return saved
          ? { ...defaultEmotionalWellness, ...JSON.parse(saved) }
          : defaultEmotionalWellness;
      } catch {
        return defaultEmotionalWellness;
      }
    });

  const [focusModeActive, setFocusModeActive] = useState(() => {
    try {
      return localStorage.getItem("focus_mode") === "true";
    } catch {
      return false;
    }
  });

  const [livingInsight] = useState<string>(() => pickLivingInsight());
  const [digitalBrain] = useState<DigitalBrainState>(defaultDigitalBrain);

  const toggleFocusMode = useCallback(() => {
    setFocusModeActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("focus_mode", String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const addHealthMemory = useCallback(
    (entry: Omit<HealthMemoryEntry, "id" | "timestamp">) => {
      const newEntry: HealthMemoryEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      setHealthMemory((prev) => {
        const updated = [newEntry, ...prev].slice(0, 50);
        try {
          localStorage.setItem("ai_health_memory", JSON.stringify(updated));
        } catch {
          /* ignore */
        }
        return updated;
      });
    },
    [],
  );

  const addFamilyMember = useCallback((member: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = { ...member, id: Date.now().toString() };
    setFamilyMembers((prev) => {
      const updated = [...prev, newMember];
      try {
        localStorage.setItem("ai_family_members", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const toggleEmotionalWellness = useCallback(() => {
    setEmotionalWellness((prev) => {
      const updated: EmotionalWellnessData = {
        ...prev,
        enabled: !prev.enabled,
      };
      try {
        localStorage.setItem("ai_emotional_wellness", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  }, []);

  const trackNavigation = useCallback((_path: string) => {
    // Navigation tracking for mood adaptation — path context
  }, []);

  const value: AIContextType = {
    healthPredictions: predictions,
    refreshPredictions,
    careReliabilityIndex: careReliabilityData,
    moodAdaptive,
    healthMemory,
    familyMembers,
    careModules: modules,
    toggleCareModule: toggleModule,
    isCareModuleEnabled,
    digitalBrain,
    emotionalWellness,
    livingInsight,
    focusModeActive,
    toggleFocusMode,
    addHealthMemory,
    addFamilyMember,
    toggleEmotionalWellness,
    trackNavigation,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAI(): AIContextType {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used inside AIProvider");
  return ctx;
}

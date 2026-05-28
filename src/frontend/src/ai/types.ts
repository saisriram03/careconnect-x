// ─── Healthcare Prediction Types ─────────────────────────────────────────────
export type PredictionSeverity = "low" | "medium" | "high" | "critical";

export interface HealthPrediction {
  id: string;
  type:
    | "burnoutRisk"
    | "stressSpikeRisk"
    | "sleepDeclineRisk"
    | "medicationAdherenceRisk"
    | "emergencyRisk";
  title: string;
  confidence: number; // 0-100
  severity: PredictionSeverity;
  explanation: string;
  preventiveAction: string;
  icon: string;
  updatedAt: number;
  noDataState: boolean;
}

// ─── Prediction Input (from backend / Dashboard localStorage) ─────────────────
export interface PredictionInput {
  hr_latest?: number;
  systolic_latest?: number;
  diastolic_latest?: number;
  sleep_latest?: number;
  hr_avg_7d?: number;
  systolic_avg_7d?: number;
  diastolic_avg_7d?: number;
  sleep_avg_7d?: number;
  hr_avg_14d?: number;
  systolic_avg_14d?: number;
  diastolic_avg_14d?: number;
  sleep_avg_14d?: number;
  consecutive_low_sleep_nights: bigint;
}

// ─── Care Reliability Index ───────────────────────────────────────────────────
export type ReliabilityTrend = "improving" | "stable" | "declining";

export interface CareReliabilityDay {
  date: string; // e.g. "Mon"
  score: number; // 0-100
}

export interface CareReliabilityData {
  medicationAdherence: number; // 0-100
  appointmentAttendance: number; // 0-100
  healthyHabits: number; // 0-100
  routineConsistency: number; // 0-100
  overallScore: number; // weighted average
  trend: ReliabilityTrend;
  weeklyData: CareReliabilityDay[]; // 7 days
  supportiveInsight: string;
}

// ─── Health Memory ────────────────────────────────────────────────────────────
export type HealthMemoryCategory =
  | "symptom"
  | "medication"
  | "routine"
  | "stress"
  | "doctor"
  | "sleep";

export interface HealthMemoryEntry {
  id: string;
  category: HealthMemoryCategory;
  title: string;
  detail: string;
  timestamp: number;
  icon: string;
}

// ─── Family Member ────────────────────────────────────────────────────────────
export type FamilyMemberRole =
  | "parent"
  | "child"
  | "spouse"
  | "sibling"
  | "other";

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: FamilyMemberRole;
  avatarInitials: string;
  lastChecked: string; // ISO date
  healthStatus: "stable" | "needs_attention" | "critical";
  medicationsDue: number;
}

// ─── Recovery Progress ────────────────────────────────────────────────────────
export interface RecoveryMilestone {
  label: string;
  achieved: boolean;
  date?: string;
}

export interface RecoveryProgress {
  condition: string;
  startDate: string;
  targetDate: string;
  progressPercent: number; // 0-100
  milestones: RecoveryMilestone[];
  doctorNote: string;
  trend: "improving" | "stable" | "regressing";
}

// ─── Emotional Wellness ───────────────────────────────────────────────────────
export type EmotionalState =
  | "calm"
  | "stressed"
  | "anxious"
  | "positive"
  | "neutral";

export interface EmotionalWellnessData {
  enabled: boolean; // privacy-first: opt-in only
  currentState: EmotionalState;
  stressLevel: number; // 0-100
  wellnessScore: number; // 0-100
  trend: "improving" | "stable" | "declining";
  privacyNote: string;
}

// ─── Voice Assistant ──────────────────────────────────────────────────────────
export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  lastCommand: string | null;
  lastResponse: string | null;
  supportedCommands: string[];
}

// ─── Care Module (Marketplace) ────────────────────────────────────────────────
export type CareModuleCategory =
  | "elderly"
  | "maternal"
  | "mental"
  | "chronic"
  | "nutrition"
  | "fitness";

export interface CareModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: CareModuleCategory;
  features: string[];
}

// ─── Digital Brain ────────────────────────────────────────────────────────────
export interface BehaviorInsight {
  label: string;
  value: string;
  icon: string;
}

export interface CoordinationLogEntry {
  module: string;
  action: string;
  timestamp: number;
  icon: string;
}

export interface DigitalBrainState {
  cognitiveProfile: {
    primaryHealthFocus: string;
    engagementStyle: string;
    riskAwareness: "low" | "moderate" | "high";
    careConsistency: number; // 0-100
  };
  behaviorInsights: BehaviorInsight[];
  coordinationLog: CoordinationLogEntry[];
  totalInteractions: number;
  activeSince: string;
  intelligenceLevel: number; // 0-100, grows over time
}

// ─── Mood Adaptive ────────────────────────────────────────────────────────────
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
export type UIThemeVariant = "calm" | "focused" | "energetic" | "night";

export interface MoodAdaptiveState {
  timeOfDay: TimeOfDay;
  stressLevel: number; // 0-100
  themeVariant: UIThemeVariant;
  colorIntensity: "bright" | "balanced" | "calm" | "minimal";
  animationSpeed: "fast" | "normal" | "slow";
  layoutDensity: "expanded" | "standard" | "compact";
  greeting: string;
  wellnessState: "well" | "moderate" | "stressed";
}

// ─── AI Hub State ─────────────────────────────────────────────────────────────
export interface AIHubState {
  healthPredictions: HealthPrediction[];
  careReliability: CareReliabilityData;
  healthMemory: HealthMemoryEntry[];
  familyMembers: FamilyMember[];
  careModules: CareModule[];
  digitalBrain: DigitalBrainState;
  emotionalWellness: EmotionalWellnessData;
  moodAdaptive: MoodAdaptiveState;
  livingInsight: string;
  focusModeActive: boolean;
}

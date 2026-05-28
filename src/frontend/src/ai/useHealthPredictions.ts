import { useCallback, useEffect, useState } from "react";
import type {
  HealthPrediction,
  PredictionInput,
  PredictionSeverity,
} from "./types";

const STORAGE_KEY = "ccx_health_predictions";
const HEALTH_INPUT_KEY = "careconnect_health_latest";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface PredictionCache {
  predictions: HealthPrediction[];
  generatedAt: number;
  inputHash: string; // fingerprint of PredictionInput to detect changes
}

function getSeverity(confidence: number): PredictionSeverity {
  if (confidence >= 75) return "critical";
  if (confidence >= 55) return "high";
  if (confidence >= 35) return "medium";
  return "low";
}

function readPredictionInput(): PredictionInput | null {
  try {
    const raw = localStorage.getItem(HEALTH_INPUT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PredictionInput;
    // Deserialize bigint stored as string/number
    if (typeof parsed.consecutive_low_sleep_nights !== "bigint") {
      parsed.consecutive_low_sleep_nights = BigInt(
        parsed.consecutive_low_sleep_nights ?? 0,
      );
    }
    return parsed;
  } catch {
    return null;
  }
}

function inputHash(input: PredictionInput | null): string {
  if (!input) return "";
  return JSON.stringify({
    hr: input.hr_latest,
    sys: input.systolic_latest,
    dia: input.diastolic_latest,
    sl: input.sleep_latest,
    cln: String(input.consecutive_low_sleep_nights),
    hr7: input.hr_avg_7d,
    sys7: input.systolic_avg_7d,
    sl7: input.sleep_avg_7d,
    hr14: input.hr_avg_14d,
    sys14: input.systolic_avg_14d,
    sl14: input.sleep_avg_14d,
  });
}

const NO_DATA_PREDICTIONS: HealthPrediction[] = [
  {
    id: "burnout_risk",
    type: "burnoutRisk",
    title: "Burnout Risk",
    confidence: 0,
    severity: "low",
    explanation:
      "No data — connect your phone or enter your metrics to get predictions.",
    preventiveAction:
      "Enter your heart rate, blood pressure, and sleep hours on the Dashboard.",
    icon: "🔥",
    updatedAt: 0,
    noDataState: true,
  },
  {
    id: "stress_spike_risk",
    type: "stressSpikeRisk",
    title: "Stress Spike Risk",
    confidence: 0,
    severity: "low",
    explanation:
      "No data — connect your phone or enter your metrics to get predictions.",
    preventiveAction:
      "Enter your heart rate and blood pressure on the Dashboard.",
    icon: "⚡",
    updatedAt: 0,
    noDataState: true,
  },
  {
    id: "sleep_decline_risk",
    type: "sleepDeclineRisk",
    title: "Sleep Decline Risk",
    confidence: 0,
    severity: "low",
    explanation:
      "No data — connect your phone or enter your metrics to get predictions.",
    preventiveAction:
      "Log your sleep hours on the Dashboard to enable this prediction.",
    icon: "😴",
    updatedAt: 0,
    noDataState: true,
  },
  {
    id: "medication_adherence_risk",
    type: "medicationAdherenceRisk",
    title: "Medication Adherence Risk",
    confidence: 0,
    severity: "low",
    explanation:
      "No data — connect your phone or enter your metrics to get predictions.",
    preventiveAction:
      "Connect health data via Bluetooth or enter metrics manually on the Dashboard.",
    icon: "💊",
    updatedAt: 0,
    noDataState: true,
  },
  {
    id: "emergency_risk",
    type: "emergencyRisk",
    title: "Emergency Risk",
    confidence: 0,
    severity: "low",
    explanation:
      "No data — connect your phone or enter your metrics to get predictions.",
    preventiveAction: "Enter your blood pressure readings on the Dashboard.",
    icon: "🚨",
    updatedAt: 0,
    noDataState: true,
  },
];

function calcStressConfidence(input: PredictionInput): {
  confidence: number;
  detail: string;
} {
  const hr = input.hr_latest;
  const sys = input.systolic_latest;
  const hr7 = input.hr_avg_7d;
  let confidence = 0;
  const parts: string[] = [];

  if (hr !== undefined) {
    if (hr >= 120) {
      confidence = Math.max(confidence, 80);
      parts.push(`Heart rate at ${hr} bpm (critically elevated)`);
    } else if (hr >= 101) {
      confidence = Math.max(confidence, 58);
      parts.push(`Heart rate at ${hr} bpm (moderately elevated)`);
    } else if (hr > 95) {
      confidence = Math.max(confidence, 40);
      parts.push(`Heart rate at ${hr} bpm (slightly elevated)`);
    }
  }
  if (sys !== undefined) {
    if (sys >= 160) {
      confidence = Math.max(confidence, 85);
      parts.push(`Systolic blood pressure at ${sys} mmHg (high)`);
    } else if (sys >= 140) {
      confidence = Math.max(confidence, 62);
      parts.push(`Systolic blood pressure at ${sys} mmHg (elevated)`);
    }
  }
  if (hr7 !== undefined && hr7 > 95) {
    confidence = Math.max(confidence, 50);
    parts.push(`7-day average heart rate at ${hr7} bpm (elevated baseline)`);
  }

  const detail =
    parts.length > 0
      ? parts.join(". ")
      : "All heart rate and blood pressure readings are within normal range.";
  return { confidence: Math.min(confidence, 100), detail };
}

function calcSleepDeclineConfidence(input: PredictionInput): {
  confidence: number;
  detail: string;
} {
  const nights = Number(input.consecutive_low_sleep_nights ?? 0);
  const sleepLatest = input.sleep_latest;
  let confidence = 0;
  const parts: string[] = [];

  if (nights >= 6) {
    confidence = Math.max(confidence, 82);
    parts.push(`${nights} consecutive nights of poor sleep (below 6 hours)`);
  } else if (nights >= 3) {
    confidence = Math.max(confidence, 58);
    parts.push(`${nights} consecutive nights of poor sleep (below 6 hours)`);
  } else if (nights >= 1) {
    confidence = Math.max(confidence, 30);
    parts.push(`${nights} recent night(s) of poor sleep`);
  }

  if (sleepLatest !== undefined && sleepLatest < 6) {
    confidence = Math.max(confidence, 45);
    parts.push(`Last recorded sleep was ${sleepLatest.toFixed(1)} hours`);
  }

  const detail =
    parts.length > 0
      ? parts.join(". ")
      : "Sleep patterns look healthy with no consecutive low-sleep nights detected.";
  return { confidence: Math.min(confidence, 100), detail };
}

function calcHealthDeteriorationConfidence(input: PredictionInput): {
  confidence: number;
  detail: string;
} {
  const hr7 = input.hr_avg_7d;
  const hr14 = input.hr_avg_14d;
  const sys7 = input.systolic_avg_7d;
  const sys14 = input.systolic_avg_14d;
  const sl7 = input.sleep_avg_7d;
  const sl14 = input.sleep_avg_14d;
  let confidence = 0;
  const parts: string[] = [];

  if (hr7 !== undefined && hr14 !== undefined && hr14 > 0) {
    if (hr7 > hr14 * 1.15) {
      confidence = Math.max(confidence, 65);
      parts.push(
        `Heart rate worsened by ${Math.round((hr7 / hr14 - 1) * 100)}% over 7 days (avg ${hr7} vs ${hr14} bpm)`,
      );
    }
  }
  if (sys7 !== undefined && sys14 !== undefined && sys14 > 0) {
    if (sys7 > sys14 * 1.15) {
      confidence = Math.max(confidence, 70);
      parts.push(
        `Systolic BP worsened by ${Math.round((sys7 / sys14 - 1) * 100)}% over 7 days (avg ${sys7} vs ${sys14} mmHg)`,
      );
    }
  }
  if (sl7 !== undefined && sl14 !== undefined && sl14 > 0) {
    if (sl7 < sl14 * 0.85) {
      confidence = Math.max(confidence, 60);
      parts.push(
        `Sleep declined by ${Math.round((1 - sl7 / sl14) * 100)}% over 7 days (avg ${sl7.toFixed(1)} vs ${sl14.toFixed(1)} hours)`,
      );
    }
  }

  const detail =
    parts.length > 0
      ? parts.join(". ")
      : "No significant health deterioration trend detected over the past two weeks.";
  return { confidence: Math.min(confidence, 100), detail };
}

function generateHealthPredictions(input: PredictionInput): HealthPrediction[] {
  const now = Date.now();

  const stress = calcStressConfidence(input);
  const sleep = calcSleepDeclineConfidence(input);
  const deterioration = calcHealthDeteriorationConfidence(input);

  // Burnout = combined stress + sleep signal
  const burnoutConfidence =
    stress.confidence > 50 && sleep.confidence > 50
      ? Math.round((stress.confidence + sleep.confidence) / 2)
      : Math.max(stress.confidence, sleep.confidence) > 70
        ? 40
        : 15;
  const burnoutDetail =
    stress.confidence > 0 || sleep.confidence > 0
      ? `Combined signal: ${stress.detail}. ${sleep.detail}`
      : "No burnout indicators detected. Keep maintaining your current health routines.";

  // Emergency = only from systolic >= 160 OR diastolic >= 100
  const sys = input.systolic_latest;
  const dia = input.diastolic_latest;
  let emergencyConfidence = 0;
  let emergencyDetail =
    "No emergency risk indicators detected. Your vital signs are stable.";
  let emergencyAction =
    "Stay prepared by keeping Emergency contacts current in the Emergency section.";
  if ((sys !== undefined && sys >= 160) || (dia !== undefined && dia >= 100)) {
    emergencyConfidence = 90;
    const sysStr = sys !== undefined ? `Systolic ${sys} mmHg` : "";
    const diaStr = dia !== undefined ? `Diastolic ${dia} mmHg` : "";
    emergencyDetail = `Critical blood pressure reading detected: ${[sysStr, diaStr].filter(Boolean).join(", ")}. Seek medical attention immediately.`;
    emergencyAction =
      "Call emergency services or go to the nearest hospital. Do not exercise or exert yourself.";
  }

  // Medication adherence uses deterioration + sleep signal as proxy (no direct med data)
  const medConfidence = Math.round(
    (deterioration.confidence * 0.6 + sleep.confidence * 0.4) * 0.7,
  );
  const medDetail =
    deterioration.confidence > 30
      ? `Trend analysis suggests possible routine inconsistency. ${deterioration.detail}`
      : "Medication adherence signals look stable based on current health trends.";

  return [
    {
      id: "burnout_risk",
      type: "burnoutRisk",
      title: "Burnout Risk",
      confidence: burnoutConfidence,
      severity: getSeverity(burnoutConfidence),
      explanation: burnoutDetail,
      preventiveAction:
        burnoutConfidence >= 50
          ? "Schedule consistent sleep times and take short breaks during high-stress periods. Limit screen time after 10 PM."
          : "Maintain your current activity balance. Short breaks throughout the day help prevent long-term burnout.",
      icon: "🔥",
      updatedAt: now,
      noDataState: false,
    },
    {
      id: "stress_spike_risk",
      type: "stressSpikeRisk",
      title: "Stress Spike Risk",
      confidence: stress.confidence,
      severity: getSeverity(stress.confidence),
      explanation:
        stress.confidence > 0
          ? stress.detail
          : "Stress indicators are within healthy range. Keep up your balanced routine.",
      preventiveAction:
        stress.confidence >= 55
          ? "Take a 5-minute breathing exercise. Rest and hydration can lower elevated heart rate."
          : "Continue your current habits. Mindfulness check-ins are recommended weekly.",
      icon: "⚡",
      updatedAt: now,
      noDataState: false,
    },
    {
      id: "sleep_decline_risk",
      type: "sleepDeclineRisk",
      title: "Sleep Decline Risk",
      confidence: sleep.confidence,
      severity: getSeverity(sleep.confidence),
      explanation:
        sleep.confidence > 0
          ? sleep.detail
          : "Sleep patterns look healthy. No concerning signals detected.",
      preventiveAction:
        sleep.confidence >= 40
          ? "Aim for consistent bedtime before 11 PM. Avoid screens 1 hour before sleep and aim for 7-9 hours nightly."
          : "Log your sleep hours in the Dashboard to keep your health score accurate.",
      icon: "😴",
      updatedAt: now,
      noDataState: false,
    },
    {
      id: "medication_adherence_risk",
      type: "medicationAdherenceRisk",
      title: "Medication Adherence Risk",
      confidence: medConfidence,
      severity: getSeverity(medConfidence),
      explanation: medDetail,
      preventiveAction:
        medConfidence >= 35
          ? "Enable daily medication reminders in Settings. Link your prescriptions in Medical Records."
          : "Great consistency. Keep logging your medications in the app to maintain this trend.",
      icon: "💊",
      updatedAt: now,
      noDataState: false,
    },
    {
      id: "emergency_risk",
      type: "emergencyRisk",
      title: "Emergency Risk",
      confidence: emergencyConfidence,
      severity: getSeverity(emergencyConfidence),
      explanation: emergencyDetail,
      preventiveAction: emergencyAction,
      icon: "🚨",
      updatedAt: now,
      noDataState: false,
    },
  ];
}

function loadCache(currentHash: string): HealthPrediction[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cache: PredictionCache = JSON.parse(raw);
    // Invalidate if input changed or TTL expired
    if (cache.inputHash !== currentHash) return null;
    if (Date.now() - cache.generatedAt >= CACHE_TTL_MS) return null;
    return cache.predictions;
  } catch {
    return null;
  }
}

function saveCache(predictions: HealthPrediction[], hash: string): void {
  try {
    const cache: PredictionCache = {
      predictions,
      generatedAt: Date.now(),
      inputHash: hash,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

function computePredictions(): {
  predictions: HealthPrediction[];
  hasRealData: boolean;
} {
  const input = readPredictionInput();
  if (!input) {
    return { predictions: NO_DATA_PREDICTIONS, hasRealData: false };
  }
  const hash = inputHash(input);
  const cached = loadCache(hash);
  if (cached) return { predictions: cached, hasRealData: true };
  const fresh = generateHealthPredictions(input);
  saveCache(fresh, hash);
  return { predictions: fresh, hasRealData: true };
}

export function useHealthPredictions() {
  const [state, setState] = useState<{
    predictions: HealthPrediction[];
    hasRealData: boolean;
  }>(() => computePredictions());

  const refresh = useCallback(() => {
    setState(computePredictions());
  }, []);

  // Subscribe to localStorage changes (cross-tab and same-tab via custom event)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === HEALTH_INPUT_KEY || e.key === null) {
        setState(computePredictions());
      }
    };
    // Also listen for same-tab updates dispatched by Dashboard
    const onLocalUpdate = () => setState(computePredictions());
    window.addEventListener("storage", onStorage);
    window.addEventListener("careconnect_health_updated", onLocalUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("careconnect_health_updated", onLocalUpdate);
    };
  }, []);

  return {
    predictions: state.predictions,
    hasRealData: state.hasRealData,
    refresh,
  };
}

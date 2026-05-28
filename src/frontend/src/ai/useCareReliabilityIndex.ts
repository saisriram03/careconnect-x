import { useCallback, useState } from "react";
import type {
  CareReliabilityData,
  CareReliabilityDay,
  ReliabilityTrend,
} from "./types";

const STORAGE_KEY = "ccx_care_reliability";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function computeWeeklyData(): CareReliabilityDay[] {
  const today = new Date();
  const days: CareReliabilityDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = DAY_LABELS[d.getDay()];
    // Simulate realistic-looking consistency scores based on day of week
    // Weekdays tend to be more consistent than weekends
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseScore = isWeekend ? 62 : 78;
    const jitter = Math.floor(Math.sin(d.getDate() * 3.7) * 14);
    days.push({
      date: label,
      score: Math.min(98, Math.max(40, baseScore + jitter)),
    });
  }
  return days;
}

function computeReliability(): CareReliabilityData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: CareReliabilityData = JSON.parse(raw);
      // Recompute weekly data to stay fresh
      return { ...saved, weeklyData: computeWeeklyData() };
    }
  } catch {
    // ignore
  }

  // Default realistic first-run values
  const medicationAdherence = 78;
  const appointmentAttendance = 85;
  const healthyHabits = 72;
  const routineConsistency = 68;
  const overallScore = Math.round(
    medicationAdherence * 0.35 +
      appointmentAttendance * 0.25 +
      healthyHabits * 0.2 +
      routineConsistency * 0.2,
  );

  const trend: ReliabilityTrend =
    overallScore >= 75
      ? "improving"
      : overallScore >= 60
        ? "stable"
        : "declining";

  const supportiveInsights: Record<ReliabilityTrend, string> = {
    improving:
      "You're building excellent healthcare habits! Your consistency is protecting your long-term health.",
    stable:
      "Your care routine is steady. Small daily improvements in medication timing can boost your score.",
    declining:
      "Life gets busy — that's okay. Even one healthy habit today can restart positive momentum.",
  };

  return {
    medicationAdherence,
    appointmentAttendance,
    healthyHabits,
    routineConsistency,
    overallScore,
    trend,
    weeklyData: computeWeeklyData(),
    supportiveInsight: supportiveInsights[trend],
  };
}

export function useCareReliabilityIndex() {
  const [data, setData] = useState<CareReliabilityData>(computeReliability);

  const updateMetric = useCallback(
    (
      metric: keyof Pick<
        CareReliabilityData,
        | "medicationAdherence"
        | "appointmentAttendance"
        | "healthyHabits"
        | "routineConsistency"
      >,
      value: number,
    ) => {
      setData((prev) => {
        const next = { ...prev, [metric]: Math.min(100, Math.max(0, value)) };
        next.overallScore = Math.round(
          next.medicationAdherence * 0.35 +
            next.appointmentAttendance * 0.25 +
            next.healthyHabits * 0.2 +
            next.routineConsistency * 0.2,
        );
        next.trend =
          next.overallScore >= 75
            ? "improving"
            : next.overallScore >= 60
              ? "stable"
              : "declining";
        next.weeklyData = computeWeeklyData();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  return { ...data, updateMetric };
}

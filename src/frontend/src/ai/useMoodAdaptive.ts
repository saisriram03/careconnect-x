import { useMemo } from "react";
import type { MoodAdaptiveState, TimeOfDay, UIThemeVariant } from "./types";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getThemeVariant(
  timeOfDay: TimeOfDay,
  stressLevel: number,
): UIThemeVariant {
  if (stressLevel >= 70) return "calm"; // calm down during stress
  if (timeOfDay === "night") return "night";
  if (timeOfDay === "morning") return "energetic";
  if (timeOfDay === "afternoon") return "focused";
  return "calm"; // evening
}

export function useMoodAdaptive(stressLevel = 30): MoodAdaptiveState {
  return useMemo((): MoodAdaptiveState => {
    const timeOfDay = getTimeOfDay();
    const wellnessState =
      stressLevel >= 65 ? "stressed" : stressLevel >= 35 ? "moderate" : "well";
    const themeVariant = getThemeVariant(timeOfDay, stressLevel);

    const colorIntensityMap: Record<
      UIThemeVariant,
      MoodAdaptiveState["colorIntensity"]
    > = {
      energetic: "bright",
      focused: "balanced",
      calm: "calm",
      night: "minimal",
    };

    const animationSpeedMap: Record<
      MoodAdaptiveState["wellnessState"],
      MoodAdaptiveState["animationSpeed"]
    > = {
      well: timeOfDay === "morning" ? "fast" : "normal",
      moderate: "normal",
      stressed: "slow",
    };

    const layoutDensityMap: Record<
      MoodAdaptiveState["wellnessState"],
      MoodAdaptiveState["layoutDensity"]
    > = {
      well: "standard",
      moderate: "standard",
      stressed: "compact",
    };

    const greetings: Record<TimeOfDay, string> = {
      morning: "Good morning! Ready for a healthy day? ☀️",
      afternoon: "Good afternoon! How are you feeling today? 🌤️",
      evening: "Good evening! Time to wind down. 🌆",
      night: "Still awake? Your health matters — rest when you can. 🌙",
    };

    return {
      timeOfDay,
      stressLevel,
      themeVariant,
      colorIntensity: colorIntensityMap[themeVariant],
      animationSpeed: animationSpeedMap[wellnessState],
      layoutDensity: layoutDensityMap[wellnessState],
      greeting: greetings[timeOfDay],
      wellnessState,
    };
  }, [stressLevel]);
}

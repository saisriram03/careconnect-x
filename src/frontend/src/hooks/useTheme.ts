import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.classList.add("light-mode");
  } else {
    document.documentElement.classList.remove("light-mode");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("careconnect-theme") as Theme | null;
    const initial = stored || "dark";
    // Apply immediately on init to avoid flash
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("careconnect-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

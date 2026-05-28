import { useCallback } from "react";

export function useRipple() {
  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-effect");

    const existing = button.querySelector(".ripple-effect");
    if (existing) existing.remove();

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
  }, []);

  return { createRipple };
}

import type { ReactNode } from "react";

type GlowColor = "teal" | "blue" | "green" | "red" | "none";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  onClick?: () => void;
  hover?: boolean;
  style?: React.CSSProperties;
  "data-ocid"?: string;
}

const glowMap: Record<GlowColor, string> = {
  teal: "glow-teal",
  blue: "glow-blue",
  green: "glow-green",
  red: "glow-red",
  none: "",
};

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
  onClick,
  hover = false,
  style,
  "data-ocid": dataOcid,
}: GlassCardProps) {
  const isInteractive = !!onClick;
  return (
    <div
      className={`glass-card ${
        glowColor !== "none" ? glowMap[glowColor] : ""
      } ${
        hover
          ? "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
          : ""
      } ${isInteractive ? "cursor-pointer" : ""} ${className}`}
      style={style}
      data-ocid={dataOcid}
      onClick={onClick}
      onKeyDown={
        isInteractive ? (e) => e.key === "Enter" && onClick?.() : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { useRipple } from "../../hooks/useRipple";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "teal";

interface RippleButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "data-ocid"?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#38E6D0] to-[#43E7A2] text-[#0B1320] font-semibold hover:shadow-lg hover:shadow-teal-500/30",
  secondary:
    "bg-transparent border border-[rgba(160,190,210,0.3)] text-[#A9B3C3] hover:border-[#38E6D0] hover:text-[#38E6D0]",
  danger:
    "bg-[#3B1A1F] border border-[#FF4D5A] text-[#FF4D5A] hover:bg-[#FF4D5A] hover:text-white",
  ghost:
    "bg-transparent text-[#A9B3C3] hover:text-[#38E6D0] hover:bg-[rgba(56,230,208,0.08)]",
  teal: "bg-[rgba(56,230,208,0.15)] border border-[rgba(56,230,208,0.4)] text-[#38E6D0] hover:bg-[rgba(56,230,208,0.25)]",
};

export default function RippleButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  "data-ocid": dataOcid,
}: RippleButtonProps) {
  const { createRipple } = useRipple();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      data-ocid={dataOcid}
      onClick={handleClick}
      className={`ripple-container px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        variantStyles[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}

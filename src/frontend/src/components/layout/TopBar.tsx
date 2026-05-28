import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Calendar, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAI } from "../../ai/AIContext";
import { useTheme } from "../../hooks/useTheme";
import NotificationDropdown from "../ui/NotificationDropdown";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/symptoms": "AI Symptom Checker",
  "/doctors": "Find & Book Doctors",
  "/costs": "Cost Comparison",
  "/community": "Community Health Network",
  "/emergency": "Emergency",
  "/records": "Medical Records",
};

function FocusIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ color: active ? "#f9a8c9" : "inherit" }}
    >
      <circle
        cx="9"
        cy="9"
        r="3"
        fill={active ? "#f9a8c9" : "currentColor"}
        opacity={active ? 1 : 0.7}
      />
      <path
        d="M9 1v3M9 14v3M1 9h3M14 9h3"
        stroke={active ? "#f9a8c9" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="9"
        r="6"
        stroke={active ? "#f9a8c9" : "currentColor"}
        strokeWidth="1.2"
        opacity={active ? 0.6 : 0.4}
      />
    </svg>
  );
}

export default function TopBar() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { focusModeActive, toggleFocusMode } = useAI();
  const pathname = routerState.location.pathname;
  const title = pageTitles[pathname] || "CareConnect X";

  const [aiStatus, setAiStatus] = useState<"online" | "processing" | "offline">(
    "online",
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAiStatus((prev) => {
        if (prev === "online") return "processing";
        if (prev === "processing") return "online";
        return "online";
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const userName = localStorage.getItem("ccx_user_name") || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const aiStatusConfig = {
    online: {
      dotColor: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      text: "AI Online",
      textColor: "#22c55e",
    },
    processing: {
      dotColor: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
      text: "AI Thinking",
      textColor: "#f59e0b",
    },
    offline: {
      dotColor: "#9ca3af",
      bg: "rgba(156,163,175,0.12)",
      text: "AI Offline",
      textColor: "#9ca3af",
    },
  };
  const cfg = aiStatusConfig[aiStatus];

  return (
    <header
      className="flex items-center gap-4 px-6 flex-shrink-0"
      style={{
        background:
          theme === "light" ? "rgba(239,246,255,0.95)" : "rgba(8, 8, 8, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom:
          theme === "light"
            ? "1px solid rgba(96,165,250,0.25)"
            : "1px solid rgba(255,255,255,0.08)",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.875rem)",
        paddingBottom: "0.875rem",
        minHeight: "64px",
      }}
    >
      <h1
        className="text-lg font-bold flex-1"
        style={{ color: theme === "light" ? "#1e3a5f" : "#ffffff" }}
      >
        {title}
      </h1>

      <div className="relative hidden md:flex items-center">
        <Search size={14} className="absolute left-3 text-[#888888]" />
        <input
          data-ocid="topbar.search_input"
          placeholder="Find doctors, services\u2026"
          className="pl-9 pr-4 py-2 rounded-full text-xs outline-none w-52 transition-all"
          style={{
            background:
              theme === "light"
                ? "rgba(96,165,250,0.1)"
                : "rgba(255,255,255,0.06)",
            border:
              theme === "light"
                ? "1px solid rgba(96,165,250,0.3)"
                : "1px solid rgba(255,255,255,0.1)",
            color: theme === "light" ? "#1e3a5f" : "#cccccc",
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Book an Appointment"
          onClick={() => navigate({ to: "/doctors" })}
          title="Book an Appointment"
          className="p-2 rounded-xl hover:text-pink-400 hover:bg-[rgba(249,168,201,0.1)] transition-all"
          style={{
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme === "light" ? "#4a5568" : "#cccccc",
          }}
        >
          <Calendar size={18} />
        </button>
        <NotificationDropdown />

        {/* Focus Mode Toggle */}
        <button
          type="button"
          data-ocid="topbar.focus_mode.toggle"
          onClick={toggleFocusMode}
          title={focusModeActive ? "Exit Focus Mode" : "Enter Focus Mode"}
          aria-label={focusModeActive ? "Exit Focus Mode" : "Enter Focus Mode"}
          className="p-2 rounded-xl transition-all"
          style={{
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: focusModeActive
              ? "rgba(249,168,201,0.15)"
              : "transparent",
            border: focusModeActive
              ? "1px solid rgba(249,168,201,0.3)"
              : "1px solid transparent",
            color: focusModeActive
              ? "#f9a8c9"
              : theme === "light"
                ? "#4a5568"
                : "#cccccc",
          }}
        >
          <FocusIcon active={focusModeActive} />
        </button>

        {/* AI Status Indicator */}
        <div
          data-ocid="topbar.ai_status.indicator"
          className="hidden sm:flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium"
          style={{
            background: cfg.bg,
            color: cfg.textColor,
            border: `1px solid ${cfg.dotColor}33`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: cfg.dotColor,
              boxShadow:
                aiStatus === "processing" ? `0 0 6px ${cfg.dotColor}` : "none",
              animation:
                aiStatus === "processing" ? "pulse 1.5s infinite" : "none",
            }}
          />
          <span className="hidden md:inline">{cfg.text}</span>
        </div>

        <button
          type="button"
          data-ocid="topbar.theme.toggle"
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:text-pink-400 hover:bg-[rgba(249,168,201,0.1)] transition-all"
          style={{
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme === "light" ? "#4a5568" : "#cccccc",
          }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div
        className="flex items-center gap-2.5 pl-3"
        style={{
          borderLeft:
            theme === "light"
              ? "1px solid rgba(96,165,250,0.25)"
              : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-black text-xs font-bold">
            {initials}
          </div>
          <div
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-pink-300"
            style={{
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: theme === "light" ? "#eff6ff" : "#080808",
            }}
          />
        </div>
        <div className="hidden sm:block">
          <p
            className="text-xs font-semibold"
            style={{ color: theme === "light" ? "#1e3a5f" : "#ffffff" }}
          >
            {userName}
          </p>
          <p className="text-[10px] text-pink-400">Online</p>
        </div>
      </div>
    </header>
  );
}

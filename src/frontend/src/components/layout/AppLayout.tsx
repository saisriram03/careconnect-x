import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAI } from "../../ai/AIContext";
import ParticleBackground from "../ParticleBackground";
import FloatingChatbot from "../ui/FloatingChatbot";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { trackNavigation, focusModeActive } = useAI();
  const routerState = useRouterState();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const isDark =
    document.documentElement.classList.contains("dark") ||
    !document.documentElement.classList.contains("light");

  useEffect(() => {
    trackNavigation(routerState.location.pathname);
  }, [routerState.location.pathname, trackNavigation]);

  useEffect(() => {
    if (focusModeActive) {
      setBannerDismissed(false);
    }
  }, [focusModeActive]);

  return (
    <div
      className="flex overflow-hidden bg-app"
      style={{ height: "100dvh", position: "relative" }}
    >
      <ParticleBackground isDarkMode={isDark} mood="normal" />
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className="relative flex flex-col flex-1 min-w-0"
        style={{ zIndex: 1 }}
      >
        <TopBar />

        {/* Focus Mode Banner */}
        {focusModeActive && !bannerDismissed && (
          <div
            className="flex items-center justify-between px-5 py-2 text-xs font-semibold flex-shrink-0"
            style={{
              background: "rgba(249,168,201,0.12)",
              borderBottom: "1px solid rgba(249,168,201,0.25)",
              color: "#f9a8c9",
            }}
          >
            <span>
              ⊙ Focus Mode Active — dashboard is showing only essential
              information
            </span>
            <button
              type="button"
              data-ocid="focus_mode.banner.dismiss_button"
              onClick={() => setBannerDismissed(true)}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity text-[11px]"
              aria-label="Dismiss focus mode banner"
            >
              ✕
            </button>
          </div>
        )}

        <main
          className="flex-1 p-6"
          style={{
            overflowY: "auto",
            WebkitOverflowScrolling:
              "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            ...(focusModeActive
              ? {
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)",
                }
              : {}),
          }}
        >
          <Outlet />
        </main>
        <FloatingChatbot />
      </div>
    </div>
  );
}

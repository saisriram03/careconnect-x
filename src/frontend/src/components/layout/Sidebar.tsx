import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  ChevronLeft,
  ChevronRight,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShoppingBag,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAI } from "../../ai/AIContext";
import { useTheme } from "../../hooks/useTheme";

const flatNavItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    badge: null,
  },
  { icon: Brain, label: "AI Hub", path: "/ai", badge: "AI" },
  {
    icon: Stethoscope,
    label: "Symptom Checker",
    path: "/symptoms",
    badge: null,
  },
  { icon: UserRound, label: "Doctor Booking", path: "/doctors", badge: null },
  { icon: AlertTriangle, label: "Emergency", path: "/emergency", badge: null },
  {
    icon: ShoppingBag,
    label: "Medicine Delivery",
    path: "/medicine",
    badge: null,
  },
  { icon: FileText, label: "Medical Records", path: "/records", badge: null },
  { icon: Users, label: "Community", path: "/community", badge: null },
  { icon: Settings, label: "Settings", path: "/settings", badge: null },
  { icon: Shield, label: "Admin Panel", path: "/admin", badge: null },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme } = useTheme();
  const { focusModeActive } = useAI();

  // Auto-collapse sidebar in focus mode
  const effectiveCollapsed = collapsed || focusModeActive;

  return (
    <aside
      className="flex flex-col transition-all duration-300 flex-shrink-0"
      style={{
        height: "100dvh",
        width: effectiveCollapsed ? 72 : 240,
        background:
          theme === "light"
            ? "linear-gradient(180deg, #e0eeff 0%, #eff6ff 100%)"
            : "linear-gradient(180deg, #080808 0%, #060606 100%)",
        borderRight:
          theme === "light"
            ? "1px solid rgba(96,165,250,0.25)"
            : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="flex items-center gap-3 p-4 h-16"
        style={{
          borderBottom:
            theme === "light"
              ? "1px solid rgba(96,165,250,0.2)"
              : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {theme === "light" ? (
          <img
            src="/assets/generated/careconnect-logo-light-transparent.dim_72x72.png"
            alt="CareConnect X"
            className="w-9 h-9 rounded-xl object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-pink-300 to-pink-400">
            <HeartPulse size={18} className="text-black" />
          </div>
        )}
        {!effectiveCollapsed && (
          <span
            className="text-sm font-bold whitespace-nowrap"
            style={{ color: theme === "light" ? "#1e3a5f" : "#ffffff" }}
          >
            CareConnect <span className="text-pink-400">X</span>
          </span>
        )}
      </div>

      <div className="flex justify-end px-3 pt-3">
        <button
          type="button"
          data-ocid="sidebar.toggle"
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition-all hover:text-pink-400 hover:bg-[rgba(249,168,201,0.1)] ${
            theme === "light" ? "text-[#4a5568]" : "text-[#888888]"
          }`}
          style={{
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {effectiveCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      <nav
        className="flex-1 px-3 py-2 space-y-0.5"
        style={{
          overflowY: "auto",
          WebkitOverflowScrolling:
            "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        }}
      >
        {flatNavItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path === "/ai" && currentPath.startsWith("/ai"));

          return (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "nav-active"
                  : theme === "light"
                    ? "text-[#4a5568] hover:text-[#1e3a5f] hover:bg-[rgba(96,165,250,0.1)]"
                    : "text-[#888888] hover:text-[#cccccc] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
              style={{ minHeight: 44 }}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!effectiveCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap flex-1">
                  {item.label}
                </span>
              )}
              {!effectiveCollapsed && item.badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(249,168,201,0.15)",
                    color: "#f9a8c9",
                    border: "1px solid rgba(249,168,201,0.3)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className="px-3 py-3"
        style={{
          borderTop:
            theme === "light"
              ? "1px solid rgba(96,165,250,0.2)"
              : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          type="button"
          data-ocid="sidebar.logout.button"
          onClick={() => navigate({ to: "/" })}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 ${
            theme === "light"
              ? "text-[#4a5568] hover:text-red-600 hover:bg-red-50"
              : "text-[#888888] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)]"
          }`}
          style={{ minHeight: 44 }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!effectiveCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}

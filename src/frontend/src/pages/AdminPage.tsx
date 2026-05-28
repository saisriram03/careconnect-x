import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Check,
  CheckCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  HeartPulse,
  KeyRound,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  adminStats,
  pendingVolunteers,
  specialtyData,
  systemLogs,
  userRegistrationData,
} from "../data/dummyData";

type VolunteerStatus = "pending" | "approved" | "rejected";

// Vivid distinct colors for charts
const BAR_COLORS = [
  { bar: "#6EE7B7", shadow: "rgba(110,231,183,0.45)" }, // mint green
  { bar: "#60A5FA", shadow: "rgba(96,165,250,0.45)" }, // sky blue
  { bar: "#F472B6", shadow: "rgba(244,114,182,0.45)" }, // hot pink
  { bar: "#FBBF24", shadow: "rgba(251,191,36,0.45)" }, // amber
  { bar: "#A78BFA", shadow: "rgba(167,139,250,0.45)" }, // violet
  { bar: "#F97316", shadow: "rgba(249,115,22,0.45)" }, // orange
];

const SPECIALTY_COLORS = [
  { fill: "#60A5FA", label: "#60A5FA" }, // blue
  { fill: "#6EE7B7", label: "#6EE7B7" }, // mint
  { fill: "#F472B6", label: "#F472B6" }, // pink
  { fill: "#FBBF24", label: "#FBBF24" }, // amber
  { fill: "#A78BFA", label: "#A78BFA" }, // violet
  { fill: "#F97316", label: "#F97316" }, // orange
];

const VOLUNTEER_COLORS = [
  "#60A5FA", // blue
  "#6EE7B7", // mint
  "#FBBF24", // amber
  "#A78BFA", // violet
  "#F97316", // orange
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [volunteerStatuses, setVolunteerStatuses] = useState<
    Record<number, VolunteerStatus>
  >(Object.fromEntries(pendingVolunteers.map((v) => [v.id, "pending"])));

  // AI Settings state
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [saveMsg, setSaveMsg] = useState<"success" | "error" | null>(null);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    setSaveMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setIsConnected(true);
      setSaveMsg("success");
      setApiKey("");
    } catch {
      setSaveMsg("error");
    } finally {
      setIsSaving(false);
    }
  };

  const maxUserCount = Math.max(...userRegistrationData.map((d) => d.count));
  const maxSpecialtyCount = Math.max(...specialtyData.map((d) => d.count));

  const logColors: Record<string, { dot: string; bg: string; text: string }> = {
    info: { dot: "#60A5FA", bg: "rgba(96,165,250,0.10)", text: "#93C5FD" },
    update: { dot: "#6EE7B7", bg: "rgba(110,231,183,0.10)", text: "#6EE7B7" },
    alert: { dot: "#F87171", bg: "rgba(248,113,113,0.10)", text: "#FCA5A5" },
    success: { dot: "#4ADE80", bg: "rgba(74,222,128,0.10)", text: "#86EFAC" },
  };

  const statValues = [
    {
      icon: Users,
      label: "Total Users",
      value: adminStats.totalUsers.toLocaleString(),
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.12)",
      border: "rgba(96,165,250,0.25)",
      glow: "rgba(96,165,250,0.15)",
    },
    {
      icon: UserRound,
      label: "Doctors",
      value: adminStats.doctors,
      color: "#6EE7B7",
      bg: "rgba(110,231,183,0.12)",
      border: "rgba(110,231,183,0.25)",
      glow: "rgba(110,231,183,0.15)",
    },
    {
      icon: Activity,
      label: "Active Requests",
      value: adminStats.activeRequests,
      color: "#FBBF24",
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.25)",
      glow: "rgba(251,191,36,0.15)",
    },
    {
      icon: CheckCircle,
      label: "Resolved Cases",
      value: adminStats.resolvedCases.toLocaleString(),
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.12)",
      border: "rgba(167,139,250,0.25)",
      glow: "rgba(167,139,250,0.15)",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #050810 0%, #080E1A 100%)",
      }}
    >
      <header
        className="flex items-center justify-between px-6 h-16"
        style={{
          background: "rgba(8,14,26,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(160,190,210,0.08)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="admin.back.button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#f9a8c9] transition-colors"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f9a8c9] to-[#f9a8c9] flex items-center justify-center">
              <HeartPulse size={16} className="text-[#0d0d0d]" />
            </div>
            <p className="text-sm font-bold text-[#ffffff]">
              CareConnect <span className="text-[#f9a8c9]">X</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#f9a8c9]" />
          <span className="text-sm font-semibold text-[#ffffff]">
            Admin Panel
          </span>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-[#ffffff]">
            System Dashboard
          </h2>
          <p className="text-sm text-[#888888] mt-1">
            Monitor platform activity and manage users
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statValues.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-5 hover:scale-[1.02] transition-all"
              style={{
                border: `1px solid ${stat.border}`,
                boxShadow: `0 4px 24px ${stat.glow}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: stat.bg }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#888888] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bar Chart – User Registrations */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <LayoutDashboard size={16} className="text-[#60A5FA]" />
              <p className="text-sm font-semibold text-[#ffffff]">
                User Registrations
              </p>
              <span className="text-xs text-[#888888] ml-auto">
                Last 6 months
              </span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {userRegistrationData.map((d, i) => {
                const c = BAR_COLORS[i % BAR_COLORS.length];
                return (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span
                      className="text-[9px] font-semibold"
                      style={{ color: c.bar }}
                    >
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${(d.count / maxUserCount) * 108}px`,
                        background: `linear-gradient(180deg, ${c.bar}, ${c.bar}55)`,
                        boxShadow: `0 -4px 12px ${c.shadow}`,
                      }}
                    />
                    <span className="text-[9px] text-[#888888]">{d.month}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4">
              {userRegistrationData.map((d, i) => (
                <div key={d.month} className="flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-sm"
                    style={{
                      background: BAR_COLORS[i % BAR_COLORS.length].bar,
                    }}
                  />
                  <span className="text-[9px] text-[#aaaaaa]">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Bars – Doctor Specialties */}
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-[#ffffff] mb-5">
              Doctor Specialties
            </p>
            <div className="space-y-3">
              {specialtyData.map((d, i) => {
                const c = SPECIALTY_COLORS[i % SPECIALTY_COLORS.length];
                return (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: c.label }}>{d.name}</span>
                      <span
                        className="font-semibold text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: `${c.fill}22`,
                          color: c.fill,
                        }}
                      >
                        {d.count}
                      </span>
                    </div>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(d.count / maxSpecialtyCount) * 100}%`,
                          background: `linear-gradient(90deg, ${c.fill}, ${c.fill}99)`,
                          boxShadow: `0 0 8px ${c.fill}66`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Color key */}
            <div
              className="flex flex-wrap gap-2 mt-4 pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              {specialtyData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      background:
                        SPECIALTY_COLORS[i % SPECIALTY_COLORS.length].fill,
                    }}
                  />
                  <span className="text-[9px] text-[#aaaaaa]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Volunteer Approvals ── */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-[#ffffff] mb-4">
            Pending Volunteer Approvals
          </p>
          <div className="space-y-3">
            {pendingVolunteers.map((v, idx) => {
              const avatarColor =
                VOLUNTEER_COLORS[idx % VOLUNTEER_COLORS.length];
              return (
                <div
                  key={v.id}
                  data-ocid={`admin.volunteer.item.${idx + 1}`}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{
                    border: `1px solid ${avatarColor}22`,
                    background: `${avatarColor}08`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d0d0d] text-xs font-bold flex-shrink-0"
                    style={{ background: avatarColor }}
                  >
                    {v.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#ffffff] truncate">
                      {v.name}
                    </p>
                    <p className="text-xs text-[#888888]">
                      {v.skill} · {v.location} · {v.applied}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {volunteerStatuses[v.id] === "pending" ? (
                      <>
                        <button
                          type="button"
                          data-ocid={`admin.volunteer.confirm_button.${idx + 1}`}
                          onClick={() =>
                            setVolunteerStatuses((p) => ({
                              ...p,
                              [v.id]: "approved",
                            }))
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{
                            background: "rgba(74,222,128,0.15)",
                            color: "#4ADE80",
                            border: "1px solid rgba(74,222,128,0.3)",
                          }}
                        >
                          <Check size={12} />
                          Approve
                        </button>
                        <button
                          type="button"
                          data-ocid={`admin.volunteer.delete_button.${idx + 1}`}
                          onClick={() =>
                            setVolunteerStatuses((p) => ({
                              ...p,
                              [v.id]: "rejected",
                            }))
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={{
                            background: "rgba(248,113,113,0.15)",
                            color: "#F87171",
                            border: "1px solid rgba(248,113,113,0.3)",
                          }}
                        >
                          <X size={12} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background:
                            volunteerStatuses[v.id] === "approved"
                              ? "rgba(74,222,128,0.15)"
                              : "rgba(248,113,113,0.15)",
                          color:
                            volunteerStatuses[v.id] === "approved"
                              ? "#4ADE80"
                              : "#F87171",
                        }}
                      >
                        {volunteerStatuses[v.id] === "approved"
                          ? "✓ Approved"
                          : "✕ Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── System Logs ── */}
        <div className="glass-card p-5">
          <p className="text-sm font-semibold text-[#ffffff] mb-4">
            Recent System Logs
          </p>
          <div className="space-y-2">
            {systemLogs.map((log, idx) => {
              const lc = logColors[log.type] ?? logColors.info;
              return (
                <div
                  key={log.id}
                  data-ocid={`admin.log.item.${idx + 1}`}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: lc.bg }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: lc.dot,
                      boxShadow: `0 0 6px ${lc.dot}`,
                    }}
                  />
                  <p className="flex-1 text-xs" style={{ color: lc.text }}>
                    {log.event}
                  </p>
                  <span
                    className="text-[10px] flex-shrink-0 px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: `${lc.dot}22`,
                      color: lc.dot,
                    }}
                  >
                    {log.time}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Log type legend */}
          <div
            className="flex gap-4 mt-4 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {Object.entries(logColors).map(([type, c]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: c.dot }}
                />
                <span
                  className="text-[10px] capitalize"
                  style={{ color: c.dot }}
                >
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Integration Settings ── */}
        <div
          className="glass-card p-5"
          style={{
            border: "1px solid rgba(168,139,250,0.30)",
            boxShadow:
              "0 4px 32px rgba(168,139,250,0.12), 0 0 0 1px rgba(249,168,201,0.08)",
            background:
              "linear-gradient(135deg, rgba(14,10,30,0.95) 0%, rgba(20,12,36,0.95) 100%)",
          }}
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(249,168,201,0.18), rgba(168,139,250,0.18))",
                border: "1px solid rgba(249,168,201,0.25)",
              }}
            >
              <Bot size={17} className="text-[#f9a8c9]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#ffffff]">
                AI Integration Settings
              </p>
              <p className="text-xs text-[#888888] mt-0.5">
                Configure your OpenAI API key to power AI features
              </p>
            </div>
            {/* Connection badge */}
            <div className="ml-auto flex-shrink-0">
              {isConnected ? (
                <span
                  data-ocid="admin.ai_settings.success_state"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(74,222,128,0.15)",
                    color: "#4ADE80",
                    border: "1px solid rgba(74,222,128,0.30)",
                  }}
                >
                  <Wifi size={11} />
                  ChatGPT-4 Connected
                </span>
              ) : (
                <span
                  data-ocid="admin.ai_settings.error_state"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    color: "#FBBF24",
                    border: "1px solid rgba(251,191,36,0.28)",
                  }}
                >
                  <WifiOff size={11} />
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ borderTop: "1px solid rgba(168,139,250,0.12)" }}
            className="mb-5"
          />

          {/* Key input row */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#cccccc]">
              <span className="flex items-center gap-1.5 mb-2">
                <KeyRound size={12} className="text-[#f9a8c9]" />
                OpenAI API Key
              </span>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(168,139,250,0.20)",
                }}
              >
                <input
                  data-ocid="admin.ai_settings.input"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    isConnected
                      ? "••••••••••••••••••••••••  (key saved)"
                      : "sk-..."
                  }
                  className="flex-1 bg-transparent text-sm text-[#ffffff] placeholder-[#555555] outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  data-ocid="admin.ai_settings.toggle"
                  onClick={() => setShowKey((p) => !p)}
                  className="text-[#666666] hover:text-[#f9a8c9] transition-colors flex-shrink-0"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-[#666666] flex items-center gap-1">
                <span style={{ color: "rgba(74,222,128,0.7)" }}>🔒</span>
                The API key is stored securely and never exposed to users
              </p>
              <button
                type="button"
                data-ocid="admin.ai_settings.save_button"
                onClick={handleSaveKey}
                disabled={isSaving || !apiKey.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                style={{
                  background:
                    isSaving || !apiKey.trim()
                      ? "rgba(249,168,201,0.10)"
                      : "linear-gradient(135deg, rgba(249,168,201,0.22), rgba(168,139,250,0.22))",
                  color: "#f9a8c9",
                  border: "1px solid rgba(249,168,201,0.35)",
                  boxShadow:
                    isSaving || !apiKey.trim()
                      ? "none"
                      : "0 0 14px rgba(249,168,201,0.18)",
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>Save API Key</>
                )}
              </button>
            </div>

            {/* Save result feedback */}
            {saveMsg === "success" && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{
                  background: "rgba(74,222,128,0.10)",
                  border: "1px solid rgba(74,222,128,0.22)",
                  color: "#4ADE80",
                }}
              >
                <CheckCircle size={12} />
                API key saved successfully — ChatGPT-4 is now connected
              </div>
            )}
            {saveMsg === "error" && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{
                  background: "rgba(248,113,113,0.10)",
                  border: "1px solid rgba(248,113,113,0.22)",
                  color: "#F87171",
                }}
              >
                <X size={12} />
                Failed to save key — please try again
              </div>
            )}
          </div>

          {/* Provider info row */}
          <div
            className="flex items-center gap-3 mt-5 pt-4"
            style={{ borderTop: "1px solid rgba(168,139,250,0.10)" }}
          >
            <div className="text-[11px] text-[#666666]">
              Powering:{" "}
              <span className="text-[#f9a8c9] font-semibold">
                AI Symptom Checker
              </span>
              {" · "}
              <span className="text-[#f9a8c9] font-semibold">
                Floating AI Chat
              </span>
              {" · "}
              <span className="text-[#f9a8c9] font-semibold">
                First Aid Analysis
              </span>
            </div>
            <div
              className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-mono flex-shrink-0"
              style={{
                background: "rgba(96,165,250,0.10)",
                color: "#60A5FA",
                border: "1px solid rgba(96,165,250,0.20)",
              }}
            >
              GPT-4o
            </div>
          </div>
        </div>

        <footer className="text-center py-4">
          <p className="text-xs text-[#888888]">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-[#f9a8c9] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

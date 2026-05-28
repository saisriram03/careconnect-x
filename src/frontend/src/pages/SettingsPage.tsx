import {
  AlertTriangle,
  Bell,
  Bluetooth,
  BluetoothOff,
  BrainCircuit,
  Check,
  ChevronRight,
  HeartPulse,
  Moon,
  RotateCcw,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useBluetoothHealth } from "../hooks/useBluetoothHealth";
import { useTheme } from "../hooks/useTheme";

type TabKey = "profile" | "notifications" | "health" | "ai";

interface NotifPrefs {
  master: boolean;
  doctorBooking: boolean;
  firstAid: boolean;
  community: boolean;
  aiInsights: boolean;
  emergency: boolean;
}

interface HealthPrefs {
  heartRate: boolean;
  bloodPressure: boolean;
  sleepData: boolean;
}

interface AIPrefs {
  predictiveCare: boolean;
  adaptiveUI: boolean;
  memoryEngine: boolean;
}

const defaultNotif: NotifPrefs = {
  master: true,
  doctorBooking: true,
  firstAid: true,
  community: true,
  aiInsights: true,
  emergency: true,
};

const defaultHealth: HealthPrefs = {
  heartRate: true,
  bloodPressure: true,
  sleepData: true,
};

const defaultAI: AIPrefs = {
  predictiveCare: true,
  adaptiveUI: true,
  memoryEngine: true,
};

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile & Appearance", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "health", label: "Health & Bluetooth", icon: HeartPulse },
  { key: "ai", label: "AI & Privacy", icon: BrainCircuit },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const { theme, toggleTheme } = useTheme();
  const bt = useBluetoothHealth();

  // Profile
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem("careconnect_username") || "User";
  });

  // Notifications
  const [notif, setNotif] = useState<NotifPrefs>(() => {
    try {
      const raw = localStorage.getItem("careconnect_notif_prefs");
      return raw ? { ...defaultNotif, ...JSON.parse(raw) } : defaultNotif;
    } catch {
      return defaultNotif;
    }
  });

  // Health
  const [health, setHealth] = useState<HealthPrefs>(() => {
    try {
      const raw = localStorage.getItem("careconnect_health_prefs");
      return raw ? { ...defaultHealth, ...JSON.parse(raw) } : defaultHealth;
    } catch {
      return defaultHealth;
    }
  });

  // AI
  const [ai, setAI] = useState<AIPrefs>(() => {
    try {
      const raw = localStorage.getItem("careconnect_ai_prefs");
      return raw ? { ...defaultAI, ...JSON.parse(raw) } : defaultAI;
    } catch {
      return defaultAI;
    }
  });

  const [resetMsg, setResetMsg] = useState(false);
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Persist
  useEffect(() => {
    localStorage.setItem("careconnect_notif_prefs", JSON.stringify(notif));
  }, [notif]);

  useEffect(() => {
    localStorage.setItem("careconnect_health_prefs", JSON.stringify(health));
  }, [health]);

  useEffect(() => {
    localStorage.setItem("careconnect_ai_prefs", JSON.stringify(ai));
  }, [ai]);

  const handleSaveName = () => {
    localStorage.setItem("careconnect_username", displayName.trim() || "User");
  };

  const handleResetMemory = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your AI memory? This cannot be undone.",
      )
    ) {
      localStorage.removeItem("careconnect_ai_memory");
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 3000);
    }
  };

  const cardClass =
    "rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm";

  const toggleRow = (
    label: string,
    checked: boolean,
    onChange: () => void,
    disabled = false,
  ) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked && !disabled ? "bg-primary" : "bg-muted"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        data-ocid={`settings.toggle.${label.toLowerCase().replace(/\s+/g, "_")}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-background text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-7 h-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Customize your CareConnect X experience
        </p>
      </motion.div>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap gap-2 mb-6"
        data-ocid="settings.tab_bar"
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "bg-card/40 text-muted-foreground border border-white/5 hover:bg-card/70 hover:text-foreground"
              }`}
              data-ocid={`settings.tab.${t.key}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <div className="space-y-4 max-w-3xl">
        {/* TAB 1: Profile & Appearance */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Profile
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-xl">
                  {getInitials(displayName)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avatar</p>
                  <p className="text-xs text-muted-foreground/70">
                    Initials are generated from your display name
                  </p>
                </div>
              </div>
              <label
                htmlFor="displayName"
                className="block text-sm text-muted-foreground mb-1"
              >
                Display Name
              </label>
              <div className="flex gap-2">
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={handleSaveName}
                  className="flex-1 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
                  placeholder="Enter your name"
                  data-ocid="settings.display_name.input"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
                  data-ocid="settings.display_name.save_button"
                >
                  Save
                </button>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-primary" />
                ) : (
                  <Sun className="w-4 h-4 text-primary" />
                )}
                Appearance
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-colors border border-primary/30"
                  data-ocid="settings.theme.toggle_button"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4" /> Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" /> Dark
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Notifications */}
        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Notifications
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Control which alerts you receive from CareConnect X
              </p>
              {toggleRow("Master Notifications", notif.master, () =>
                setNotif((p) => ({ ...p, master: !p.master })),
              )}
              {toggleRow(
                "Doctor Booking Alerts",
                notif.doctorBooking,
                () =>
                  setNotif((p) => ({ ...p, doctorBooking: !p.doctorBooking })),
                !notif.master,
              )}
              {toggleRow(
                "First Aid Reminders",
                notif.firstAid,
                () => setNotif((p) => ({ ...p, firstAid: !p.firstAid })),
                !notif.master,
              )}
              {toggleRow(
                "Community Updates",
                notif.community,
                () => setNotif((p) => ({ ...p, community: !p.community })),
                !notif.master,
              )}
              {toggleRow(
                "AI Health Insights",
                notif.aiInsights,
                () => setNotif((p) => ({ ...p, aiInsights: !p.aiInsights })),
                !notif.master,
              )}
              {toggleRow(
                "Emergency Alerts",
                notif.emergency,
                () => setNotif((p) => ({ ...p, emergency: !p.emergency })),
                !notif.master,
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: Health & Bluetooth */}
        {activeTab === "health" && (
          <motion.div
            key="health"
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {isIOS && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-200">
                    Bluetooth Not Supported on iOS
                  </p>
                  <p className="text-xs text-amber-200/70 mt-1">
                    Apple devices do not support Web Bluetooth. Health metrics
                    can be entered manually below.
                  </p>
                </div>
              </div>
            )}

            {!isIOS && (
              <div className={cardClass}>
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  {bt.connectionStatus === "connected" ? (
                    <Bluetooth className="w-4 h-4 text-green-400" />
                  ) : (
                    <BluetoothOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  Bluetooth Status
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-foreground">
                      {bt.connectionStatus === "connected"
                        ? `Connected: ${bt.deviceName || "Device"}`
                        : bt.connectionStatus === "connecting"
                          ? "Connecting..."
                          : "Disconnected"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bt.connectionStatus === "connected"
                        ? `Type: ${bt.deviceType}`
                        : "Connect your phone to sync health data"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={bt.connect}
                    disabled={bt.connectionStatus === "connecting"}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bt.connectionStatus === "connected"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                    }`}
                    data-ocid="settings.bluetooth.connect_button"
                  >
                    {bt.connectionStatus === "connected"
                      ? "Connected"
                      : bt.connectionStatus === "connecting"
                        ? "Connecting..."
                        : "Connect Phone"}
                  </button>
                </div>
                {bt.connectedApps.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bt.connectedApps.map((app) => (
                      <span
                        key={app}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs border border-green-500/20"
                      >
                        <Smartphone className="w-3 h-3" />
                        {app}
                      </span>
                    ))}
                  </div>
                )}
                {bt.errorMessage && (
                  <p className="text-xs text-red-400 mt-2">{bt.errorMessage}</p>
                )}
              </div>
            )}

            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-primary" />
                Health Data Preferences
              </h3>
              {toggleRow("Heart Rate Monitoring", health.heartRate, () =>
                setHealth((p) => ({ ...p, heartRate: !p.heartRate })),
              )}
              {toggleRow("Blood Pressure Tracking", health.bloodPressure, () =>
                setHealth((p) => ({ ...p, bloodPressure: !p.bloodPressure })),
              )}
              {toggleRow("Sleep Data", health.sleepData, () =>
                setHealth((p) => ({ ...p, sleepData: !p.sleepData })),
              )}
            </div>

            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary" />
                Health Score Weights
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Heart Rate", value: "35%", color: "text-rose-400" },
                  {
                    label: "Blood Pressure",
                    value: "35%",
                    color: "text-sky-400",
                  },
                  { label: "Sleep", value: "30%", color: "text-violet-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-background/60 p-3 text-center"
                  >
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: AI & Privacy */}
        {activeTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-primary" />
                AI Features
              </h3>
              {toggleRow("Predictive Care", ai.predictiveCare, () =>
                setAI((p) => ({ ...p, predictiveCare: !p.predictiveCare })),
              )}
              {toggleRow("Adaptive UI", ai.adaptiveUI, () =>
                setAI((p) => ({ ...p, adaptiveUI: !p.adaptiveUI })),
              )}
              {toggleRow("Memory Engine", ai.memoryEngine, () =>
                setAI((p) => ({ ...p, memoryEngine: !p.memoryEngine })),
              )}
            </div>

            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Privacy
              </h3>
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-200">
                  Your data stays on-device and is never shared with third
                  parties.
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                AI Memory
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Resetting will clear all learned preferences and behavioral
                patterns. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleResetMemory}
                className="px-4 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors border border-red-500/30"
                data-ocid="settings.ai.reset_memory_button"
              >
                Reset AI Memory
              </button>
              {resetMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-green-400"
                >
                  <Check className="w-4 h-4" />
                  AI memory has been reset successfully.
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

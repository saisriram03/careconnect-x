import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Footprints,
  Heart,
  Loader2,
  Moon,
  Pill,
  Smartphone,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Watch,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAI } from "../ai/AIContext";

import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import GlassCard from "../components/ui/GlassCard";
import { appointments, prescriptions, recentActivity } from "../data/dummyData";
import { useBluetoothHealth } from "../hooks/useBluetoothHealth";

const _isIOS = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !(window as unknown as Record<string, unknown>).MSStream;

const activityIcons: Record<string, React.ReactNode> = {
  consultation: <Stethoscope size={14} />,
  record: <FileText size={14} />,
  prescription: <Pill size={14} />,
  checkup: <CheckCircle2 size={14} />,
  community: <Users size={14} />,
};

function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5 mr-1.5">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// --- Status badge helper ---
type MetricStatusType = "good" | "fair" | "low" | "elevated" | "high";

const STATUS_COLORS: Record<
  MetricStatusType,
  { bg: string; text: string; border: string }
> = {
  good: {
    bg: "rgba(34,197,94,0.15)",
    text: "#22C55E",
    border: "rgba(34,197,94,0.3)",
  },
  fair: {
    bg: "rgba(245,158,11,0.15)",
    text: "#F59E0B",
    border: "rgba(245,158,11,0.3)",
  },
  low: {
    bg: "rgba(239,68,68,0.15)",
    text: "#EF4444",
    border: "rgba(239,68,68,0.3)",
  },
  elevated: {
    bg: "rgba(245,158,11,0.15)",
    text: "#F59E0B",
    border: "rgba(245,158,11,0.3)",
  },
  high: {
    bg: "rgba(239,68,68,0.15)",
    text: "#EF4444",
    border: "rgba(239,68,68,0.3)",
  },
};

function StatusBadge({
  label,
  type,
}: { label: string; type: MetricStatusType }) {
  const c = STATUS_COLORS[type];
  return (
    <span
      className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {label}
    </span>
  );
}

function getHeartRateStatus(hr: number): {
  label: string;
  type: MetricStatusType;
} {
  if (hr >= 60 && hr <= 100) return { label: "Good", type: "good" };
  if ((hr >= 50 && hr < 60) || (hr > 100 && hr <= 110))
    return { label: "Fair", type: "fair" };
  return { label: "Low", type: "low" };
}

function getBPStatus(
  systolic: number,
  diastolic: number,
): { label: string; type: MetricStatusType } {
  if (systolic < 120 && diastolic < 80) return { label: "Good", type: "good" };
  if (systolic < 130) return { label: "Elevated", type: "elevated" };
  return { label: "High", type: "high" };
}

function getSleepStatus(hrs: number): {
  label: string;
  type: MetricStatusType;
} {
  if (hrs >= 7 && hrs <= 9) return { label: "Good", type: "good" };
  if ((hrs >= 6 && hrs < 7) || (hrs > 9 && hrs <= 10))
    return { label: "Fair", type: "fair" };
  return { label: "Low", type: "low" };
}

// --- Metric tiles ---

function HeartRateTile({
  value,
  lastRecorded,
  source,
  onManualInput,
}: {
  value: number | null;
  lastRecorded: Date | null;
  source: "Bluetooth" | "Manual" | null;
  onManualInput: (bpm: number | null) => void;
}) {
  const prevRef = useRef<number | null>(null);
  const [bump, setBump] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    if (value !== null && value !== prevRef.current) {
      prevRef.current = value;
      setBump(true);
      setGlowPulse(true);
      const t1 = setTimeout(() => setBump(false), 400);
      const t2 = setTimeout(() => setGlowPulse(false), 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
  };

  const handleSubmit = () => {
    const n = Number.parseInt(inputVal, 10);
    if (Number.isFinite(n) && n >= 40 && n <= 200) {
      onManualInput(n);
      setInputVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const status = value !== null ? getHeartRateStatus(value) : null;
  const lastTime = lastRecorded
    ? lastRecorded.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <motion.div
      className="rounded-xl p-3 text-center relative overflow-hidden"
      animate={
        glowPulse
          ? {
              boxShadow: [
                "0 0 0px #FF6B6B00",
                "0 0 16px #FF6B6B88",
                "0 0 0px #FF6B6B00",
              ],
            }
          : { boxShadow: "0 0 0px #FF6B6B00" }
      }
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-center mb-1">
        {value !== null && <PulsingDot color="#FF6B6B" />}
        <Heart
          size={18}
          style={{ color: "#FF6B6B", opacity: value !== null ? 1 : 0.5 }}
        />
      </div>
      {value !== null ? (
        <p
          className="text-sm font-bold transition-all duration-200"
          style={{
            color: "#FF6B6B",
            transform: bump ? "scale(1.2)" : "scale(1)",
            display: "inline-block",
          }}
        >
          {value}
        </p>
      ) : (
        <div className="flex gap-1 items-center justify-center">
          <input
            type="number"
            min="40"
            max="200"
            value={inputVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="bpm"
            className="w-12 text-center text-sm font-bold bg-transparent outline-none border-b border-[#FF6B6B]/30 focus:border-[#FF6B6B] text-[#FF6B6B] placeholder:text-[#555]"
            data-ocid="heartrate.input"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
            style={{ background: "rgba(255,107,107,0.2)", color: "#FF6B6B" }}
            data-ocid="heartrate.manual_submit"
          >
            ✓
          </button>
        </div>
      )}
      <p className="text-[10px] text-[#888888] mt-0.5">Heart Rate</p>
      {status && <StatusBadge label={status.label} type={status.type} />}
      <p className="text-[9px] text-[#4A5568] mt-0.5">
        {value !== null
          ? "bpm"
          : "No data — enter a reading or connect your phone"}
      </p>
      {lastTime && source && (
        <p
          className="text-[9px] mt-0.5"
          style={{ color: source === "Bluetooth" ? "#22C55E" : "#f9a8c9" }}
        >
          {lastTime} via {source}
        </p>
      )}
    </motion.div>
  );
}

function BloodPressureTile({
  systolic,
  diastolic,
  lastRecorded,
  source,
  onManualInput,
}: {
  systolic: number | null;
  diastolic: number | null;
  lastRecorded: Date | null;
  source: "Bluetooth" | "Manual" | null;
  onManualInput: (bp: { systolic: number; diastolic: number } | null) => void;
}) {
  const hasData = systolic !== null && diastolic !== null;
  const [glowPulse, setGlowPulse] = useState(false);
  const prevRef = useRef<string | null>(null);
  const [sysInput, setSysInput] = useState("");
  const [diaInput, setDiaInput] = useState("");

  useEffect(() => {
    const key = hasData ? `${systolic}/${diastolic}` : null;
    if (key && key !== prevRef.current) {
      prevRef.current = key;
      setGlowPulse(true);
      const t = setTimeout(() => setGlowPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [systolic, diastolic, hasData]);

  const handleSubmit = () => {
    const sys = Number.parseInt(sysInput, 10);
    const dia = Number.parseInt(diaInput, 10);
    if (Number.isFinite(sys) && Number.isFinite(dia) && sys > 0 && dia > 0) {
      onManualInput({ systolic: sys, diastolic: dia });
      setSysInput("");
      setDiaInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const status = hasData ? getBPStatus(systolic!, diastolic!) : null;
  const lastTime = lastRecorded
    ? lastRecorded.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <motion.div
      className="rounded-xl p-3 text-center"
      animate={
        glowPulse
          ? {
              boxShadow: [
                "0 0 0px #f9a8c900",
                "0 0 16px #f9a8c988",
                "0 0 0px #f9a8c900",
              ],
            }
          : { boxShadow: "0 0 0px #f9a8c900" }
      }
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <Activity
        size={18}
        className="mx-auto mb-1"
        style={{ color: "#f9a8c9", opacity: hasData ? 1 : 0.5 }}
      />
      {hasData ? (
        <p className="text-sm font-bold" style={{ color: "#f9a8c9" }}>
          {systolic}/{diastolic}
        </p>
      ) : (
        <div className="space-y-1">
          <div className="flex gap-1 items-center justify-center">
            <input
              type="number"
              value={sysInput}
              onChange={(e) => setSysInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="sys"
              className="w-10 text-center text-xs font-bold bg-transparent outline-none border-b border-[#f9a8c9]/30 focus:border-[#f9a8c9] text-[#f9a8c9] placeholder:text-[#555]"
              data-ocid="bp.systolic.input"
            />
            <span className="text-[#888] text-xs">/</span>
            <input
              type="number"
              value={diaInput}
              onChange={(e) => setDiaInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="dia"
              className="w-10 text-center text-xs font-bold bg-transparent outline-none border-b border-[#f9a8c9]/30 focus:border-[#f9a8c9] text-[#f9a8c9] placeholder:text-[#555]"
              data-ocid="bp.diastolic.input"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
              style={{ background: "rgba(249,168,201,0.2)", color: "#f9a8c9" }}
              data-ocid="bp.manual_submit"
            >
              ✓
            </button>
          </div>
        </div>
      )}
      <p className="text-[10px] text-[#888888] mt-0.5">Blood Pressure</p>
      {status && <StatusBadge label={status.label} type={status.type} />}
      <p className="text-[9px] text-[#4A5568] mt-0.5">
        {hasData ? "mmHg" : "No data — enter a reading or connect your phone"}
      </p>
      {lastTime && source && (
        <p
          className="text-[9px] mt-0.5"
          style={{ color: source === "Bluetooth" ? "#22C55E" : "#f9a8c9" }}
        >
          {lastTime} via {source}
        </p>
      )}
    </motion.div>
  );
}

function SleepTile({
  value,
  lastRecorded,
  source,
  onManualInput,
}: {
  value: number | null;
  connected: boolean;
  lastRecorded: Date | null;
  source: "Bluetooth" | "Manual" | null;
  onManualInput: (v: number | null) => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const [glowPulse, setGlowPulse] = useState(false);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== null && value !== prevRef.current) {
      prevRef.current = value;
      setGlowPulse(true);
      const t = setTimeout(() => setGlowPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
    const n = Number.parseFloat(raw);
    onManualInput(Number.isFinite(n) && n >= 0 ? n : null);
  };

  const status = value !== null ? getSleepStatus(value) : null;
  const lastTime = lastRecorded
    ? lastRecorded.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <motion.div
      className="rounded-xl p-3 text-center"
      animate={
        glowPulse
          ? {
              boxShadow: [
                "0 0 0px #A78BFA00",
                "0 0 16px #A78BFA88",
                "0 0 0px #A78BFA00",
              ],
            }
          : { boxShadow: "0 0 0px #A78BFA00" }
      }
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <Moon
        size={18}
        className="mx-auto mb-1"
        style={{ color: "#A78BFA", opacity: 1 }}
      />
      {value !== null ? (
        <p className="text-sm font-bold" style={{ color: "#A78BFA" }}>
          {value}
        </p>
      ) : (
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={inputVal}
          onChange={handleChange}
          placeholder="hrs"
          className="w-full text-center text-sm font-bold bg-transparent outline-none border-b border-[#A78BFA]/30 focus:border-[#A78BFA] text-[#A78BFA] placeholder:text-[#555] mb-0.5"
          data-ocid="sleep.input"
        />
      )}
      <p className="text-[10px] text-[#888888] mt-0.5">Sleep</p>
      {status && <StatusBadge label={status.label} type={status.type} />}
      <p className="text-[9px] text-[#4A5568] mt-0.5">
        {value !== null ? "hrs" : "Log manually"}
      </p>
      {lastTime && source && (
        <p
          className="text-[9px] mt-0.5"
          style={{ color: source === "Bluetooth" ? "#22C55E" : "#A78BFA" }}
        >
          {lastTime} via {source}
        </p>
      )}
    </motion.div>
  );
}

function StepsTile({ value }: { value: number | null }) {
  if (value === null) return null;
  const isGoalMet = value >= 10000;
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <Footprints
        size={18}
        className="mx-auto mb-1"
        style={{ color: "#34D399", opacity: 1 }}
      />
      <p className="text-sm font-bold" style={{ color: "#34D399" }}>
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-[#888888] mt-0.5">Steps</p>
      <StatusBadge
        label={isGoalMet ? "Goal Met" : "Keep Going"}
        type={isGoalMet ? "good" : "fair"}
      />
      <p className="text-[9px] text-[#4A5568] mt-0.5">today</p>
    </div>
  );
}

// --- Health score computation ---

interface MetricScore {
  label: string;
  points: number;
  status: "good" | "fair" | "low" | "missing";
  statusLabel: string;
  weight: number;
  icon: React.ReactNode;
}

function computeHealthScore(
  heartRate: number | null,
  bloodPressure: { systolic: number; diastolic: number } | null,
  sleep: number | null,
): { total: number | null; metrics: MetricScore[] } {
  const metrics: MetricScore[] = [];

  // Heart rate (35%)
  if (heartRate !== null) {
    let points = 0;
    let status: MetricScore["status"] = "low";
    let statusLabel = "Low";
    if (heartRate >= 60 && heartRate <= 100) {
      points = 100;
      status = "good";
      statusLabel = "Good";
    } else if (
      (heartRate >= 50 && heartRate < 60) ||
      (heartRate > 100 && heartRate <= 110)
    ) {
      points = 70;
      status = "fair";
      statusLabel = "Fair";
    } else {
      points = 40;
      status = "low";
      statusLabel = "Low";
    }
    metrics.push({
      label: "Heart Rate",
      points,
      status,
      statusLabel,
      weight: 0.35,
      icon: <Heart size={13} />,
    });
  } else {
    metrics.push({
      label: "Heart Rate",
      points: 0,
      status: "missing",
      statusLabel: "Not measured",
      weight: 0.35,
      icon: <Heart size={13} />,
    });
  }

  // Blood pressure (35%)
  if (bloodPressure) {
    let points = 0;
    let status: MetricScore["status"] = "low";
    let statusLabel = "High";
    if (bloodPressure.systolic < 120 && bloodPressure.diastolic < 80) {
      points = 100;
      status = "good";
      statusLabel = "Good";
    } else if (bloodPressure.systolic < 130) {
      points = 70;
      status = "fair";
      statusLabel = "Elevated";
    } else {
      points = 40;
      status = "low";
      statusLabel = "High";
    }
    metrics.push({
      label: "Blood Pressure",
      points,
      status,
      statusLabel,
      weight: 0.35,
      icon: <Activity size={13} />,
    });
  } else {
    metrics.push({
      label: "Blood Pressure",
      points: 0,
      status: "missing",
      statusLabel: "Not measured",
      weight: 0.35,
      icon: <Activity size={13} />,
    });
  }

  // Sleep (30%)
  if (sleep !== null) {
    let points = 0;
    let status: MetricScore["status"] = "low";
    let statusLabel = "Low";
    if (sleep >= 7 && sleep <= 9) {
      points = 100;
      status = "good";
      statusLabel = "Good";
    } else if ((sleep >= 6 && sleep < 7) || (sleep > 9 && sleep <= 10)) {
      points = 70;
      status = "fair";
      statusLabel = "Fair";
    } else {
      points = 40;
      status = "low";
      statusLabel = "Low";
    }
    metrics.push({
      label: "Sleep",
      points,
      status,
      statusLabel,
      weight: 0.3,
      icon: <Moon size={13} />,
    });
  } else {
    metrics.push({
      label: "Sleep",
      points: 0,
      status: "missing",
      statusLabel: "Not logged",
      weight: 0.3,
      icon: <Moon size={13} />,
    });
  }

  const realMetrics = metrics.filter((m) => m.status !== "missing");
  if (realMetrics.length === 0) return { total: null, metrics };

  const totalWeight = realMetrics.reduce((s, m) => s + m.weight, 0);
  const total = Math.round(
    realMetrics.reduce((s, m) => s + m.points * m.weight, 0) / totalWeight,
  );
  return { total, metrics };
}

// --- SVG circular ring ---

function ScoreRing({ score }: { score: number | null }) {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const pct = score !== null ? Math.min(Math.max(score, 0), 100) : 0;
  const offset = circumference - (pct / 100) * circumference;

  let ringColor = "#888888";
  if (score !== null) {
    if (score >= 85) ringColor = "#22C55E";
    else if (score >= 70) ringColor = "#F59E0B";
    else ringColor = "#EF4444";
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 100, height: 100 }}
    >
      <svg
        width={100}
        height={100}
        className="-rotate-90"
        aria-label="Health score ring"
        role="img"
      >
        {/* Track */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
          }}
        />
      </svg>
      {/* Score in center */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span
          className="text-2xl font-bold leading-none"
          style={{ color: score !== null ? ringColor : "#555" }}
        >
          {score !== null ? score : "--"}
        </span>
        {score !== null && (
          <span className="text-[8px] text-[#888888] mt-0.5">/ 100</span>
        )}
      </div>
    </div>
  );
}

// --- Health Score Panel ---

function HealthScorePanel({
  heartRate,
  bloodPressure,
  sleep,
}: {
  heartRate: number | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
  sleep: number | null;
}) {
  const { total, metrics } = computeHealthScore(
    heartRate,
    bloodPressure,
    sleep,
  );

  let overallLabel = "";
  let overallColor = "#888888";
  if (total !== null) {
    if (total >= 85) {
      overallLabel = "Excellent Health";
      overallColor = "#22C55E";
    } else if (total >= 70) {
      overallLabel = "Good Health";
      overallColor = "#F59E0B";
    } else {
      overallLabel = "Needs Attention";
      overallColor = "#EF4444";
    }
  }

  const hasMissing = metrics.some((m) => m.status === "missing");

  const statusChipStyle = (status: MetricScore["status"]) => {
    if (status === "good")
      return {
        bg: "rgba(34,197,94,0.15)",
        color: "#22C55E",
        border: "rgba(34,197,94,0.3)",
      };
    if (status === "fair")
      return {
        bg: "rgba(245,158,11,0.15)",
        color: "#F59E0B",
        border: "rgba(245,158,11,0.3)",
      };
    if (status === "low")
      return {
        bg: "rgba(239,68,68,0.15)",
        color: "#EF4444",
        border: "rgba(239,68,68,0.3)",
      };
    return {
      bg: "rgba(136,136,136,0.1)",
      color: "#888888",
      border: "rgba(136,136,136,0.2)",
    };
  };

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      data-ocid="health.score.panel"
    >
      <div className="flex items-center gap-4">
        {/* Circular ring */}
        <ScoreRing score={total} />

        {/* Label + breakdown */}
        <div className="flex-1 min-w-0">
          {total !== null ? (
            <>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2"
                style={{
                  background: `${overallColor}22`,
                  color: overallColor,
                  border: `1px solid ${overallColor}44`,
                }}
              >
                {overallLabel}
              </div>
            </>
          ) : (
            <p className="text-[11px] text-[#888888] mb-2">
              Connect device or log sleep to see your score
            </p>
          )}

          {/* Per-metric breakdown rows */}
          <div className="space-y-1.5">
            {metrics.map((m) => {
              const chip = statusChipStyle(m.status);
              return (
                <div key={m.label} className="flex items-center gap-2">
                  <span
                    style={{
                      color:
                        m.status === "missing"
                          ? "#555"
                          : overallColor === "#888888"
                            ? "#888"
                            : "#aaa",
                    }}
                  >
                    {m.icon}
                  </span>
                  <span className="text-[10px] text-[#888888] w-24 flex-shrink-0">
                    {m.label}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: chip.bg,
                      color: chip.color,
                      border: `1px solid ${chip.border}`,
                    }}
                  >
                    {m.statusLabel}
                  </span>
                  {m.status !== "missing" && (
                    <span className="text-[9px] text-[#555] ml-auto">
                      {m.points}pts
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Missing metric hint */}
          {hasMissing && (
            <p className="text-[9px] text-[#666] mt-2">
              ⚠ Connect device / enter sleep to get a full score
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Bluetooth Connection Panel ---

function DeviceTypeBadge({
  type,
}: { type: "phone" | "tracker" | "unknown" | "headphone" }) {
  if (type === "phone") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(99,102,241,0.15)",
          color: "#818CF8",
          border: "1px solid rgba(99,102,241,0.3)",
        }}
      >
        <Smartphone size={10} />
        Phone
      </span>
    );
  }
  if (type === "headphone") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(251,191,36,0.15)",
          color: "#FBBF24",
          border: "1px solid rgba(251,191,36,0.3)",
        }}
      >
        <Bluetooth size={10} />
        Headphones
      </span>
    );
  }
  if (type === "tracker") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(52,211,153,0.15)",
          color: "#34D399",
          border: "1px solid rgba(52,211,153,0.3)",
        }}
      >
        <Watch size={10} />
        Tracker
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: "rgba(249,168,201,0.15)",
        color: "#f9a8c9",
        border: "1px solid rgba(249,168,201,0.3)",
      }}
    >
      <Bluetooth size={10} />
      Device
    </span>
  );
}

interface BluetoothPanelProps {
  isSupported: boolean;
  isUnsupported: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  deviceName: string | null;
  deviceType: "phone" | "tracker" | "headphone" | "unknown";
  connectedApps: string[];
  connectedServices: string[];
  heartRate: number | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
  steps: number | null;
  errorMessage: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function BluetoothPanel({
  isUnsupported,
  connectionStatus,
  deviceName,
  deviceType,
  connectedApps,
  connectedServices,
  heartRate,
  bloodPressure,
  steps,
  errorMessage,
  onConnect,
  onDisconnect,
}: BluetoothPanelProps) {
  const isConnected = connectionStatus === "connected";
  const isConnecting = connectionStatus === "connecting";
  const hasError = connectionStatus === "error";

  return (
    <div
      className="rounded-xl mb-4 overflow-hidden"
      style={{
        background: "rgba(249,168,201,0.05)",
        border: isConnected
          ? "1px solid rgba(34,197,94,0.25)"
          : hasError
            ? "1px solid rgba(239,68,68,0.25)"
            : "1px solid rgba(249,168,201,0.15)",
      }}
    >
      {/* iOS / unsupported */}
      {isUnsupported ? (
        <div className="flex items-start gap-3 p-3">
          <BluetoothOff
            size={16}
            className="text-[#EF4444] flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-xs font-semibold text-[#EF4444]">
              Bluetooth Not Supported
            </p>
            <p className="text-[11px] text-[#888888] mt-0.5">
              Bluetooth is not supported on iPhone and iPad. Please use Chrome
              or Edge on Android or a desktop computer to connect your health
              devices.
            </p>
          </div>
        </div>
      ) : isConnecting ? (
        /* Connecting state */
        <div className="flex items-center gap-3 p-3">
          <Loader2
            size={16}
            className="text-[#f9a8c9] animate-spin flex-shrink-0"
          />
          <div>
            <p className="text-xs text-[#f9a8c9] font-medium">
              Connecting to device…
            </p>
            <p className="text-[10px] text-[#888888] mt-0.5">
              Select your{" "}
              <span className="text-[#f9a8c9] font-semibold">phone</span> from
              the picker — not headphones or speakers
            </p>
          </div>
        </div>
      ) : isConnected ? (
        /* Connected state */
        <div className="p-3 space-y-2">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <PulsingDot color="#22C55E" />
              <BluetoothConnected size={14} className="text-[#22C55E]" />
              <p className="text-xs font-semibold text-[#22C55E]">
                {deviceName ?? "Unknown Device"}
              </p>
              <DeviceTypeBadge type={deviceType} />
              <span className="text-[10px] text-[#888888]">
                · Live data active
              </span>
            </div>
            <button
              type="button"
              data-ocid="bluetooth.disconnect.button"
              onClick={onDisconnect}
              className="flex items-center gap-1 text-[10px] text-[#888888] hover:text-[#EF4444] transition-colors flex-shrink-0"
            >
              <X size={12} />
              Disconnect
            </button>
          </div>

          {/* Data access row */}
          <div className="flex flex-wrap gap-2 mt-1">
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background:
                  heartRate !== null
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(255,255,255,0.05)",
                color: heartRate !== null ? "#22C55E" : "#888",
                border: `1px solid ${heartRate !== null ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {heartRate !== null ? "✓" : "~"} Heart Rate
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background:
                  bloodPressure !== null
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(255,255,255,0.05)",
                color: bloodPressure !== null ? "#22C55E" : "#888",
                border: `1px solid ${bloodPressure !== null ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {bloodPressure !== null ? "✓" : "~"} Blood Pressure
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background:
                  steps !== null
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(255,255,255,0.05)",
                color: steps !== null ? "#22C55E" : "#888",
                border: `1px solid ${steps !== null ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {steps !== null ? "✓" : "~"} Steps
            </span>
          </div>

          {/* Connected services */}
          {connectedServices.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] text-[#555] uppercase tracking-wider">
                Live Services:
              </span>
              {connectedServices.map((svc) => (
                <span
                  key={svc}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#22C55E",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  ✓ {svc}
                </span>
              ))}
            </div>
          )}
          {/* Connected apps */}
          {connectedApps.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] text-[#555] uppercase tracking-wider">
                Via:
              </span>
              {connectedApps.map((app) => (
                <span
                  key={app}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(249,168,201,0.1)",
                    color: "#f9a8c9",
                    border: "1px solid rgba(249,168,201,0.2)",
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Disconnected state — phone-focused guidance */
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-[#f9a8c9]" />
            <p className="text-sm font-semibold text-[#ffffff]">
              Connect Your Phone for Health Data
            </p>
          </div>

          {/* Step-by-step guide */}
          <div className="space-y-1.5 mb-3">
            {[
              {
                n: 1,
                text: "Open Google Fit or Samsung Health on your phone",
                icon: "📱",
              },
              {
                n: 2,
                text: "Make sure your phone's Bluetooth is turned ON",
                icon: "🔵",
              },
              {
                n: 3,
                text: "Tap the 'Connect Phone' button below",
                icon: "👇",
              },
              {
                n: 4,
                text: "Select your phone or health device from the list",
                icon: "✅",
              },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{
                    background: "rgba(249,168,201,0.2)",
                    color: "#f9a8c9",
                    border: "1px solid rgba(249,168,201,0.3)",
                  }}
                >
                  {step.n}
                </span>
                <p className="text-[11px] text-[#cccccc] leading-relaxed">
                  <span className="mr-1">{step.icon}</span>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Error message */}
          {hasError && errorMessage && (
            <div
              className="flex items-start gap-2 p-2 rounded-lg mb-3"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <span className="text-[10px] text-[#EF4444] leading-relaxed">
                ⚠ {errorMessage} — Make sure your phone's health app is open and
                Bluetooth is enabled, then try again.
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              data-ocid="bluetooth.connect.button"
              onClick={onConnect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#0d0d0d] transition-all hover:brightness-110 active:scale-95"
              style={{ background: "#f9a8c9" }}
            >
              <Smartphone size={13} />
              Connect Phone
            </button>
            <button
              type="button"
              data-ocid="bluetooth.other.button"
              onClick={onConnect}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] text-[#888888] hover:text-[#cccccc] transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Bluetooth size={11} />
              Other Device
            </button>
          </div>

          <p className="text-[10px] text-[#888888] mt-2 leading-relaxed">
            Make sure your phone's Bluetooth is on and your health app (Google
            Fit / Samsung Health) is open
          </p>
          <p className="text-[9px] text-[#555] mt-1">
            ℹ Works in Chrome or Edge on Android &amp; desktop only (HTTPS
            required)
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Mood Banner ─────────────────────────────────────────────────────────────

const MOOD_META: Record<
  string,
  { emoji: string; label: string; color: string; bg: string; border: string }
> = {
  morning: {
    emoji: "🌅",
    label: "Morning Mode — Bright & Energized",
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  afternoon: {
    emoji: "☀️",
    label: "Afternoon Mode — Focused & Sharp",
    color: "#f9a8c9",
    bg: "rgba(249,168,201,0.08)",
    border: "rgba(249,168,201,0.2)",
  },
  evening: {
    emoji: "🌆",
    label: "Evening Mode — Calm & Winding Down",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
  night: {
    emoji: "🌙",
    label: "Night Mode Active — Simplified UI",
    color: "#818CF8",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.2)",
  },
};

function MoodBanner({ timeMood }: { timeMood: string }) {
  const [dismissed, setDismissed] = useState(false);
  const meta = MOOD_META[timeMood] ?? MOOD_META.afternoon;

  if (dismissed) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all duration-300"
      style={{
        background: meta.bg,
        border: `1px solid ${meta.border}`,
      }}
      data-ocid="mood.banner"
    >
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{meta.emoji}</span>
        <span className="text-xs font-semibold" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <span className="text-[10px] text-[#666] hidden sm:inline">
          · AI adapting your experience
        </span>
      </div>
      <button
        type="button"
        data-ocid="mood.banner.close_button"
        onClick={() => setDismissed(true)}
        className="text-[#555] hover:text-[#888] transition-colors flex-shrink-0"
        aria-label="Dismiss mood banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── AI Intelligence Summary Card ────────────────────────────────────────────

function AIIntelligenceSummary() {
  const navigate = useNavigate();
  const { healthPredictions, careReliabilityIndex } = useAI();

  const topPredictions = healthPredictions.slice(0, 3);
  const reliabilityScore = careReliabilityIndex.overallScore;
  const reliabilityColor =
    reliabilityScore >= 80
      ? "#22C55E"
      : reliabilityScore >= 60
        ? "#F59E0B"
        : "#EF4444";

  return (
    <GlassCard className="p-5" data-ocid="ai.intelligence.summary.card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} style={{ color: "#f9a8c9" }} />
          <span className="text-sm font-bold text-[#ffffff]">
            AI Intelligence
          </span>
        </div>
        <button
          type="button"
          data-ocid="ai.hub.link"
          onClick={() => navigate({ to: "/ai" })}
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all hover:brightness-110"
          style={{
            background: "rgba(249,168,201,0.12)",
            color: "#f9a8c9",
            border: "1px solid rgba(249,168,201,0.25)",
          }}
        >
          AI Hub →
        </button>
      </div>

      {/* Care Reliability Score */}
      <div
        className="rounded-xl p-3 mb-3 flex items-center gap-3"
        style={{
          background: `${reliabilityColor}10`,
          border: `1px solid ${reliabilityColor}25`,
        }}
        data-ocid="ai.care.reliability.mini"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${reliabilityColor}18` }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: reliabilityColor }}
          >
            {reliabilityScore}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: reliabilityColor }}>
            Care Reliability Index
          </p>
          <p className="text-[10px] text-[#888]">
            {careReliabilityIndex.supportiveInsight}
          </p>
        </div>
      </div>

      {/* Top Health Predictions */}
      <div className="space-y-2 mb-4">
        {topPredictions.length === 0 ? (
          <p className="text-[11px] text-[#555]">
            No predictions yet — keep logging health data.
          </p>
        ) : (
          topPredictions.map((pred) => (
            <div
              key={pred.id}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              data-ocid={`ai.prediction.mini.${pred.id}`}
            >
              <span className="text-base flex-shrink-0">{pred.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#ccc] truncate">
                  {pred.title}
                </p>
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background:
                    pred.severity === "high" || pred.severity === "critical"
                      ? "rgba(239,68,68,0.12)"
                      : pred.severity === "medium"
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(34,197,94,0.12)",
                  color:
                    pred.severity === "high" || pred.severity === "critical"
                      ? "#ef4444"
                      : pred.severity === "medium"
                        ? "#f59e0b"
                        : "#22c55e",
                  border:
                    pred.severity === "high" || pred.severity === "critical"
                      ? "1px solid rgba(239,68,68,0.3)"
                      : pred.severity === "medium"
                        ? "1px solid rgba(245,158,11,0.3)"
                        : "1px solid rgba(34,197,94,0.3)",
                }}
              >
                {pred.confidence}%
              </span>
            </div>
          ))
        )}
      </div>

      {/* Quick AI Actions */}
      <div className="flex gap-2" data-ocid="ai.quick.actions.row">
        {[
          {
            icon: <Bot size={14} />,
            label: "Ask AI",
            ocid: "ai.ask.button",
            onClick: () => {
              const btn = document.querySelector<HTMLButtonElement>(
                "[data-ocid='chatbot.toggle.button']",
              );
              btn?.click();
            },
            color: "#f9a8c9",
            bg: "rgba(249,168,201,0.1)",
            border: "rgba(249,168,201,0.2)",
          },
          {
            icon: <TrendingUp size={14} />,
            label: "Predictions",
            ocid: "ai.predictions.link",
            onClick: () => navigate({ to: "/ai/predictive-care" }),
            color: "#34D399",
            bg: "rgba(52,211,153,0.1)",
            border: "rgba(52,211,153,0.2)",
          },
          {
            icon: <Sparkles size={14} />,
            label: "AI Hub",
            ocid: "ai.hub.button",
            onClick: () => navigate({ to: "/ai" }),
            color: "#FBBF24",
            bg: "rgba(251,191,36,0.1)",
            border: "rgba(251,191,36,0.2)",
          },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            data-ocid={action.ocid}
            onClick={action.onClick}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-[10px] font-semibold transition-all hover:scale-[1.03] hover:brightness-110"
            style={{
              background: action.bg,
              border: `1px solid ${action.border}`,
              color: action.color,
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Living Dashboard Insight Card ───────────────────────────────────────────

function LivingInsightCard() {
  const navigate = useNavigate();
  const { livingInsight } = useAI();

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background:
          "linear-gradient(135deg, rgba(96,165,250,0.08) 0%, rgba(96,165,250,0.04) 100%)",
        border: "1px solid rgba(96,165,250,0.2)",
      }}
      data-ocid="dashboard.living_insight.card"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(96,165,250,0.15)",
            border: "1px solid rgba(96,165,250,0.3)",
          }}
        >
          <Sparkles size={14} style={{ color: "#60a5fa" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "#60a5fa" }}
            >
              ℹ️ Daily AI Insight
            </span>
            <span className="text-[9px]" style={{ color: "#555" }}>
              · Updates every 6h
            </span>
          </div>
          <p className="text-xs text-[#cccccc] leading-relaxed">
            {livingInsight}
          </p>
        </div>
        <button
          type="button"
          data-ocid="dashboard.living_insight.action_button"
          onClick={() => navigate({ to: "/ai" })}
          className="text-[10px] font-semibold hover:underline flex-shrink-0"
          style={{ color: "#60a5fa" }}
        >
          AI Hub →
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const {
    heartRate,
    bloodPressure,
    sleep,
    steps,
    connectionStatus,
    deviceName,
    deviceType,
    connectedApps,
    connectedServices,
    isSupported,
    isUnsupported,
    errorMessage,
    connect,
    disconnect,
    setSleep,
    setHeartRate,
    setBloodPressure,
    hrLastRecorded,
    bpLastRecorded,
    sleepLastRecorded,
    hrSource,
    bpSource,
    sleepSource,
  } = useBluetoothHealth();

  const userName = localStorage.getItem("ccx_user_name") || "user";

  // ── Persist PredictionInput to localStorage + dispatch event ──
  const persistHealthLocal = useCallback((input: Record<string, unknown>) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("careconnect_health_latest") ?? "{}",
      );
      const merged = { ...existing, ...input };
      localStorage.setItem("careconnect_health_latest", JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent("careconnect_health_updated"));
    } catch {
      /* silent */
    }
  }, []);

  // ── Load saved health data on mount ──
  useEffect(() => {
    const loadInitial = async () => {
      try {
        if (actor) {
          const result = await actor.get_prediction_input(userName);
          if (result) {
            localStorage.setItem(
              "careconnect_health_latest",
              JSON.stringify(result),
            );
            window.dispatchEvent(new CustomEvent("careconnect_health_updated"));
            if (result.hr_latest !== undefined && result.hr_latest !== null) {
              setHeartRate(result.hr_latest);
            }
            if (
              result.systolic_latest !== undefined &&
              result.systolic_latest !== null &&
              result.diastolic_latest !== undefined &&
              result.diastolic_latest !== null
            ) {
              setBloodPressure({
                systolic: result.systolic_latest,
                diastolic: result.diastolic_latest,
              });
            }
            if (
              result.sleep_latest !== undefined &&
              result.sleep_latest !== null
            ) {
              setSleep(result.sleep_latest);
            }
          }
        } else {
          // Fallback: restore from localStorage
          const saved = localStorage.getItem("careconnect_health_latest");
          if (saved) {
            try {
              const d = JSON.parse(saved);
              if (d.hr_latest != null) setHeartRate(d.hr_latest);
              if (d.systolic_latest != null && d.diastolic_latest != null) {
                setBloodPressure({
                  systolic: d.systolic_latest,
                  diastolic: d.diastolic_latest,
                });
              }
              if (d.sleep_latest != null) setSleep(d.sleep_latest);
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        // Silent fallback
        const saved = localStorage.getItem("careconnect_health_latest");
        if (saved) {
          try {
            const d = JSON.parse(saved);
            if (d.hr_latest != null) setHeartRate(d.hr_latest);
            if (d.systolic_latest != null && d.diastolic_latest != null) {
              setBloodPressure({
                systolic: d.systolic_latest,
                diastolic: d.diastolic_latest,
              });
            }
            if (d.sleep_latest != null) setSleep(d.sleep_latest);
          } catch {
            /* ignore */
          }
        }
      }
    };
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, setHeartRate, setBloodPressure, setSleep, userName]);

  // ── Manual HR submit ──
  const handleHRManualInput = async (bpm: number | null) => {
    if (bpm === null) return;
    setHeartRate(bpm);
    persistHealthLocal({ hr_latest: bpm });
    try {
      if (actor) {
        const res = await actor.add_metric(
          userName,
          "HeartRate",
          bpm,
          "Manual",
        );
        if (res.__kind__ === "ok") {
          localStorage.setItem(
            "careconnect_health_latest",
            JSON.stringify(res.ok),
          );
          window.dispatchEvent(new CustomEvent("careconnect_health_updated"));
        }
      }
    } catch {
      /* silent */
    }
  };

  // ── Manual BP submit ──
  const handleBPManualInput = async (
    bp: { systolic: number; diastolic: number } | null,
  ) => {
    if (!bp) return;
    setBloodPressure(bp);
    persistHealthLocal({
      systolic_latest: bp.systolic,
      diastolic_latest: bp.diastolic,
    });
    try {
      if (actor) {
        const [sRes, dRes] = await Promise.allSettled([
          actor.add_metric(userName, "SystolicBP", bp.systolic, "Manual"),
          actor.add_metric(userName, "DiastolicBP", bp.diastolic, "Manual"),
        ]);
        const last =
          dRes.status === "fulfilled"
            ? dRes.value
            : sRes.status === "fulfilled"
              ? sRes.value
              : null;
        if (last && last.__kind__ === "ok") {
          localStorage.setItem(
            "careconnect_health_latest",
            JSON.stringify(last.ok),
          );
          window.dispatchEvent(new CustomEvent("careconnect_health_updated"));
        }
      }
    } catch {
      /* silent */
    }
  };

  // ── Sleep change handler (triggers backend persist) ──
  const handleSleepInput = async (hours: number | null) => {
    setSleep(hours);
    if (hours === null) return;
    persistHealthLocal({ sleep_latest: hours });
    try {
      if (actor) {
        const res = await actor.add_metric(
          userName,
          "SleepHours",
          hours,
          "Manual",
        );
        if (res.__kind__ === "ok") {
          localStorage.setItem(
            "careconnect_health_latest",
            JSON.stringify(res.ok),
          );
          window.dispatchEvent(new CustomEvent("careconnect_health_updated"));
        }
      }
    } catch {
      /* silent */
    }
  };

  // ── Bluetooth auto-persist with 60s debounce ──
  const btDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (connectionStatus !== "connected") return;
    if (heartRate === null && bloodPressure === null) return;
    if (btDebounceRef.current) clearTimeout(btDebounceRef.current);
    btDebounceRef.current = setTimeout(async () => {
      try {
        const updates: Record<string, unknown> = {};
        if (heartRate !== null) updates.hr_latest = heartRate;
        if (bloodPressure) {
          updates.systolic_latest = bloodPressure.systolic;
          updates.diastolic_latest = bloodPressure.diastolic;
        }
        persistHealthLocal(updates);
        if (actor) {
          const calls: Promise<unknown>[] = [];
          if (heartRate !== null)
            calls.push(
              actor.add_metric(userName, "HeartRate", heartRate, "Bluetooth"),
            );
          if (bloodPressure) {
            calls.push(
              actor.add_metric(
                userName,
                "SystolicBP",
                bloodPressure.systolic,
                "Bluetooth",
              ),
            );
            calls.push(
              actor.add_metric(
                userName,
                "DiastolicBP",
                bloodPressure.diastolic,
                "Bluetooth",
              ),
            );
          }
          await Promise.allSettled(calls);
        }
      } catch {
        /* silent */
      }
    }, 60000);
    return () => {
      if (btDebounceRef.current) clearTimeout(btDebounceRef.current);
    };
  }, [
    heartRate,
    bloodPressure,
    connectionStatus,
    actor,
    userName,
    persistHealthLocal,
  ]);

  const { moodAdaptive, focusModeActive } = useAI();

  const firstName = userName.split(" ")[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isConnected = connectionStatus === "connected";

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Living Dashboard Insight Card — always at the top */}
      <LivingInsightCard />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff]">
            Welcome back, <span className="text-[#f9a8c9]">{firstName}!</span>{" "}
            👋
          </h2>
          <p className="text-sm text-[#888888] mt-1">{today}</p>
        </div>
      </div>

      {/* Daily Mood Banner — hidden in focus mode */}
      {!focusModeActive && <MoodBanner timeMood={moodAdaptive.timeOfDay} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-6" glowColor="teal">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#888888] font-medium uppercase tracking-wider">
                My Health Overview
              </p>
              <h3 className="text-lg font-bold text-[#ffffff] mt-1">
                Health Score
              </h3>
            </div>
          </div>

          {/* Bluetooth Connection Panel */}
          <BluetoothPanel
            isSupported={isSupported}
            isUnsupported={isUnsupported}
            connectionStatus={connectionStatus}
            deviceName={deviceName}
            deviceType={deviceType}
            connectedApps={connectedApps}
            connectedServices={connectedServices}
            heartRate={heartRate}
            bloodPressure={bloodPressure}
            steps={steps}
            errorMessage={errorMessage}
            onConnect={connect}
            onDisconnect={disconnect}
          />

          {/* Health Score Panel — below Bluetooth, above metric tiles */}
          <HealthScorePanel
            heartRate={heartRate}
            bloodPressure={bloodPressure}
            sleep={sleep}
          />

          {/* Metric Tiles — 3 or 4 columns depending on steps availability */}
          <div
            className={`grid gap-3 mt-2 ${
              steps !== null ? "grid-cols-4" : "grid-cols-3"
            }`}
          >
            <HeartRateTile
              value={heartRate}
              lastRecorded={hrLastRecorded}
              source={hrSource}
              onManualInput={handleHRManualInput}
            />
            <BloodPressureTile
              systolic={bloodPressure?.systolic ?? null}
              diastolic={bloodPressure?.diastolic ?? null}
              lastRecorded={bpLastRecorded}
              source={bpSource}
              onManualInput={handleBPManualInput}
            />
            <SleepTile
              value={sleep}
              connected={isConnected}
              lastRecorded={sleepLastRecorded}
              source={sleepSource}
              onManualInput={handleSleepInput}
            />
            <StepsTile value={steps} />
          </div>
        </GlassCard>

        {/* Upcoming & Prescriptions — hidden in focus mode */}
        {!focusModeActive && (
          <div className="space-y-4">
            <GlassCard className="p-5">
              <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-3">
                Upcoming
              </p>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d0d0d] text-xs font-bold flex-shrink-0"
                      style={{ background: apt.color }}
                    >
                      {apt.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#ffffff] truncate">
                        {apt.doctor}
                      </p>
                      <p className="text-[10px] text-[#888888]">
                        {apt.date} · {apt.time}
                      </p>
                    </div>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0"
                      style={{
                        background:
                          apt.status === "confirmed"
                            ? "rgba(249,168,201,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          apt.status === "confirmed" ? "#f9a8c9" : "#F59E0B",
                      }}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-3">
                Prescriptions
              </p>
              <div className="space-y-2.5">
                {prescriptions.slice(0, 2).map((rx) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#ffffff]">
                        {rx.name}
                      </p>
                      <p className="text-[10px] text-[#888888]">{rx.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#f9a8c9]">
                        {rx.daysLeft}d
                      </p>
                      <p className="text-[10px] text-[#888888]">left</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* ── AI Intelligence Summary — after health metrics ── */}
      <AIIntelligenceSummary />

      {/* Quick Actions — hidden in focus mode */}
      {!focusModeActive && (
        <GlassCard className="p-6">
          <p className="text-sm font-semibold text-[#ffffff] mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Stethoscope,
                label: "AI Symptom Checker",
                desc: "Analyze symptoms instantly",
                path: "/symptoms",
                color: "#f9a8c9",
                bg: "rgba(249,168,201,0.1)",
                border: "rgba(249,168,201,0.25)",
                ocid: "dashboard.symptoms.button",
              },
              {
                icon: UserRound,
                label: "Book Doctor",
                desc: "Find & schedule visits",
                path: "/doctors",
                color: "#f9a8c9",
                bg: "rgba(249,168,201,0.1)",
                border: "rgba(249,168,201,0.25)",
                ocid: "dashboard.doctors.button",
              },
              {
                icon: AlertTriangle,
                label: "Emergency Help",
                desc: "SOS & nearby hospitals",
                path: "/emergency",
                color: "#FF4D5A",
                bg: "rgba(255,77,90,0.1)",
                border: "rgba(255,77,90,0.25)",
                ocid: "dashboard.emergency.button",
              },
            ].map((action) => (
              <button
                key={action.path}
                type="button"
                data-ocid={action.ocid}
                onClick={() => navigate({ to: action.path })}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] text-left"
                style={{
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: action.bg,
                    border: `1px solid ${action.border}`,
                  }}
                >
                  <action.icon size={20} style={{ color: action.color }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: action.color }}
                  >
                    {action.label}
                  </p>
                  <p className="text-xs text-[#888888]">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Recent Activity — hidden in focus mode */}
      {!focusModeActive && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#ffffff]">
              Recent Activity
            </p>
            <button
              type="button"
              className="text-xs text-[#f9a8c9] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(249,168,201,0.1)",
                    color: "#f9a8c9",
                  }}
                >
                  {activityIcons[item.type]}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#cccccc]">{item.text}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={10} className="text-[#888888]" />
                    <p className="text-[10px] text-[#888888]">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-4">
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
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#888888]">Help</span>
          <span className="text-xs text-[#888888]">Terms</span>
          <span className="text-xs text-[#888888]">Privacy</span>
          <button
            type="button"
            data-ocid="footer.emergency.button"
            onClick={() => navigate({ to: "/emergency" })}
            className="px-3 py-1 rounded-full text-xs text-[#FF4D5A] font-medium"
            style={{
              background: "rgba(255,77,90,0.1)",
              border: "1px solid rgba(255,77,90,0.3)",
            }}
          >
            Emergency
          </button>
        </div>
      </footer>
    </div>
  );
}

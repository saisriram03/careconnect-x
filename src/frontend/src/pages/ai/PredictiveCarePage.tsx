import type { HealthPrediction, PredictionSeverity } from "@/ai/types";
import { useHealthPredictions } from "@/ai/useHealthPredictions";
import { useNavigate } from "@tanstack/react-router";
import { Activity, ArrowLeft, RefreshCw, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SEVERITY_COLOR: Record<PredictionSeverity, string> = {
  critical: "#fb7185",
  high: "#fbbf24",
  medium: "#60a5fa",
  low: "#34d399",
};

function formatUpdatedAt(ts: number): string {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}

function NoDataState({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="relative max-w-md w-full mx-auto">
        {/* Neural pulse rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: "1px solid rgba(249,168,201,0.3)",
              borderRadius: "24px",
            }}
            animate={{ scale: [1, 1 + ring * 0.06], opacity: [0.4, 0] }}
            transition={{
              duration: 2.4,
              delay: ring * 0.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}
        <div
          data-ocid="predictive_care.empty_state"
          className="relative p-8 rounded-3xl text-center"
          style={{
            background: "rgba(249,168,201,0.06)",
            border: "1px solid rgba(249,168,201,0.25)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 40px rgba(249,168,201,0.08)",
          }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(249,168,201,0.15)",
              border: "1px solid rgba(249,168,201,0.4)",
              boxShadow: "0 0 24px rgba(249,168,201,0.2)",
            }}
            animate={{
              boxShadow: [
                "0 0 24px rgba(249,168,201,0.2)",
                "0 0 40px rgba(249,168,201,0.45)",
                "0 0 24px rgba(249,168,201,0.2)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Activity size={28} style={{ color: "#f9a8c9" }} />
          </motion.div>

          <h2 className="text-xl font-bold text-foreground mb-3">
            No health data yet
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Enter your heart rate, blood pressure, and sleep hours on the
            Dashboard to unlock your AI-powered predictions.
          </p>

          <motion.button
            type="button"
            data-ocid="predictive_care.go_to_dashboard.button"
            onClick={onGoToDashboard}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(249,168,201,0.2)",
              border: "1px solid rgba(249,168,201,0.5)",
              color: "#f9a8c9",
              boxShadow: "0 0 20px rgba(249,168,201,0.15)",
            }}
          >
            Go to Dashboard
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PredictionCard({
  prediction,
  index,
  isActive,
  onClick,
}: {
  prediction: HealthPrediction;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = SEVERITY_COLOR[prediction.severity];
  return (
    <motion.button
      type="button"
      data-ocid={`predictive_care.prediction.${index + 1}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      className="w-full text-left p-4 rounded-2xl transition-all"
      style={{
        background: isActive ? `${color}12` : "rgba(255,255,255,0.04)",
        border: `1px solid ${isActive ? `${color}50` : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(8px)",
        boxShadow: isActive ? `0 0 16px ${color}25` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{prediction.icon}</span>
          <span className="text-sm font-medium text-foreground">
            {prediction.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}35`,
            }}
          >
            {prediction.severity}
          </span>
          <span className="text-sm font-bold" style={{ color }}>
            {prediction.confidence}%
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/10">
        <motion.div
          className="h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${prediction.confidence}%` }}
          transition={{
            delay: index * 0.08 + 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 80,
            damping: 18,
          }}
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
        />
      </div>
    </motion.button>
  );
}

export default function PredictiveCarePage() {
  const navigate = useNavigate();
  const { predictions, hasRealData, refresh } = useHealthPredictions();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const active = predictions[activeIdx] ?? predictions[0];
  const activeColor = active ? SEVERITY_COLOR[active.severity] : "#f9a8c9";

  function handleRefresh() {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-4xl mx-auto">
      {/* Back button */}
      <motion.button
        type="button"
        data-ocid="predictive_care.back.button"
        onClick={() => navigate({ to: "/ai" })}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to AI Hub
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(249,168,201,0.15)",
                border: "1px solid rgba(249,168,201,0.4)",
              }}
            >
              <Sparkles size={18} style={{ color: "#f9a8c9" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Predictive Care Engine
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered health forecasting with confidence scoring
              </p>
              {hasRealData && predictions[0]?.updatedAt ? (
                <p className="text-xs text-muted-foreground mt-1 opacity-70">
                  Last updated: {formatUpdatedAt(predictions[0].updatedAt)}
                </p>
              ) : null}
            </div>
          </div>

          {/* Refresh button */}
          <motion.button
            type="button"
            data-ocid="predictive_care.refresh.button"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl shrink-0 transition-all"
            style={{
              background: "rgba(249,168,201,0.1)",
              border: "1px solid rgba(249,168,201,0.3)",
              color: "#f9a8c9",
            }}
          >
            <motion.span
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { duration: 0.7, ease: "linear" } : {}}
            >
              <RefreshCw size={13} />
            </motion.span>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!hasRealData ? (
          <NoDataState
            key="no-data"
            onGoToDashboard={() => navigate({ to: "/dashboard" })}
          />
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Prediction cards list */}
            <div className="space-y-3">
              {predictions.map((p, i) => (
                <PredictionCard
                  key={p.id}
                  prediction={p}
                  index={i}
                  isActive={activeIdx === i}
                  onClick={() => setActiveIdx(i)}
                />
              ))}
            </div>

            {/* Detail panel */}
            {active ? (
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="p-6 rounded-2xl self-start"
                style={{
                  background: `${activeColor}0a`,
                  border: `1px solid ${activeColor}30`,
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 0 24px ${activeColor}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} style={{ color: activeColor }} />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: activeColor }}
                  >
                    AI Insight
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-1">
                  <motion.div
                    key={active.confidence}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold"
                    style={{
                      color: activeColor,
                      textShadow: `0 0 20px ${activeColor}50`,
                    }}
                  >
                    {active.confidence}%
                  </motion.div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold capitalize"
                    style={{
                      background: `${activeColor}18`,
                      color: activeColor,
                      border: `1px solid ${activeColor}35`,
                    }}
                  >
                    {active.severity}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {active.icon} {active.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {active.explanation}
                </p>

                {active.preventiveAction ? (
                  <div
                    className="p-3 rounded-xl mb-4 text-sm"
                    style={{
                      background: `${activeColor}0e`,
                      border: `1px solid ${activeColor}25`,
                      color: activeColor,
                    }}
                  >
                    <span className="font-semibold">Preventive action: </span>
                    {active.preventiveAction}
                  </div>
                ) : null}

                <div className="text-xs text-muted-foreground italic">
                  Always consult a doctor for medical decisions. AI predictions
                  are for awareness only.
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

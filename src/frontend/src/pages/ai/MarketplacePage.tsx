import {
  Activity,
  Baby,
  Brain,
  Dumbbell,
  Heart,
  Package,
  Salad,
  ShoppingBag,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useAI } from "../../ai/AIContext";
import type { CareModule, CareModuleCategory } from "../../ai/types";

const CATEGORY_META: Record<
  CareModuleCategory,
  { label: string; color: string; bg: string }
> = {
  elderly: {
    label: "Elderly Care",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  maternal: {
    label: "Pregnancy",
    color: "#f9a8d4",
    bg: "rgba(249,168,212,0.12)",
  },
  mental: {
    label: "Mental Health",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
  },
  chronic: {
    label: "Chronic Care",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
  },
  nutrition: {
    label: "Nutrition",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  fitness: { label: "Fitness", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
};

const MODULE_ICONS: Record<string, React.ElementType> = {
  "elderly-care": Users,
  "pregnancy-care": Baby,
  "mental-wellness": Brain,
  "diabetes-monitoring": Activity,
  "nutrition-ai": Salad,
  "fitness-sync": Dumbbell,
  "heart-monitor": Heart,
};

function getModuleIcon(id: string): React.ElementType {
  return MODULE_ICONS[id] ?? Package;
}

function ModuleCard({
  module,
  index,
  onToggle,
}: {
  module: CareModule;
  index: number;
  onToggle: () => void;
}) {
  const cat = CATEGORY_META[module.category];
  const Icon = getModuleIcon(module.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
      data-ocid={`marketplace.module_card.${index + 1}`}
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300"
      style={{
        background: module.enabled
          ? `linear-gradient(135deg, ${cat.bg}, rgba(255,255,255,0.03))`
          : "rgba(255,255,255,0.03)",
        border: module.enabled
          ? `1px solid ${cat.color}40`
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: module.enabled
          ? `0 0 24px ${cat.color}18, inset 0 0 20px ${cat.bg}`
          : "none",
        backdropFilter: "blur(12px)",
      }}
    >
      {module.enabled && (
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${cat.color}20 0%, transparent 70%)`,
            transform: "translate(30%, -30%)",
          }}
        />
      )}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cat.bg, border: `1px solid ${cat.color}30` }}
        >
          <Icon size={20} style={{ color: cat.color }} />
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={
            module.enabled
              ? {
                  background: "rgba(52,211,153,0.15)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.3)",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  color: "#666",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
          }
        >
          {module.enabled ? "● Active" : "○ Available"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
          {module.name}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
          {module.description}
        </p>
      </div>
      <span
        className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: cat.bg,
          color: cat.color,
          border: `1px solid ${cat.color}30`,
        }}
      >
        {cat.label}
      </span>
      {module.features.length > 0 && (
        <ul className="space-y-1">
          {module.features.slice(0, 3).map((feat) => (
            <li
              key={feat}
              className="text-[11px] flex items-center gap-1.5"
              style={{ color: "#666" }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: cat.color }}
              />
              {feat}
            </li>
          ))}
        </ul>
      )}
      <motion.button
        type="button"
        data-ocid={`marketplace.toggle_button.${index + 1}`}
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
        style={
          module.enabled
            ? {
                background: `${cat.color}18`,
                color: cat.color,
                border: `1px solid ${cat.color}40`,
              }
            : {
                background: "rgba(255,255,255,0.06)",
                color: "#aaa",
                border: "1px solid rgba(255,255,255,0.12)",
              }
        }
      >
        {module.enabled ? "Disable Module" : "Enable Module"}
      </motion.button>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const { careModules, toggleCareModule } = useAI();
  const enabledCount = careModules.filter((m) => m.enabled).length;
  const totalCount = careModules.length;
  return (
    <div className="space-y-8 animate-fadeInUp">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(249,168,212,0.12)",
              border: "1px solid rgba(249,168,212,0.35)",
              boxShadow: "0 0 20px rgba(249,168,212,0.15)",
            }}
          >
            <ShoppingBag size={20} style={{ color: "#f9a8d4" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Care Modules Marketplace
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#666" }}>
              Personalise your healthcare with intelligent care plugins
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: "rgba(52,211,153,0.12)",
              color: "#34d399",
              border: "1px solid rgba(52,211,153,0.25)",
            }}
          >
            {enabledCount} active
          </span>
          <span
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#888",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {totalCount - enabledCount} available
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: "#888" }}>Module activation</span>
          <span style={{ color: "#f9a8d4" }}>
            {enabledCount}/{totalCount} enabled
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${totalCount > 0 ? (enabledCount / totalCount) * 100 : 0}%`,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #f9a8d4, #c084fc)" }}
          />
        </div>
      </motion.div>

      <div
        data-ocid="marketplace.module_list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {careModules.map((module, i) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={i}
            onToggle={() => toggleCareModule(module.id)}
          />
        ))}
      </div>

      {careModules.length === 0 && (
        <div
          data-ocid="marketplace.empty_state"
          className="text-center py-16 text-sm"
          style={{ color: "#555" }}
        >
          No care modules available.
        </div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs pb-4"
        style={{ color: "#444" }}
      >
        All care modules are optional and privacy-first. Your health data never
        leaves this device.
      </motion.p>
    </div>
  );
}

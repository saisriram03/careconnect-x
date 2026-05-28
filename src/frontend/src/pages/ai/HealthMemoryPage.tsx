import { AlertCircle, Brain, Lightbulb, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const TIMELINE_EVENTS = [
  {
    id: 1,
    side: "left",
    date: "Today, 09:15",
    type: "symptom",
    icon: "🤒",
    title: "Mild headache reported",
    detail: "Duration: ~2 hrs · Possible cause: dehydration",
  },
  {
    id: 2,
    side: "right",
    date: "Today, 08:00",
    type: "routine",
    icon: "💊",
    title: "Morning medication logged",
    detail: "Vitamin D · Omega-3",
  },
  {
    id: 3,
    side: "left",
    date: "Yesterday, 20:30",
    type: "appointment",
    icon: "📅",
    title: "Doctor booking confirmed",
    detail: "Dr. Patel — General check-up",
  },
  {
    id: 4,
    side: "right",
    date: "Yesterday, 07:45",
    type: "routine",
    icon: "🏃",
    title: "Morning walk logged",
    detail: "32 min · 4,200 steps",
  },
  {
    id: 5,
    side: "left",
    date: "2 days ago, 22:10",
    type: "sleep",
    icon: "🌙",
    title: "Sleep quality: 7.8 hrs",
    detail: "Deep sleep: 2.1 hrs · REM: 1.8 hrs",
  },
  {
    id: 6,
    side: "right",
    date: "3 days ago, 14:00",
    type: "symptom",
    icon: "😮",
    title: "Stress spike detected",
    detail: "Interaction pattern changed for ~45 min",
  },
  {
    id: 7,
    side: "left",
    date: "5 days ago, 10:30",
    type: "appointment",
    icon: "🩺",
    title: "Symptom checker used",
    detail: "Query: sore throat · Outcome: mild, monitor",
  },
  {
    id: 8,
    side: "right",
    date: "1 week ago",
    type: "routine",
    icon: "🥗",
    title: "Dietary change noted",
    detail: "Reduced processed food intake",
  },
];

const AI_RECALLS = [
  { icon: "🔁", text: "You're most active in the app between 8–10 AM." },
  {
    icon: "📈",
    text: "Blood pressure improved significantly after last week's dietary change.",
  },
  {
    icon: "😴",
    text: "Sleep quality improves on days you log physical activity.",
  },
  {
    icon: "📅",
    text: "You've booked a doctor appointment 3 times in the last month.",
  },
  {
    icon: "⚠️",
    text: "Headaches occur more frequently on Monday mornings — possible pattern.",
  },
];

const TYPE_COLORS: Record<string, string> = {
  symptom: "border-rose-400/50",
  routine: "border-teal-400/50",
  appointment: "border-blue-400/50",
  sleep: "border-purple-400/50",
};

const TYPE_DOT: Record<string, string> = {
  symptom: "#f87171",
  routine: "#2dd4bf",
  appointment: "#60a5fa",
  sleep: "#c084fc",
};

export default function HealthMemoryPage() {
  const [query, setQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [events, setEvents] = useState(TIMELINE_EVENTS);

  const filtered = query
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.detail.toLowerCase().includes(query.toLowerCase()),
      )
    : events;

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-7 h-7 text-purple-400" />
          <h1 className="text-2xl font-bold">AI Health Memory</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Your personalized health timeline and AI-recalled patterns.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search memories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-ocid="memory.search_input"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/15 focus:outline-none focus:border-pink-400/50 transition-colors"
        />
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-semibold mb-6">Health Timeline</h3>
        <div className="relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "rgba(249,168,212,0.25)" }}
          />
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <div
                  className="text-center py-12 text-muted-foreground text-sm"
                  data-ocid="memory.empty_state"
                >
                  No memories found.
                </div>
              ) : (
                filtered.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{
                      opacity: 0,
                      x: event.side === "left" ? -20 : 20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className={`flex ${event.side === "left" ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}
                  >
                    <div
                      className={`relative backdrop-blur-md bg-white/10 border rounded-xl p-4 w-full max-w-xs ${TYPE_COLORS[event.type]}`}
                    >
                      <div
                        className="absolute top-4 w-3 h-3 rounded-full border-2 border-background"
                        style={{
                          background: TYPE_DOT[event.type],
                          [event.side === "left" ? "right" : "left"]:
                            "calc(-6% - 6px)",
                        }}
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{event.icon}</span>
                        <span className="font-semibold text-sm">
                          {event.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {event.detail}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: TYPE_DOT[event.type] }}
                      >
                        {event.date}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Recalls */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">AI Recalls</h3>
        </div>
        <div className="space-y-3">
          {AI_RECALLS.map((r, i) => (
            <motion.div
              key={r.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            data-ocid="memory.reset_button"
            className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Memories
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">
              Clear all memories? This cannot be undone.
            </span>
            <button
              type="button"
              onClick={() => {
                setEvents([]);
                setShowConfirm(false);
              }}
              data-ocid="memory.confirm_reset"
              className="rounded-lg bg-red-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 transition-colors"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              data-ocid="memory.cancel_reset"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

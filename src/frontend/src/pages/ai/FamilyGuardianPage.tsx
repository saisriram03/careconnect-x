import { Clock, Heart, Phone, Plus, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FAMILY = [
  {
    id: 1,
    name: "Margaret Wilson",
    role: "Elderly Parent",
    age: 72,
    lastCheckin: "12 min ago",
    status: "Good",
    statusColor: "#22c55e",
    emoji: "👴",
    phone: "tel:+15550001111",
    pulseActive: true,
  },
  {
    id: 2,
    name: "Oliver Wilson",
    role: "Child",
    age: 9,
    lastCheckin: "1 hr ago",
    status: "Active",
    statusColor: "#14b8a6",
    emoji: "👦",
    phone: "tel:+15550002222",
    pulseActive: true,
  },
  {
    id: 3,
    name: "Priya Wilson",
    role: "Spouse",
    age: 38,
    lastCheckin: "Just now",
    status: "Excellent",
    statusColor: "#f9a8d4",
    emoji: "👩",
    phone: "tel:+15550003333",
    pulseActive: true,
  },
];

const REMINDERS = [
  {
    id: 1,
    text: "Margaret — Blood pressure medication",
    time: "08:00 AM",
    icon: "💊",
    color: "text-rose-400",
  },
  {
    id: 2,
    text: "Oliver — School wellness check",
    time: "09:30 AM",
    icon: "🏫",
    color: "text-blue-400",
  },
  {
    id: 3,
    text: "Priya — Annual check-up appointment",
    time: "02:00 PM",
    icon: "🏥",
    color: "text-teal-400",
  },
  {
    id: 4,
    text: "Margaret — Evening walk reminder",
    time: "05:30 PM",
    icon: "🚶",
    color: "text-amber-400",
  },
];

const EMERGENCY_CONTACTS = [
  {
    name: "Dr. Anaya Sharma",
    role: "Family GP",
    phone: "tel:+15550010001",
    color: "#22c55e",
  },
  {
    name: "City General Hospital",
    role: "Emergency",
    phone: "tel:911",
    color: "#ef4444",
  },
  {
    name: "HealthLine Support",
    role: "24/7 Medical Line",
    phone: "tel:+15550020002",
    color: "#f9a8d4",
  },
];

export default function FamilyGuardianPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-7 h-7 text-pink-400" />
          <h1 className="text-2xl font-bold">Family Guardian</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Monitor and protect your loved ones.
        </p>
      </div>

      {/* Network SVG */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 overflow-hidden">
        <svg
          viewBox="0 0 320 120"
          className="w-full"
          style={{ height: 120 }}
          role="img"
          aria-label="Family network"
        >
          {[
            [160, 30, 60, 90],
            [160, 30, 260, 90],
            [60, 90, 260, 90],
          ].map(([x1, y1, x2, y2], i) => (
            <motion.line
              key={`line-${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#f9a8d4"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
            />
          ))}
          {FAMILY.map((m, i) => {
            const cx = i === 0 ? 160 : i === 1 ? 60 : 260;
            const cy = i === 0 ? 30 : 90;
            return (
              <g key={m.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={18}
                  fill="rgba(249,168,212,0.1)"
                  stroke="#f9a8d4"
                  strokeWidth="1"
                />
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">
                  {m.emoji}
                </text>
                <circle
                  cx={cx}
                  cy={cy}
                  r={22}
                  fill="none"
                  stroke={m.statusColor}
                  strokeWidth="1"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="22;28;22"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x={cx}
                  y={cy + 32}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {m.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Member cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FAMILY.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`family.member.${i + 1}`}
          >
            <button
              type="button"
              className="w-full text-left backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 transition-all duration-200 hover:border-pink-400/40"
              onClick={() =>
                setExpanded(expanded === member.id ? null : member.id)
              }
              style={{
                boxShadow:
                  expanded === member.id
                    ? "0 0 18px rgba(249,168,212,0.15)"
                    : "none",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{member.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role} · Age {member.age}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${member.statusColor}20`,
                    color: member.statusColor,
                    border: `1px solid ${member.statusColor}40`,
                  }}
                >
                  {member.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Last check-in: {member.lastCheckin}</span>
              </div>
            </button>
            <AnimatePresence>
              {expanded === member.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {["Heart Rate", "Sleep", "Activity"].map((metric, j) => (
                        <div key={metric} className="text-center">
                          <Heart className="w-3 h-3 mx-auto mb-1 text-pink-400" />
                          <p className="text-xs font-semibold text-pink-300">
                            {j === 0 ? "72 bpm" : j === 1 ? "7.2 h" : "Active"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {metric}
                          </p>
                        </div>
                      ))}
                    </div>
                    <a
                      href={member.phone}
                      data-ocid={`family.call_button.${i + 1}`}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: "rgba(249,168,212,0.12)",
                        border: "1px solid rgba(249,168,212,0.3)",
                        color: "#f9a8d4",
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call {member.name.split(" ")[0]}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Reminders */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Shared Reminders</h3>
          <button
            type="button"
            data-ocid="family.add_reminder_button"
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "#f9a8d4" }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {REMINDERS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-xl">{r.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${r.color}`}>{r.text}</p>
                <p className="text-xs text-muted-foreground">{r.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          {EMERGENCY_CONTACTS.map((contact, i) => (
            <div
              key={contact.name}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${contact.color}25`,
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: contact.color }}
                >
                  {contact.name}
                </p>
                <p className="text-xs text-muted-foreground">{contact.role}</p>
              </div>
              <a
                href={contact.phone}
                data-ocid={`family.emergency_call.${i + 1}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: `${contact.color}20`,
                  border: `1px solid ${contact.color}40`,
                  color: contact.color,
                }}
              >
                <Phone className="w-3 h-3" />
                Call
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

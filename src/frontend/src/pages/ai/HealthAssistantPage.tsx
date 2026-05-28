import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const CANNED_RESPONSES: Record<string, string> = {
  default:
    "I'm your AI health companion. I can answer health questions, explain symptoms, or suggest when to see a doctor. How can I help you today?",
  headache:
    "Headaches have many causes — dehydration, tension, eye strain, or poor sleep are common. If your headache is severe, sudden, or accompanied by vision changes, please see a doctor promptly.",
  tired:
    "Fatigue can stem from poor sleep quality, low iron, dehydration, or stress. Try maintaining consistent sleep times and drinking 2–3L of water daily. If tiredness persists, consult your GP.",
  fever:
    "A fever above 38°C is your body fighting infection. Rest, hydrate well, and take paracetamol if needed. Seek medical care if fever exceeds 39.5°C or lasts more than 3 days.",
  chest:
    "Chest discomfort should never be ignored. If you experience tightness, pressure, or pain — especially with shortness of breath — please call emergency services immediately.",
  sleep:
    "Good sleep hygiene includes consistent bedtimes, limiting screens before bed, and keeping your room cool and dark. Most adults need 7–9 hours per night.",
  stress:
    "Chronic stress affects heart health, immunity, and mental well-being. Mindfulness, exercise, and talking to someone you trust are effective strategies. A therapist can also provide structured support.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("headache") || lower.includes("head"))
    return CANNED_RESPONSES.headache;
  if (lower.includes("tired") || lower.includes("fatigue"))
    return CANNED_RESPONSES.tired;
  if (lower.includes("fever") || lower.includes("temperature"))
    return CANNED_RESPONSES.fever;
  if (lower.includes("chest")) return CANNED_RESPONSES.chest;
  if (lower.includes("sleep")) return CANNED_RESPONSES.sleep;
  if (lower.includes("stress") || lower.includes("anxious"))
    return CANNED_RESPONSES.stress;
  return "That's a great question. Based on general health guidelines, I recommend consulting your doctor for a personalised assessment. I can also help you find a doctor in the Doctor Booking section.";
}

type Message = { id: string; role: "user" | "ai"; text: string };

export default function HealthAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome-1", role: "ai", text: CANNED_RESPONSES.default },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: "user",
        text,
      },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role: "ai",
          text: getResponse(text),
        },
      ]);
      setTyping(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-2xl mx-auto px-4 py-8">
      <motion.button
        type="button"
        data-ocid="health_assistant.back.button"
        onClick={() => navigate({ to: "/ai" })}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors self-start"
      >
        <ArrowLeft size={16} /> Back to AI Hub
      </motion.button>

      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.4)",
          }}
        >
          <MessageCircle size={18} style={{ color: "#34d399" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Conversational Health Assistant
          </h1>
          <p className="text-xs text-muted-foreground">
            AI health guidance • Always encourage doctor consultation
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0 max-h-[55vh] pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={{
                background:
                  msg.role === "user"
                    ? "rgba(249,168,201,0.2)"
                    : "rgba(52,211,153,0.1)",
                border:
                  msg.role === "user"
                    ? "1px solid rgba(249,168,201,0.3)"
                    : "1px solid rgba(52,211,153,0.25)",
                color: msg.role === "user" ? "#f9a8c9" : "var(--foreground)",
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-[#34d399] inline-block"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.8,
                      delay: d * 0.15,
                    }}
                  />
                ))}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          data-ocid="health_assistant.input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about symptoms, medications, or wellness..."
          className="flex-1 px-4 py-3 rounded-xl text-sm bg-card/60 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#34d399]/50"
        />
        <motion.button
          type="button"
          data-ocid="health_assistant.send.button"
          whileTap={{ scale: 0.9 }}
          onClick={send}
          className="px-4 py-3 rounded-xl"
          style={{
            background: "rgba(52,211,153,0.2)",
            border: "1px solid rgba(52,211,153,0.4)",
            color: "#34d399",
          }}
        >
          <Send size={16} />
        </motion.button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        ⚕️ AI responses are informational only. Always consult a qualified
        doctor.
      </p>
    </div>
  );
}

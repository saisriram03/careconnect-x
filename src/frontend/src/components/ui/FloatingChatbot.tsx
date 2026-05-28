import { MessageCircle, Send, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

// Module-level persistence — survives navigation
let persistedMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm CareConnect AI, your personal health assistant. I can help you with symptoms, medications, booking doctors, first aid, and much more. What's on your mind today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const QUICK_REPLIES = [
  "Check my symptoms",
  "Book a doctor",
  "First aid advice",
  "Medicine info",
];

type HistoryEntry = { sender: "user" | "bot"; text: string };

function buildContext(history: HistoryEntry[]): string {
  const last3 = history.slice(-3);
  return last3
    .map((m) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
    .join("\n");
}

async function getAIResponse(
  input: string,
  history: HistoryEntry[],
): Promise<string> {
  const lower = input.toLowerCase();
  const ctx = buildContext(history);
  const recentlyDiscussed = ctx.toLowerCase();

  // Simulate AI thinking delay
  const delay = 1000 + Math.random() * 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Emergency — always highest priority
  if (
    lower.includes("chest pain") ||
    lower.includes("heart attack") ||
    lower.includes("can't breathe") ||
    lower.includes("cannot breathe") ||
    lower.includes("stroke") ||
    lower.includes("unconscious") ||
    lower.includes("emergency")
  ) {
    return "⚠️ This sounds like a medical emergency. Please call 112 immediately or ask someone to take you to the nearest emergency room right away. Do not drive yourself. Our Emergency screen can show you the closest hospitals — navigate there now for directions. Are you safe right now?";
  }

  // Context-aware follow-up — pain after headache discussion
  if (
    lower.includes("pain") ||
    lower.includes("hurts") ||
    lower.includes("ache")
  ) {
    if (
      recentlyDiscussed.includes("headache") ||
      recentlyDiscussed.includes("migraine")
    ) {
      return "Based on our headache discussion, the pain you're describing may be part of the same episode. Persistent or worsening head pain lasting more than 72 hours warrants a doctor visit, especially if it's accompanied by light sensitivity or nausea. Would you like me to help you book a neurologist or check your symptoms through our AI Symptom Checker?";
    }
    if (
      recentlyDiscussed.includes("fever") ||
      recentlyDiscussed.includes("cold") ||
      recentlyDiscussed.includes("flu")
    ) {
      return "Body aches alongside fever are very common with viral infections and are your immune system's response. Rest, stay hydrated, and paracetamol can help ease the discomfort. If the aches are severe or concentrated in one area, that's worth checking out. How are your other symptoms progressing?";
    }
    return "I'd like to understand your pain better. Could you tell me where exactly you're experiencing the pain, how long it's been going on, and if it's constant or comes and goes? This will help me give you more accurate guidance. On a scale of 1–10, how intense is it?";
  }

  // Headache / migraine
  if (
    lower.includes("headache") ||
    lower.includes("migraine") ||
    lower.includes("head hurts")
  ) {
    return "Headaches can have many causes — tension, dehydration, eye strain, or migraines. Try drinking a glass of water, resting in a quiet dark room, and a mild over-the-counter pain reliever if needed. If your headache is severe, sudden (described as the 'worst headache of your life'), or accompanied by fever and stiff neck, please seek emergency care immediately. How long have you had this headache?";
  }

  // Fever / cold / flu
  if (
    lower.includes("fever") ||
    lower.includes("cold") ||
    lower.includes("flu") ||
    lower.includes("cough") ||
    lower.includes("runny nose") ||
    lower.includes("sore throat")
  ) {
    return "Sounds like you might be dealing with a cold or flu. Rest is your best medicine — aim for 8+ hours of sleep, drink plenty of warm fluids, and paracetamol can bring down fever and relieve aches. Most viral illnesses resolve in 5–7 days. However, if your fever goes above 39.5°C, persists more than 3 days, or you have difficulty breathing, please consult a doctor. What are your specific symptoms?";
  }

  // Mental health / stress / anxiety
  if (
    lower.includes("anxious") ||
    lower.includes("anxiety") ||
    lower.includes("stress") ||
    lower.includes("depressed") ||
    lower.includes("depression") ||
    lower.includes("mental health") ||
    lower.includes("panic") ||
    lower.includes("worried") ||
    lower.includes("sad")
  ) {
    return "Your mental health matters just as much as your physical health — thank you for bringing this up. Stress and anxiety are very common, and there are effective ways to manage them: deep breathing exercises, limiting caffeine, regular physical activity, and talking to someone you trust can all make a real difference. *Disclaimer: This is general wellness guidance, not a clinical diagnosis.* Would you like tips on breathing techniques, or would you prefer I help you book a mental health consultation?";
  }

  // Sleep issues
  if (
    lower.includes("sleep") ||
    lower.includes("insomnia") ||
    lower.includes("can't sleep") ||
    lower.includes("tired") ||
    lower.includes("fatigue")
  ) {
    return "Poor sleep can significantly impact your overall health and immune system. Some evidence-backed tips: keep a consistent sleep schedule even on weekends, avoid screens 1 hour before bed, keep your room cool and dark, and avoid caffeine after 2pm. If you've been experiencing insomnia for more than 3 weeks, it's worth speaking to a doctor as it could indicate an underlying condition. How many hours are you typically getting per night?";
  }

  // Diet and nutrition
  if (
    lower.includes("diet") ||
    lower.includes("nutrition") ||
    lower.includes("weight") ||
    lower.includes("eat") ||
    lower.includes("food") ||
    lower.includes("vitamin") ||
    lower.includes("supplement")
  ) {
    return "Good nutrition is the foundation of good health. A balanced diet rich in colorful vegetables, lean proteins, whole grains, and healthy fats can prevent a wide range of chronic diseases. If you're looking to manage your weight, small sustainable changes work better than crash diets. *Disclaimer: For personalized dietary plans, consulting a registered nutritionist is recommended.* Are you trying to achieve a specific health goal with your diet?";
  }

  // Medication questions
  if (
    lower.includes("medication") ||
    lower.includes("medicine") ||
    lower.includes("tablet") ||
    lower.includes("drug") ||
    lower.includes("prescription") ||
    lower.includes("dosage") ||
    lower.includes("side effect")
  ) {
    return "I can share general information about medications, but for specific dosage and interaction questions, always defer to your pharmacist or prescribing doctor. You can also check our Medicine Delivery section for verified pharmacy information. *Disclaimer: Never change or stop a prescribed medication without consulting your doctor.* What medication did you have a question about?";
  }

  // Booking a doctor
  if (
    lower.includes("book") ||
    lower.includes("appointment") ||
    lower.includes("doctor") ||
    lower.includes("specialist") ||
    lower.includes("consultation")
  ) {
    return "Booking a doctor through CareConnect X is easy! Head to the Doctor Booking section where you can browse 89+ specialists, select your condition, choose a convenient date and time, and receive a digital prescription after your consultation. We have both government and private hospital options. Would you like me to guide you to the booking page, or do you need help choosing the right specialist for your condition?";
  }

  // Emergency triage
  if (
    lower.includes("urgent") ||
    lower.includes("serious") ||
    lower.includes("hospital") ||
    lower.includes("ambulance") ||
    lower.includes("near me")
  ) {
    return "For urgent medical needs, go directly to our Emergency screen which uses your GPS to show all nearby hospitals sorted by distance, with one-tap directions and call buttons. For life-threatening emergencies, always call 112 first. Is this an urgent situation right now, or are you looking for general hospital information?";
  }

  // Lab results / medical records
  if (
    lower.includes("lab") ||
    lower.includes("test result") ||
    lower.includes("blood test") ||
    lower.includes("report") ||
    lower.includes("record") ||
    lower.includes("scan") ||
    lower.includes("mri") ||
    lower.includes("x-ray")
  ) {
    return "You can upload your medical records, lab reports, and scans in our Medical Records section. Our AI assistant will analyze the file and provide step-by-step guidance on what your results mean and what next steps to consider. *Disclaimer: AI analysis is informational only — always discuss results with your treating physician.* Would you like help uploading a report, or do you have specific values you'd like me to explain?";
  }

  // First aid
  if (
    lower.includes("first aid") ||
    lower.includes("wound") ||
    lower.includes("bleeding") ||
    lower.includes("burn") ||
    lower.includes("cut") ||
    lower.includes("injury") ||
    lower.includes("broken") ||
    lower.includes("fracture")
  ) {
    return "For immediate first aid guidance, our First Aid AI screen is available to everyone — no login required. You can upload a photo of a wound and receive step-by-step treatment instructions with severity assessment. For general cuts: clean with water, apply gentle pressure, use an antiseptic, and cover with a clean bandage. *Disclaimer: For serious injuries, please seek emergency care.* Do you need first aid advice for a current situation?";
  }

  // Symptom checker
  if (
    lower.includes("symptom") ||
    lower.includes("sick") ||
    lower.includes("unwell") ||
    lower.includes("not feeling well")
  ) {
    return "Describing your symptoms is a great first step. You can use our AI Symptom Checker for a detailed analysis — it assesses your symptoms, suggests possible conditions, and tells you whether you need urgent, routine, or self-care treatment. To give you a quick read right now: how long have you been feeling unwell, and what are your main symptoms?";
  }

  // Greetings and general
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("how are you") ||
    lower.includes("good morning") ||
    lower.includes("good evening")
  ) {
    return "Hello! I'm doing well and ready to help you. CareConnect X is here to make healthcare simpler — whether you need symptom guidance, want to book a doctor, need first aid advice, or want to find a nearby hospital. Everything is just a tap away. What can I help you with today?";
  }

  // Fallback
  return "That's a great question. I'm here to help with a wide range of health topics — symptoms, medications, doctor bookings, first aid, nutrition, mental wellness, and more. Could you share a bit more detail about what you're experiencing or looking for? The more context you give me, the better I can assist you.";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hoverColor(el: EventTarget & HTMLButtonElement, color: string): void {
  el.style.color = color;
}

function hoverBg(
  el: EventTarget & HTMLButtonElement,
  bg: string,
  border: string,
): void {
  el.style.background = bg;
  el.style.borderColor = border;
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(persistedMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local state with module-level persistence
  useEffect(() => {
    persistedMessages = messages;
  }, [messages]);

  // Auto-scroll to bottom whenever messages or typing state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger on typing state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const userMessageCount = messages.filter((m) => m.sender === "user").length;
  const showQuickReplies = userMessageCount <= 1 && !isTyping;

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text ?? input;
      if (!messageText.trim() || isTyping) return;

      const userMsg: Message = {
        id: Date.now(),
        text: messageText,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));
      history.push({ sender: "user", text: messageText });

      try {
        const response = await getAIResponse(messageText, history);
        const botMsg: Message = {
          id: Date.now() + 1,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, messages],
  );

  const clearChat = useCallback(() => {
    const initial: Message[] = [
      {
        id: Date.now(),
        text: "Hello! I'm CareConnect AI, your personal health assistant. I can help you with symptoms, medications, booking doctors, first aid, and much more. What's on your mind today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ];
    setMessages(initial);
    persistedMessages = initial;
  }, []);

  return (
    <div
      className="absolute right-6 z-50"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {open && (
        <div
          data-ocid="chatbot.panel"
          className="absolute bottom-16 right-0 animate-slideUp"
          style={{
            width: "min(340px, calc(100vw - 3rem))",
            height: "min(480px, 70dvh)",
            background: "#0a0a0a",
            border: "1px solid rgba(56,230,208,0.3)",
            borderRadius: "16px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(249,168,201,0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(56,230,208,0.15)",
              background: "rgba(249,168,201,0.06)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#f9a8c9",
                  animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#F2F6FF" }}
              >
                CareConnect AI
              </span>
              <span
                style={{
                  fontSize: "10px",
                  background: "rgba(249,168,201,0.15)",
                  color: "#f9a8c9",
                  padding: "1px 6px",
                  borderRadius: "99px",
                  border: "1px solid rgba(249,168,201,0.3)",
                }}
              >
                AI
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                data-ocid="chatbot.delete_button"
                onClick={clearChat}
                title="Clear conversation"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "11px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => hoverColor(e.currentTarget, "#f9a8c9")}
                onMouseLeave={(e) => hoverColor(e.currentTarget, "#555")}
              >
                <Trash2 size={12} />
                <span>Clear</span>
              </button>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#7F8A9B",
                  padding: "2px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => hoverColor(e.currentTarget, "#F2F6FF")}
                onMouseLeave={(e) => hoverColor(e.currentTarget, "#7F8A9B")}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "9px 12px",
                    borderRadius:
                      msg.sender === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    fontSize: "12px",
                    lineHeight: "1.55",
                    background:
                      msg.sender === "user"
                        ? "#f9a8c9"
                        : "rgba(255,255,255,0.06)",
                    color: msg.sender === "user" ? "#000000" : "#cccccc",
                    fontWeight: msg.sender === "user" ? 500 : 400,
                    border:
                      msg.sender === "bot"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#444",
                    marginTop: "3px",
                    paddingLeft: msg.sender === "bot" ? "4px" : "0",
                    paddingRight: msg.sender === "user" ? "4px" : "0",
                  }}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#f9a8c9",
                        display: "inline-block",
                        animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          {showQuickReplies && (
            <div
              style={{
                padding: "0 12px 8px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  style={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    background: "rgba(249,168,201,0.1)",
                    border: "1px solid rgba(249,168,201,0.35)",
                    color: "#f9a8c9",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) =>
                    hoverBg(
                      e.currentTarget,
                      "rgba(249,168,201,0.2)",
                      "rgba(249,168,201,0.6)",
                    )
                  }
                  onMouseLeave={(e) =>
                    hoverBg(
                      e.currentTarget,
                      "rgba(249,168,201,0.1)",
                      "rgba(249,168,201,0.35)",
                    )
                  }
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(56,230,208,0.15)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexShrink: 0,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <input
              ref={inputRef}
              data-ocid="chatbot.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isTyping && sendMessage()}
              placeholder="Ask me anything about your health..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(160,190,210,0.15)",
                borderRadius: "99px",
                padding: "8px 14px",
                fontSize: "12px",
                color: "#F2F6FF",
                outline: "none",
                transition: "border-color 0.2s",
                opacity: isTyping ? 0.5 : 1,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,230,208,0.4)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(160,190,210,0.15)";
              }}
            />
            <button
              type="button"
              data-ocid="chatbot.submit_button"
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  isTyping || !input.trim()
                    ? "rgba(249,168,201,0.3)"
                    : "#f9a8c9",
                border: "none",
                cursor: isTyping || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isTyping && input.trim()) {
                  e.currentTarget.style.transform = "scale(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Send
                size={13}
                style={{
                  color: isTyping || !input.trim() ? "#888" : "#000000",
                }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Typing animation keyframes injected via style tag */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      {/* Floating button */}
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={() => setOpen(!open)}
        className="glow-teal"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#f9a8c9",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(249,168,201,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(249,168,201,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,168,201,0.4)";
        }}
      >
        {open ? (
          <X size={22} style={{ color: "#000000" }} />
        ) : (
          <MessageCircle size={22} style={{ color: "#000000" }} />
        )}
      </button>
    </div>
  );
}

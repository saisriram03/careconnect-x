import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SUGGESTIONS = [
  "What's my health score today?",
  "Book a doctor appointment",
  "Show my medications",
  "Find nearby hospitals",
];

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const toggle = () => {
    if (active) {
      setActive(false);
      if (!transcript) return;
      setResponse(
        "Voice commands are simulated in this demo. In a live deployment, this would process your health query and respond intelligently. Please use the Symptom Checker for medical questions.",
      );
    } else {
      setActive(true);
      setTranscript("");
      setResponse("");
      // Simulate transcript after 2s
      setTimeout(() => setTranscript("Tell me my health score..."), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="self-start">
        <motion.button
          type="button"
          data-ocid="voice_assistant.back.button"
          onClick={() => navigate({ to: "/ai" })}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to AI Hub
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 w-full"
      >
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Voice Care Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Hands-free AI health interaction
        </p>
      </motion.div>

      {/* Waveform / orb */}
      <div className="relative mb-10">
        <motion.button
          type="button"
          className="w-32 h-32 rounded-full flex items-center justify-center cursor-pointer"
          animate={
            active
              ? {
                  boxShadow: [
                    "0 0 20px rgba(192,132,252,0.4)",
                    "0 0 60px rgba(192,132,252,0.6)",
                    "0 0 20px rgba(192,132,252,0.4)",
                  ],
                }
              : { boxShadow: "0 0 20px rgba(192,132,252,0.2)" }
          }
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          style={{
            background: active
              ? "rgba(192,132,252,0.2)"
              : "rgba(192,132,252,0.08)",
            border: "2px solid rgba(192,132,252,0.4)",
          }}
          onClick={toggle}
          aria-label={active ? "Stop listening" : "Start voice assistant"}
        >
          {active ? (
            <Mic size={40} style={{ color: "#c084fc" }} />
          ) : (
            <MicOff size={40} style={{ color: "#c084fc", opacity: 0.6 }} />
          )}
        </motion.button>
        {active &&
          ["-20px", "20px", "-35px", "35px"].map((x, i) => (
            <motion.div
              key={x}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#c084fc",
                marginLeft: -3,
                marginTop: -3,
              }}
              animate={{
                x,
                y: [-20 + i * 10, 20 - i * 10, -20 + i * 10],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.2 + i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      <motion.button
        type="button"
        data-ocid="voice_assistant.toggle.button"
        onClick={toggle}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-3 rounded-2xl font-medium mb-8"
        style={{
          background: active
            ? "rgba(251,113,133,0.15)"
            : "rgba(192,132,252,0.15)",
          border: `1px solid ${active ? "rgba(251,113,133,0.4)" : "rgba(192,132,252,0.4)"}`,
          color: active ? "#fb7185" : "#c084fc",
        }}
      >
        {active ? "Stop Listening" : "Start Listening"}
      </motion.button>

      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl mb-4 text-center"
          style={{
            background: "rgba(192,132,252,0.08)",
            border: "1px solid rgba(192,132,252,0.25)",
          }}
        >
          <p className="text-sm italic text-muted-foreground">
            "<span style={{ color: "#c084fc" }}>{transcript}</span>"
          </p>
        </motion.div>
      )}

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl"
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.25)",
          }}
        >
          <p className="text-sm text-foreground">{response}</p>
        </motion.div>
      )}

      {!active && !response && (
        <div className="w-full space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Try saying
          </p>
          {SUGGESTIONS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-3 rounded-xl text-sm text-muted-foreground text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              "{s}"
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

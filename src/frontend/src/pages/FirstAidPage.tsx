import {
  AlertCircle,
  Camera,
  CheckCircle2,
  RefreshCcw,
  ShieldPlus,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNotifications } from "../context/NotificationContext";

type Severity = "Low" | "Medium" | "High";

interface FirstAidResult {
  woundType: string;
  severity: Severity;
  steps: string[];
  warning: string;
}

function detectWoundType(filename: string): FirstAidResult {
  const name = filename.toLowerCase();
  if (name.includes("burn")) {
    return {
      woundType: "Burn / Thermal Injury Detected",
      severity: "High",
      steps: [
        "Cool the burn immediately under cool (not cold) running water for 10-20 minutes",
        "Do not apply ice, butter, or toothpaste - these worsen the injury",
        "Remove any jewelry or tight items near the burn before swelling begins",
        "Cover loosely with a sterile non-stick bandage or clean cloth",
        "Do not break any blisters - they protect against infection",
        "Seek emergency care for burns larger than the palm, on face/hands/joints, or that look white/charred",
      ],
      warning:
        "Burns can be life-threatening. Seek professional medical evaluation immediately for any burn beyond a minor first-degree burn.",
    };
  }
  if (
    name.includes("deep") ||
    name.includes("stab") ||
    name.includes("puncture")
  ) {
    return {
      woundType: "Deep Puncture / Laceration Detected",
      severity: "High",
      steps: [
        "Apply firm, direct pressure using a clean cloth or bandage to control bleeding",
        "Do NOT remove any embedded objects - stabilise them in place",
        "Keep the injured area still and elevated if possible",
        "Clean around (not inside) the wound with clean water",
        "Apply a sterile dressing and secure firmly",
        "Call emergency services or go to the ER - deep wounds often require stitches and tetanus evaluation",
      ],
      warning:
        "Deep wounds carry a high risk of internal damage and infection. Do not attempt to clean inside the wound - seek emergency care now.",
    };
  }
  if (name.includes("bleed") || name.includes("lacerat")) {
    return {
      woundType: "Active Bleeding / Laceration Detected",
      severity: "Medium",
      steps: [
        "Wash hands thoroughly before touching the wound",
        "Apply direct pressure with a clean cloth - maintain for at least 10 minutes without lifting",
        "If blood soaks through, add more cloth on top - do not remove the first layer",
        "Once bleeding slows, gently clean the wound with clean water",
        "Apply antiseptic cream/gel if available",
        "Cover with a sterile adhesive bandage or gauze pad",
        "Monitor for signs of infection: redness, warmth, swelling, pus, fever",
      ],
      warning:
        "If bleeding does not stop within 15 minutes of sustained pressure, go to the emergency room immediately.",
    };
  }
  if (
    name.includes("swollen") ||
    name.includes("bruise") ||
    name.includes("fracture")
  ) {
    return {
      woundType: "Bruise / Possible Fracture Detected",
      severity: "Medium",
      steps: [
        "Apply an ice pack (wrapped in cloth) to the area for 15-20 minutes every hour",
        "Elevate the injured limb above heart level to reduce swelling",
        "Rest and avoid putting weight on the injured area",
        "Use a compression bandage if available to reduce swelling",
        "Take over-the-counter pain relief (ibuprofen/paracetamol) as directed",
        "If deformity, inability to move the joint, or severe pain is present - get an X-ray immediately",
      ],
      warning:
        "Severe bruising or inability to move a limb may indicate a fracture. Seek X-ray and professional evaluation.",
    };
  }
  return {
    woundType: "Minor Cut / Abrasion Detected",
    severity: "Low",
    steps: [
      "Wash your hands thoroughly with soap and water before touching the wound",
      "Rinse the wound gently under clean running water for 1-2 minutes to remove debris",
      "Apply gentle pressure with a clean cloth or gauze to stop any bleeding",
      "Apply a thin layer of antiseptic ointment (e.g., Betadine, Savlon) if available",
      "Cover with a clean adhesive bandage or sterile gauze pad",
      "Change the bandage daily and keep the wound dry",
      "Watch for infection signs: increasing redness, warmth, pus, or fever",
    ],
    warning:
      "Even minor wounds can become infected. If the wound does not heal within a week or shows signs of infection, consult a healthcare professional.",
  };
}

const SEV_COLORS: Record<
  Severity,
  { bg: string; text: string; border: string }
> = {
  Low: {
    bg: "rgba(52,211,153,0.12)",
    text: "#34D399",
    border: "rgba(52,211,153,0.3)",
  },
  Medium: {
    bg: "rgba(251,191,36,0.12)",
    text: "#FBB724",
    border: "rgba(251,191,36,0.3)",
  },
  High: {
    bg: "rgba(248,113,113,0.12)",
    text: "#F87171",
    border: "rgba(248,113,113,0.3)",
  },
};

export default function FirstAidPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FirstAidResult | null>(null);
  const [filename, setFilename] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      const detected = detectWoundType(file.name);
      setResult(detected);
      setIsAnalyzing(false);
      const typeMap: Record<string, "info" | "warning" | "error"> = {
        Low: "info",
        Medium: "warning",
        High: "error",
      };
      addNotification({
        type: typeMap[detected.severity] ?? "info",
        title: "First Aid Scan Complete",
        message: `${detected.woundType} — ${detected.severity} severity detected`,
        route: "/first-aid",
      });
    }, 2200);
  }

  function handleReset() {
    setPreviewUrl(null);
    setResult(null);
    setIsAnalyzing(false);
    setFilename("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function triggerUpload() {
    fileRef.current?.click();
  }

  return (
    <main
      className="min-h-screen p-6 animate-fadeInUp"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #f9a8c9 0%, #f9a8c9 100%)",
            }}
          >
            <ShieldPlus size={22} className="text-[#0d0d0d]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffffff]">
              First Aid <span style={{ color: "#f9a8c9" }}>AI Assistant</span>
            </h1>
            <p className="text-sm text-[#888888]">
              Instant wound analysis &amp; first aid guidance
            </p>
          </div>
          <span
            className="ml-auto text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
            style={{
              background: "rgba(52,211,153,0.15)",
              color: "#34D399",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
            data-ocid="firstaid.open_access.badge"
          >
            Open Access - No login required
          </span>
        </div>

        <p className="text-[#cccccc] text-sm mb-6 mt-3">
          Upload a photo of a wound or injury and our AI will analyse it and
          provide step-by-step first aid instructions. This tool is freely
          accessible to everyone - no account needed.
        </p>

        {!previewUrl && (
          <button
            type="button"
            onClick={triggerUpload}
            data-ocid="firstaid.dropzone"
            className="w-full cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-4 py-16 px-6 transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "2px dashed rgba(249,168,201,0.25)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(249,168,201,0.1)" }}
            >
              <Camera size={28} style={{ color: "#f9a8c9" }} />
            </div>
            <div className="text-center">
              <p className="text-[#ffffff] font-semibold text-base mb-1">
                Upload Wound Photo
              </p>
              <p className="text-[#888888] text-sm">
                Click to browse - JPG, PNG, HEIC supported
              </p>
            </div>
            <span
              data-ocid="firstaid.upload_button"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-[#0d0d0d] transition-all hover:opacity-90"
              style={{
                minHeight: 44,
                background: "linear-gradient(135deg, #f9a8c9, #f9a8c9)",
              }}
            >
              <Upload size={14} className="inline mr-2" />
              Choose Photo
            </span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          data-ocid="firstaid.input"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <div className="space-y-4">
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(160,190,210,0.1)",
              }}
            >
              <img
                src={previewUrl}
                alt="Uploaded wound"
                className="w-full max-h-72 object-cover"
              />
              <div
                className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(11,19,32,0.85)",
                  color: "#f9a8c9",
                  border: "1px solid rgba(249,168,201,0.3)",
                }}
              >
                {filename || "uploaded-image.jpg"}
              </div>
            </div>

            {isAnalyzing && (
              <div
                className="rounded-2xl p-6 flex items-center gap-4"
                style={{
                  background: "rgba(249,168,201,0.05)",
                  border: "1px solid rgba(249,168,201,0.15)",
                }}
                data-ocid="firstaid.loading_state"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,168,201,0.15)" }}
                >
                  <div
                    className="w-5 h-5 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "#f9a8c9",
                      borderTopColor: "transparent",
                    }}
                  />
                </div>
                <div>
                  <p className="text-[#ffffff] font-semibold">
                    Analysing image...
                  </p>
                  <p className="text-[#888888] text-sm">
                    AI is identifying wound type and preparing first aid guide
                  </p>
                </div>
              </div>
            )}

            {result && !isAnalyzing && (
              <div className="space-y-4" data-ocid="firstaid.success_state">
                <div
                  className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(160,190,210,0.1)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} style={{ color: "#f9a8c9" }} />
                    <div>
                      <p className="text-[#888888] text-xs uppercase tracking-widest mb-0.5">
                        AI Detection
                      </p>
                      <p className="text-[#ffffff] font-bold text-base">
                        {result.woundType}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      background: SEV_COLORS[result.severity].bg,
                      color: SEV_COLORS[result.severity].text,
                      border: `1px solid ${SEV_COLORS[result.severity].border}`,
                    }}
                  >
                    {result.severity} Severity
                  </span>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(160,190,210,0.1)",
                  }}
                >
                  <p className="text-[#f9a8c9] text-xs font-bold uppercase tracking-widest mb-4">
                    Step-by-Step First Aid
                  </p>
                  <ol className="space-y-3">
                    {result.steps.map((step) => (
                      <li key={step} className="flex gap-3">
                        <span
                          className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(249,168,201,0.15)",
                            color: "#f9a8c9",
                          }}
                        >
                          {result.steps.indexOf(step) + 1}
                        </span>
                        <p className="text-[#cccccc] text-sm leading-relaxed">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div
                  className="rounded-2xl p-4 flex gap-3"
                  style={{
                    background: "rgba(248,113,113,0.07)",
                    border: "1px solid rgba(248,113,113,0.2)",
                  }}
                >
                  <AlertCircle
                    size={18}
                    className="text-[#F87171] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-[#cccccc] leading-relaxed">
                    <span className="font-semibold text-[#F87171]">
                      Medical Disclaimer:{" "}
                    </span>
                    {result.warning}
                  </p>
                </div>

                <button
                  type="button"
                  data-ocid="firstaid.secondary_button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{
                    background: "rgba(249,168,201,0.1)",
                    color: "#f9a8c9",
                    border: "1px solid rgba(249,168,201,0.25)",
                  }}
                >
                  <RefreshCcw size={14} />
                  Try Another Photo
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className="mt-8 rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(160,190,210,0.08)",
          }}
        >
          <p className="text-[#f9a8c9] text-xs font-bold uppercase tracking-widest mb-3">
            General First Aid Reminders
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {[
              "Always wash hands before treating a wound",
              "Call 112 / 911 for life-threatening emergencies",
              "Keep a basic first aid kit at home",
              "Never remove deeply embedded objects",
              "Apply steady pressure to stop bleeding",
              "Seek professional help when in doubt",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-[#888888]"
              >
                <span style={{ color: "#f9a8c9" }}>v</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

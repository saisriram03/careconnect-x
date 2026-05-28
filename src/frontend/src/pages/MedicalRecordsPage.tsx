import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Pill,
  Sparkles,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import { medicalRecords } from "../data/dummyData";

const steps = [
  "Review the uploaded document to verify it's the correct file.",
  "Check your current medications and note any changes.",
  "If any medications are prescribed, order them promptly to avoid gaps in treatment.",
  "Share this record with your doctor at your next appointment.",
  "Keep a digital and physical copy for your records.",
];

export default function MedicalRecordsPage() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleUpload = (file: File) => {
    setUploadedFile(file.name);
    setAnalysisReady(false);
    setAnalyzing(true);
  };

  useEffect(() => {
    if (!analyzing) return;
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setAnalysisReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [analyzing]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold text-[#ffffff]">Medical Records</h2>
        <p className="text-sm text-[#888888] mt-1">
          Manage and view your health documents securely
        </p>
      </div>

      <GlassCard className="p-2">
        <label
          htmlFor="file-upload"
          data-ocid="records.dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl cursor-pointer transition-all"
          style={{
            minHeight: 44,
            border: `2px dashed ${dragOver ? "rgba(249,168,201,0.7)" : "rgba(160,190,210,0.2)"}`,
            background: dragOver ? "rgba(249,168,201,0.05)" : "transparent",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(249,168,201,0.1)",
              border: "1px solid rgba(249,168,201,0.25)",
            }}
          >
            <Upload size={24} className="text-[#f9a8c9]" />
          </div>
          {uploadedFile ? (
            <>
              <p className="text-sm font-semibold text-[#f9a8c9]">
                ✓ {uploadedFile}
              </p>
              <p className="text-xs text-[#888888]">File ready to upload</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#ffffff]">
                Drag & drop your reports here
              </p>
              <p className="text-xs text-[#888888]">
                or click to browse · PDF, JPG, PNG supported
              </p>
            </>
          )}
          <input
            id="file-upload"
            data-ocid="records.upload_button"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={handleFileChange}
            capture={undefined}
          />
        </label>
      </GlassCard>

      {/* AI Analysis Panel */}
      {analyzing && (
        <GlassCard className="p-6" glowColor="teal">
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(249,168,201,0.12)",
                border: "1px solid rgba(249,168,201,0.3)",
              }}
            >
              <Loader2 size={26} className="text-[#f9a8c9] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-[#ffffff]">
                Analyzing your medical record...
              </p>
              <p className="text-xs text-[#888888] mt-1">
                AI Medical Assistant is reviewing your document
              </p>
            </div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#f9a8c9] opacity-60"
                  style={{
                    animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {analysisReady && (
        <GlassCard className="p-6" glowColor="teal">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(249,168,201,0.15)",
                border: "1px solid rgba(249,168,201,0.35)",
              }}
            >
              <Sparkles size={18} className="text-[#f9a8c9]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#ffffff]">
                AI Medical Assistant
              </p>
              <p className="text-xs text-[#888888]">
                Powered by CareConnect AI
              </p>
            </div>
            <span
              className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(249,168,201,0.12)", color: "#f9a8c9" }}
            >
              Analysis Complete
            </span>
          </div>

          <p className="text-sm text-[#cccccc] mb-5">
            Your medical record has been received. Here&apos;s what you should
            do next:
          </p>

          {/* Steps */}
          <div className="space-y-3 mb-6">
            {steps.map((step, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              <div key={idx} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: "rgba(249,168,201,0.15)",
                    border: "1px solid rgba(249,168,201,0.35)",
                    color: "#f9a8c9",
                    minWidth: "28px",
                  }}
                >
                  {idx + 1}
                </div>
                <p className="text-sm text-[#D0DAF0] leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: "rgba(249,168,201,0.07)",
              border: "1px solid rgba(249,168,201,0.25)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(249,168,201,0.15)",
                  border: "1px solid rgba(249,168,201,0.3)",
                }}
              >
                <Pill size={16} className="text-[#f9a8c9]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#ffffff] mb-0.5">
                  Need to order your prescribed medicines?
                </p>
                <p className="text-xs text-[#888888] mb-3">
                  Visit our Online Tablets section to order from 10+ trusted
                  pharmacies
                </p>
                <button
                  type="button"
                  data-ocid="records.medicine.button"
                  onClick={() => navigate({ to: "/medicine" })}
                  className="px-5 py-2 rounded-lg text-sm font-bold text-[#0D1117] transition-all hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #f9a8c9 0%, #22C9B0 100%)",
                    boxShadow: "0 0 18px rgba(249,168,201,0.45)",
                  }}
                >
                  Go to Online Tablets →
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p
            className="text-[11px] text-[#5A6475] leading-relaxed"
            style={{
              borderTop: "1px solid rgba(160,190,210,0.08)",
              paddingTop: "12px",
            }}
          >
            ⚠️ This is an AI-assisted summary. Always consult your doctor for
            medical advice.
          </p>
        </GlassCard>
      )}

      <GlassCard className="p-5" glowColor="teal">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(249,168,201,0.15)",
              border: "1px solid rgba(249,168,201,0.3)",
            }}
          >
            <Sparkles size={18} className="text-[#f9a8c9]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#ffffff] mb-2">
              AI Health Insights
            </p>
            <p className="text-sm text-[#cccccc] leading-relaxed">
              Based on your recent records, your overall health is in good
              standing. Your CBC and metabolic panel from Dec 28 show normal
              ranges. The mild white matter changes noted in the Nov 5 MRI
              warrant a follow-up consultation with Dr. Vikram Singh. Consider
              scheduling a follow-up in Q1 2026.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span
                className="text-xs px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(249,168,201,0.1)",
                  color: "#f9a8c9",
                }}
              >
                4 Normal results
              </span>
              <span
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
              >
                1 Needs review
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-[#ffffff] mb-5">
          Records Timeline
        </p>
        <div className="relative">
          <div
            className="absolute left-4 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(180deg, rgba(249,168,201,0.5), rgba(249,168,201,0.05))",
            }}
          />
          <div className="space-y-4">
            {medicalRecords.map((record, idx) => (
              <div
                key={record.id}
                data-ocid={`records.item.${idx + 1}`}
                className="relative pl-10"
              >
                <div
                  className="absolute left-2.5 top-4 w-3 h-3 rounded-full -translate-x-1/2"
                  style={{
                    background: record.statusColor,
                    boxShadow: `0 0 8px ${record.statusColor}80`,
                  }}
                />
                <button
                  type="button"
                  className="w-full p-4 rounded-xl transition-all text-left hover:bg-[rgba(255,255,255,0.03)]"
                  style={{ border: "1px solid rgba(160,190,210,0.08)" }}
                  onClick={() =>
                    setExpandedRecord(
                      expandedRecord === record.id ? null : record.id,
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(249,168,201,0.1)" }}
                      >
                        <FileText size={14} className="text-[#f9a8c9]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#ffffff]">
                          {record.type}
                        </p>
                        <p className="text-xs text-[#888888]">
                          {record.date} · {record.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                        style={{
                          background: `${record.statusColor}18`,
                          color: record.statusColor,
                        }}
                      >
                        {record.status}
                      </span>
                      {expandedRecord === record.id ? (
                        <ChevronUp size={14} className="text-[#888888]" />
                      ) : (
                        <ChevronDown size={14} className="text-[#888888]" />
                      )}
                    </div>
                  </div>
                  {expandedRecord === record.id && (
                    <div
                      className="mt-3 pt-3 text-xs text-[#cccccc] leading-relaxed"
                      style={{ borderTop: "1px solid rgba(160,190,210,0.08)" }}
                    >
                      {record.details}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

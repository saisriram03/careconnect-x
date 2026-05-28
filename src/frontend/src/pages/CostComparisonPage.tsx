import {
  Building,
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  Laptop,
  Star,
  Stethoscope,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import RippleButton from "../components/ui/RippleButton";

function openNearbyGovernmentHospitals() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(
          `https://www.google.com/maps/search/government+hospital/@${latitude},${longitude},14z`,
          "_blank",
        );
      },
      () => {
        window.open(
          "https://www.google.com/maps/search/government+hospital+near+me",
          "_blank",
        );
      },
    );
  } else {
    window.open(
      "https://www.google.com/maps/search/government+hospital+near+me",
      "_blank",
    );
  }
}

function openNearbyPrivateHospitals() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(
          `https://www.google.com/maps/search/private+hospital/@${latitude},${longitude},14z`,
          "_blank",
        );
      },
      () => {
        window.open(
          "https://www.google.com/maps/search/private+hospital+near+me",
          "_blank",
        );
      },
    );
  } else {
    window.open(
      "https://www.google.com/maps/search/private+hospital+near+me",
      "_blank",
    );
  }
}

type HospitalType = "government" | "online" | "private";

interface Doctor {
  name: string;
  specialization: string;
  rating: number;
  experience: number;
}

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const CONDITIONS = [
  "Fever & Flu",
  "Diabetes",
  "Hypertension",
  "Back Pain",
  "Skin Allergy",
  "Anxiety & Stress",
  "Migraine",
  "Digestive Issues",
  "Heart Checkup",
  "Eye Problems",
];

const DOCTORS_BY_CONDITION: Record<string, Doctor[]> = {
  "Fever & Flu": [
    {
      name: "Dr. Anjali Sharma",
      specialization: "General Physician",
      rating: 4.8,
      experience: 8,
    },
    {
      name: "Dr. Rahul Mehta",
      specialization: "General Physician",
      rating: 4.6,
      experience: 5,
    },
  ],
  Diabetes: [
    {
      name: "Dr. Priya Nair",
      specialization: "Endocrinologist",
      rating: 4.9,
      experience: 12,
    },
    {
      name: "Dr. Suresh Kumar",
      specialization: "Diabetologist",
      rating: 4.7,
      experience: 9,
    },
  ],
  Hypertension: [
    {
      name: "Dr. Arjun Patel",
      specialization: "Cardiologist",
      rating: 4.8,
      experience: 14,
    },
    {
      name: "Dr. Meena Iyer",
      specialization: "Internal Medicine",
      rating: 4.6,
      experience: 10,
    },
  ],
  "Back Pain": [
    {
      name: "Dr. Vikram Singh",
      specialization: "Orthopedic",
      rating: 4.7,
      experience: 11,
    },
    {
      name: "Dr. Kavya Reddy",
      specialization: "Physiotherapist",
      rating: 4.9,
      experience: 7,
    },
  ],
  "Skin Allergy": [
    {
      name: "Dr. Deepa Menon",
      specialization: "Dermatologist",
      rating: 4.8,
      experience: 9,
    },
    {
      name: "Dr. Rohan Das",
      specialization: "Dermatologist",
      rating: 4.5,
      experience: 6,
    },
  ],
  "Anxiety & Stress": [
    {
      name: "Dr. Neha Gupta",
      specialization: "Psychiatrist",
      rating: 4.9,
      experience: 13,
    },
    {
      name: "Dr. Aditya Joshi",
      specialization: "Psychologist",
      rating: 4.7,
      experience: 8,
    },
  ],
  Migraine: [
    {
      name: "Dr. Sanjay Bose",
      specialization: "Neurologist",
      rating: 4.8,
      experience: 15,
    },
    {
      name: "Dr. Lata Krishnan",
      specialization: "Neurologist",
      rating: 4.6,
      experience: 10,
    },
  ],
  "Digestive Issues": [
    {
      name: "Dr. Ramesh Pillai",
      specialization: "Gastroenterologist",
      rating: 4.7,
      experience: 11,
    },
    {
      name: "Dr. Anita Shah",
      specialization: "General Physician",
      rating: 4.5,
      experience: 7,
    },
  ],
  "Heart Checkup": [
    {
      name: "Dr. Arjun Patel",
      specialization: "Cardiologist",
      rating: 4.8,
      experience: 14,
    },
    {
      name: "Dr. Sunita Rao",
      specialization: "Cardiologist",
      rating: 4.9,
      experience: 16,
    },
  ],
  "Eye Problems": [
    {
      name: "Dr. Kiran Nambiar",
      specialization: "Ophthalmologist",
      rating: 4.8,
      experience: 10,
    },
    {
      name: "Dr. Pooja Agarwal",
      specialization: "Ophthalmologist",
      rating: 4.6,
      experience: 8,
    },
  ],
};

const PRESCRIPTIONS: Record<string, Medicine[]> = {
  "Fever & Flu": [
    {
      name: "Paracetamol 500mg",
      dosage: "1 tab",
      frequency: "TDS",
      duration: "5 days",
    },
    {
      name: "Cetirizine 10mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "3 days",
    },
    {
      name: "Vitamin C 500mg",
      dosage: "1 tab",
      frequency: "BD",
      duration: "7 days",
    },
  ],
  Diabetes: [
    {
      name: "Metformin 500mg",
      dosage: "1 tab",
      frequency: "BD",
      duration: "30 days",
    },
    {
      name: "Glimepiride 1mg",
      dosage: "1 tab",
      frequency: "OD morning",
      duration: "30 days",
    },
    {
      name: "Chromium Picolinate",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
  ],
  Hypertension: [
    {
      name: "Amlodipine 5mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
    {
      name: "Losartan 50mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
    {
      name: "Aspirin 75mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
  ],
  "Back Pain": [
    {
      name: "Diclofenac 50mg",
      dosage: "1 tab",
      frequency: "BD after food",
      duration: "7 days",
    },
    {
      name: "Muscle Relaxant 4mg",
      dosage: "1 tab",
      frequency: "TDS",
      duration: "5 days",
    },
    {
      name: "Calcium + D3",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
  ],
  "Skin Allergy": [
    {
      name: "Fexofenadine 120mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "7 days",
    },
    {
      name: "Hydrocortisone Cream 1%",
      dosage: "apply",
      frequency: "twice daily",
      duration: "7 days",
    },
    {
      name: "Vitamin E 400mg",
      dosage: "1 cap",
      frequency: "OD",
      duration: "15 days",
    },
  ],
  "Anxiety & Stress": [
    {
      name: "Escitalopram 5mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
    {
      name: "Clonazepam 0.5mg",
      dosage: "1 tab",
      frequency: "OD at night",
      duration: "15 days",
    },
    {
      name: "Ashwagandha 300mg",
      dosage: "1 cap",
      frequency: "BD",
      duration: "30 days",
    },
  ],
  Migraine: [
    {
      name: "Sumatriptan 50mg",
      dosage: "1 tab at onset",
      frequency: "max 2/day",
      duration: "PRN",
    },
    {
      name: "Propranolol 20mg",
      dosage: "1 tab",
      frequency: "BD",
      duration: "30 days",
    },
    {
      name: "Riboflavin 400mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "90 days",
    },
  ],
  "Digestive Issues": [
    {
      name: "Pantoprazole 40mg",
      dosage: "1 tab",
      frequency: "OD before food",
      duration: "14 days",
    },
    {
      name: "Domperidone 10mg",
      dosage: "1 tab",
      frequency: "TDS before food",
      duration: "7 days",
    },
    {
      name: "Probiotics",
      dosage: "1 cap",
      frequency: "OD",
      duration: "30 days",
    },
  ],
  "Heart Checkup": [
    {
      name: "Atorvastatin 10mg",
      dosage: "1 tab",
      frequency: "OD at night",
      duration: "30 days",
    },
    {
      name: "Aspirin 75mg",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
    {
      name: "Omega-3 1000mg",
      dosage: "1 cap",
      frequency: "OD",
      duration: "90 days",
    },
  ],
  "Eye Problems": [
    {
      name: "Moxifloxacin Eye Drops",
      dosage: "2 drops",
      frequency: "QID",
      duration: "7 days",
    },
    {
      name: "Artificial Tears",
      dosage: "2 drops",
      frequency: "PRN",
      duration: "as needed",
    },
    {
      name: "Vitamin A 5000 IU",
      dosage: "1 tab",
      frequency: "OD",
      duration: "30 days",
    },
  ],
};

const PRICE_RANGES: Record<HospitalType, string> = {
  government: "₹200 – 500",
  online: "₹300 – 800",
  private: "₹1,000 – 3,000",
};

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const HOSPITAL_TYPE_LABEL: Record<HospitalType, string> = {
  government: "Government Hospital",
  online: "Online Consultation",
  private: "Private Hospital",
};

function getInitials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          fill={i <= Math.floor(rating) ? "#f9a8c9" : "none"}
          stroke="#f9a8c9"
        />
      ))}
      <span className="text-[10px] text-[#f9a8c9] ml-1">{rating}</span>
    </span>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
            style={{
              background: step >= s ? "#f9a8c9" : "transparent",
              borderColor: step >= s ? "#f9a8c9" : "#444",
              color: step >= s ? "#111" : "#666",
            }}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className="w-12 h-0.5 mx-1"
              style={{ background: step > s ? "#f9a8c9" : "#333" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface BookingModalProps {
  hospitalType: HospitalType;
  onClose: () => void;
}

function BookingModal({ hospitalType, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [condition, setCondition] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const doctors = condition ? (DOCTORS_BY_CONDITION[condition] ?? []) : [];
  const today = new Date().toISOString().split("T")[0];

  const canProceedStep1 = condition !== "" && selectedDoctor !== null;
  const canProceedStep2 = date !== "" && time !== "";

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  if (confirmed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.85)" }}
      >
        <div className="bg-[#111] border border-[#333] rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(249,168,201,0.2)" }}
          >
            <CheckCircle size={32} style={{ color: "#f9a8c9" }} />
          </div>
          <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
          <p className="text-[#888] text-sm text-center">
            Your appointment has been booked successfully. You'll receive a
            confirmation shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 0 40px rgba(249,168,201,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
          <div>
            <h2 className="text-base font-bold text-white">
              Book Online Appointment
            </h2>
            <p className="text-xs text-[#888] mt-0.5">
              {HOSPITAL_TYPE_LABEL[hospitalType]}
            </p>
          </div>
          <button
            type="button"
            data-ocid="booking.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#666] hover:text-white hover:bg-[#222] transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <StepIndicator step={step} />

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-[#aaa] uppercase tracking-wider mb-2 block">
                  Select Condition
                </div>
                <select
                  data-ocid="booking.select"
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#f9a8c9] transition-colors"
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    setSelectedDoctor(null);
                  }}
                >
                  <option value="">-- Choose your condition --</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {doctors.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#aaa] uppercase tracking-wider mb-3 block">
                    Available Doctors
                  </div>
                  <div className="space-y-3">
                    {doctors.map((doc) => (
                      <button
                        type="button"
                        key={doc.name}
                        data-ocid="booking.row"
                        onClick={() => setSelectedDoctor(doc)}
                        className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all w-full text-left"
                        style={{
                          borderColor:
                            selectedDoctor?.name === doc.name
                              ? "#f9a8c9"
                              : "#2a2a2a",
                          background:
                            selectedDoctor?.name === doc.name
                              ? "rgba(249,168,201,0.07)"
                              : "#1a1a1a",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{
                            background: "rgba(249,168,201,0.18)",
                            color: "#f9a8c9",
                          }}
                        >
                          {getInitials(doc.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#888]">
                            {doc.specialization} · {doc.experience} yrs exp
                          </p>
                          <StarRating rating={doc.rating} />
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: "rgba(249,168,201,0.15)",
                            color: "#f9a8c9",
                          }}
                        >
                          Available Today
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                data-ocid="booking.primary_button"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canProceedStep1 ? "#f9a8c9" : "#2a2a2a",
                  color: canProceedStep1 ? "#111" : "#555",
                  cursor: canProceedStep1 ? "pointer" : "not-allowed",
                }}
              >
                Next: Choose Date & Time →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-[#aaa] uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                  <CalendarDays size={12} /> Appointment Date
                </div>
                <input
                  data-ocid="booking.input"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#f9a8c9] transition-colors"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-[#aaa] uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                  <Clock size={12} /> Choose Time Slot
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      data-ocid="booking.toggle"
                      onClick={() => setTime(slot)}
                      className="py-2 px-1 rounded-xl text-xs font-medium border transition-all"
                      style={{
                        background: time === slot ? "#f9a8c9" : "#1a1a1a",
                        borderColor: time === slot ? "#f9a8c9" : "#2a2a2a",
                        color: time === slot ? "#111" : "#aaa",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="booking.secondary_button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#333] text-[#aaa] hover:border-[#555] transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  data-ocid="booking.primary_button"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: canProceedStep2 ? "#f9a8c9" : "#2a2a2a",
                    color: canProceedStep2 ? "#111" : "#555",
                    cursor: canProceedStep2 ? "pointer" : "not-allowed",
                  }}
                >
                  Next: Review & Confirm →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && selectedDoctor && (
            <div className="space-y-4">
              {/* Booking Summary Card */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
                    style={{
                      background: "rgba(249,168,201,0.18)",
                      color: "#f9a8c9",
                    }}
                  >
                    {getInitials(selectedDoctor.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {selectedDoctor.name}
                    </p>
                    <p className="text-xs text-[#888]">
                      {selectedDoctor.specialization}
                    </p>
                    <StarRating rating={selectedDoctor.rating} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111] rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Stethoscope size={10} style={{ color: "#f9a8c9" }} />
                      <span className="text-[10px] text-[#666] uppercase tracking-wider">
                        Condition
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">
                      {condition}
                    </p>
                  </div>
                  <div className="bg-[#111] rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <CalendarDays size={10} style={{ color: "#f9a8c9" }} />
                      <span className="text-[10px] text-[#666] uppercase tracking-wider">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">{date}</p>
                    <p className="text-xs text-[#f9a8c9]">{time}</p>
                  </div>
                  <div className="bg-[#111] rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Building2 size={10} style={{ color: "#f9a8c9" }} />
                      <span className="text-[10px] text-[#666] uppercase tracking-wider">
                        Hospital Type
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">
                      {HOSPITAL_TYPE_LABEL[hospitalType]}
                    </p>
                  </div>
                  <div className="bg-[#111] rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-[#f9a8c9]">₹</span>
                      <span className="text-[10px] text-[#666] uppercase tracking-wider">
                        Est. Price
                      </span>
                    </div>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#f9a8c9" }}
                    >
                      {PRICE_RANGES[hospitalType]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Pad */}
              <div
                className="rounded-xl border-l-4 p-4"
                style={{
                  background: "#161616",
                  borderLeftColor: "#f9a8c9",
                  border: "1px solid #2a2a2a",
                  borderLeft: "4px solid #f9a8c9",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} style={{ color: "#f9a8c9" }} />
                  <h4 className="text-sm font-bold text-white">
                    {selectedDoctor.name}'s Prescription
                  </h4>
                </div>
                <p className="text-xs text-[#888] mb-3">
                  <span className="text-[#aaa]">Patient Complaint:</span>{" "}
                  {condition}
                </p>

                <div className="overflow-x-auto">
                  <table
                    className="w-full text-xs"
                    style={{ fontFamily: "monospace" }}
                  >
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="text-left text-[#666] pb-1.5 pr-3 font-medium">
                          Rx Medicine
                        </th>
                        <th className="text-left text-[#666] pb-1.5 pr-3 font-medium">
                          Dose
                        </th>
                        <th className="text-left text-[#666] pb-1.5 pr-3 font-medium">
                          Freq
                        </th>
                        <th className="text-left text-[#666] pb-1.5 font-medium">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(PRESCRIPTIONS[condition] ?? []).map((med) => (
                        <tr
                          key={med.name}
                          className="border-b border-[#1e1e1e]"
                        >
                          <td className="py-1.5 pr-3 text-[#f0f0f0]">
                            {med.name}
                          </td>
                          <td className="py-1.5 pr-3 text-[#ccc]">
                            {med.dosage}
                          </td>
                          <td className="py-1.5 pr-3 text-[#ccc]">
                            {med.frequency}
                          </td>
                          <td className="py-1.5 text-[#ccc]">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ fontFamily: "cursive", color: "#f9a8c9" }}
                  >
                    — {selectedDoctor.name}
                  </span>
                  <span className="text-[9px] text-[#555] max-w-[200px] text-right leading-tight">
                    ⚠ This is a simulated prescription. Always consult a
                    licensed physician.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="booking.secondary_button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#333] text-[#aaa] hover:border-[#555] transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  data-ocid="booking.confirm_button"
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#f9a8c9", color: "#111" }}
                >
                  Confirm Booking ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    id: 1,
    name: "Government Hospital",
    icon: Building2,
    price: "₹0 – 500",
    period: "per consultation",
    badge: "Cheapest",
    badgeColor: "#f9a8c9",
    badgeBg: "rgba(249,168,201,0.15)",
    accentColor: "#f9a8c9",
    glowColor: "green" as const,
    borderHighlight: undefined as string | undefined,
    pros: [
      "Subsidized rates",
      "Comprehensive care",
      "Well-equipped labs",
      "Accepted insurance",
    ],
    cons: ["Long waiting times", "Crowded facilities"],
    cta: "Find Near Me",
    ocid: "costs.govt.button",
    featured: false,
    hospitalType: "government" as HospitalType,
    onCtaClick: openNearbyGovernmentHospitals,
  },
  {
    id: 2,
    name: "Online Consultation",
    icon: Laptop,
    price: "₹300 – 800",
    period: "per session",
    badge: "Recommended",
    badgeColor: "#f9a8c9",
    badgeBg: "rgba(249,168,201,0.15)",
    accentColor: "#f9a8c9",
    glowColor: "teal" as const,
    borderHighlight: "1px solid rgba(249,168,201,0.4)" as string | undefined,
    pros: [
      "Instant availability",
      "No travel needed",
      "24/7 access",
      "Digital prescriptions",
    ],
    cons: ["No physical exam", "Limited for emergencies"],
    cta: "Book Online Now",
    ocid: "costs.online.button",
    featured: true,
    hospitalType: "online" as HospitalType,
    onCtaClick: undefined as (() => void) | undefined,
  },
  {
    id: 3,
    name: "Private Hospital",
    icon: Building,
    price: "₹1000 – 3000",
    period: "per consultation",
    badge: "Premium",
    badgeColor: "#f9a8c9",
    badgeBg: "rgba(249,168,201,0.15)",
    accentColor: "#f9a8c9",
    glowColor: "blue" as const,
    borderHighlight: undefined as string | undefined,
    pros: [
      "Minimal wait time",
      "Premium amenities",
      "Specialist access",
      "Advanced technology",
    ],
    cons: ["High cost", "May need referral"],
    cta: "Find Hospitals",
    ocid: "costs.private.button",
    featured: false,
    hospitalType: "private" as HospitalType,
    onCtaClick: openNearbyPrivateHospitals,
  },
];

export default function CostComparisonPage() {
  const [bookingModal, setBookingModal] = useState<{
    hospitalType: HospitalType;
  } | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold text-[#ffffff]">
          Healthcare Cost Comparison
        </h2>
        <p className="text-sm text-[#888888] mt-1">
          Choose the best option for your needs and budget
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <GlassCard
            key={plan.id}
            className="p-6 flex flex-col transition-all hover:scale-[1.02]"
            glowColor={plan.featured ? plan.glowColor : "none"}
            style={
              plan.borderHighlight
                ? { border: plan.borderHighlight }
                : undefined
            }
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: plan.badgeBg }}
              >
                <plan.icon size={22} style={{ color: plan.accentColor }} />
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: plan.badgeBg, color: plan.badgeColor }}
              >
                {plan.badge}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#ffffff] mb-1">
              {plan.name}
            </h3>
            <div className="mb-4">
              <span
                className="text-2xl font-bold"
                style={{ color: plan.accentColor }}
              >
                {plan.price}
              </span>
              <span className="text-xs text-[#888888] ml-2">{plan.period}</span>
            </div>

            <div className="space-y-2 flex-1 mb-5">
              {plan.pros.map((pro) => (
                <div key={pro} className="flex items-center gap-2">
                  <CheckCircle
                    size={13}
                    style={{ color: plan.accentColor }}
                    className="flex-shrink-0"
                  />
                  <span className="text-xs text-[#cccccc]">{pro}</span>
                </div>
              ))}
              {plan.cons.map((con) => (
                <div key={con} className="flex items-center gap-2">
                  <XCircle size={13} className="text-[#888888] flex-shrink-0" />
                  <span className="text-xs text-[#888888]">{con}</span>
                </div>
              ))}
            </div>

            {/* Primary CTA (Find Near Me / Find Hospitals / existing) */}
            {plan.onCtaClick && (
              <RippleButton
                data-ocid={plan.ocid}
                variant="secondary"
                className="w-full justify-center mb-2"
                onClick={plan.onCtaClick}
              >
                {plan.cta}
              </RippleButton>
            )}

            {/* Book Online Now */}
            <RippleButton
              data-ocid={
                plan.id === 2
                  ? plan.ocid
                  : `costs.${plan.hospitalType}.book_button`
              }
              variant={
                plan.featured && !plan.onCtaClick ? "primary" : "secondary"
              }
              className="w-full justify-center"
              onClick={() =>
                setBookingModal({ hospitalType: plan.hospitalType })
              }
            >
              Book Online Now
            </RippleButton>
          </GlassCard>
        ))}
      </div>

      {bookingModal && (
        <BookingModal
          hospitalType={bookingModal.hospitalType}
          onClose={() => setBookingModal(null)}
        />
      )}
    </div>
  );
}

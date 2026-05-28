import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, ChevronLeft, Clock, Search, Star, X } from "lucide-react";
import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import RippleButton from "../components/ui/RippleButton";
import { useNotifications } from "../context/NotificationContext";
import { doctors } from "../data/dummyData";

const specialties = [
  "All",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Neurologist",
];
const STAR_INDICES = [0, 1, 2, 3, 4] as const;

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  fee: string;
  available: boolean;
  initials: string;
  color: string;
  bio: string;
  slots: string[];
}

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
}

function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"date" | "slot">("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { addNotification } = useNotifications();

  const handleConfirm = () => {
    if (!selectedSlot || !selectedDate) return;
    setConfirmed(true);
    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    addNotification({
      type: "success",
      title: "Appointment Confirmed",
      message: `${doctor.name} booked for ${formattedDate} at ${selectedSlot}`,
      route: "/doctors",
    });
    setTimeout(onClose, 2500);
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        data-ocid="booking.modal"
        className="glass-card w-full max-w-md p-6 animate-fadeInUp"
        style={{ border: "1px solid rgba(249,168,201,0.25)" }}
      >
        {confirmed ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-[#f9a8c9] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#ffffff]">
              Appointment Booked!
            </h3>
            <p className="text-sm text-[#888888] mt-2">
              {doctor.name} on {formattedDate} at {selectedSlot}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {step === "slot" && (
                  <button
                    type="button"
                    data-ocid="booking.back.button"
                    onClick={() => {
                      setStep("date");
                      setSelectedSlot("");
                    }}
                    className="text-[#888888] hover:text-[#f9a8c9] p-1 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <h3 className="text-base font-bold text-[#ffffff]">
                  {step === "date" ? "Pick a Date" : "Choose a Time Slot"}
                </h3>
              </div>
              <button
                type="button"
                data-ocid="booking.close_button"
                onClick={onClose}
                className="text-[#888888] hover:text-[#ffffff] p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Doctor info */}
            <div
              className="flex items-center gap-4 p-4 rounded-xl mb-5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[#0d0d0d] font-bold"
                style={{ background: doctor.color }}
              >
                {doctor.initials}
              </div>
              <div>
                <p className="font-semibold text-[#ffffff]">{doctor.name}</p>
                <p className="text-xs text-[#888888]">
                  {doctor.specialty} · {doctor.fee}
                </p>
              </div>
            </div>

            {step === "date" ? (
              <>
                <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-3">
                  Select Appointment Date
                </p>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    className="[&_button]:text-[#cccccc] [&_button:hover]:bg-[rgba(249,168,201,0.15)] [&_button[aria-selected=true]]:bg-[rgba(249,168,201,0.25)] [&_button[aria-selected=true]]:text-[#f9a8c9] [&_.rdp-day_disabled]:text-[#444] [&_.rdp-caption]:text-[#ffffff] [&_.rdp-head_cell]:text-[#888888] w-full"
                  />
                </div>
                <div className="flex gap-3 mt-5">
                  <RippleButton
                    data-ocid="booking.cancel_button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </RippleButton>
                  <RippleButton
                    data-ocid="booking.next_button"
                    variant="primary"
                    onClick={() => setStep("slot")}
                    disabled={!selectedDate}
                    className="flex-1"
                  >
                    Next: Pick Time
                  </RippleButton>
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(249,168,201,0.08)",
                    border: "1px solid rgba(249,168,201,0.2)",
                  }}
                >
                  <span className="text-xs text-[#f9a8c9] font-medium">
                    {formattedDate}
                  </span>
                </div>
                <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-3">
                  Available Slots
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {doctor.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      data-ocid="booking.slot.toggle"
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all ${
                        selectedSlot === slot
                          ? "bg-[rgba(249,168,201,0.15)] border border-[rgba(249,168,201,0.5)] text-[#f9a8c9]"
                          : "bg-[rgba(255,255,255,0.05)] border border-[rgba(160,190,210,0.1)] text-[#cccccc] hover:border-[rgba(249,168,201,0.3)]"
                      }`}
                    >
                      <Clock size={12} />
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <RippleButton
                    data-ocid="booking.cancel_button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </RippleButton>
                  <RippleButton
                    data-ocid="booking.confirm_button"
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!selectedSlot}
                    className="flex-1"
                  >
                    Confirm Booking
                  </RippleButton>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DoctorBookingPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold text-[#ffffff]">
          Find & Book Doctors
        </h2>
        <p className="text-sm text-[#888888] mt-1">
          Connect with top healthcare professionals
        </p>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
            />
            <input
              data-ocid="doctors.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors or specialties..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(160,190,210,0.12)] text-sm text-[#ffffff] placeholder-[#888888] outline-none focus:border-[rgba(249,168,201,0.4)] transition-all"
            />
          </div>
          <select
            data-ocid="doctors.specialty.select"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(160,190,210,0.12)] text-sm text-[#cccccc] outline-none focus:border-[rgba(249,168,201,0.4)] transition-all"
          >
            {specialties.map((s) => (
              <option key={s} value={s} className="bg-[#0d0d0d]">
                {s}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doctor, idx) => (
          <GlassCard
            key={doctor.id}
            className="p-5 flex flex-col transition-all hover:scale-[1.02]"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[#0d0d0d] font-bold text-sm flex-shrink-0"
                style={{ background: doctor.color }}
              >
                {doctor.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#ffffff] truncate">
                  {doctor.name}
                </h3>
                <p className="text-xs text-[#888888]">{doctor.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  {STAR_INDICES.map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={10}
                      className={
                        starIdx < Math.floor(doctor.rating)
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-[#888888]"
                      }
                    />
                  ))}
                  <span className="text-[10px] text-[#888888] ml-1">
                    {doctor.rating}
                  </span>
                </div>
              </div>
              <div
                className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: doctor.available
                    ? "rgba(249,168,201,0.12)"
                    : "rgba(245,158,11,0.12)",
                  color: doctor.available ? "#f9a8c9" : "#F59E0B",
                }}
              >
                {doctor.available ? "Available" : "Busy"}
              </div>
            </div>
            <p className="text-xs text-[#888888] mb-3 flex-1">{doctor.bio}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#f9a8c9]">
                {doctor.fee}
              </span>
              <RippleButton
                data-ocid={`doctors.book.primary_button.${idx + 1}`}
                variant={doctor.available ? "primary" : "secondary"}
                onClick={() => doctor.available && setBookingDoctor(doctor)}
                disabled={!doctor.available}
                className="text-xs px-4 py-2"
              >
                Book Now
              </RippleButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}
    </div>
  );
}

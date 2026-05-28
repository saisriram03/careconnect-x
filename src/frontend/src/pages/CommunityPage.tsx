import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ExternalLink,
  Heart,
  Phone,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import RippleButton from "../components/ui/RippleButton";
import { useNotifications } from "../context/NotificationContext";
import { helpRequests, volunteers } from "../data/dummyData";

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  Accepted: { color: "#f9a8c9", bg: "rgba(249,168,201,0.15)" },
  Completed: { color: "#888888", bg: "rgba(127,138,155,0.15)" },
};

const requestTypeConfig: Record<
  number,
  { skills: string[]; label: string; icon: string }
> = {
  1: {
    skills: ["Transport", "Emergency Care"],
    label: "Select Transporter",
    icon: "🚑",
  },
  2: {
    skills: ["First Aid", "Nursing"],
    label: "Select First Aider",
    icon: "🩹",
  },
  3: {
    skills: [
      "Medicine Delivery",
      "Emergency Care",
      "First Aid",
      "Nursing",
      "Medical Student",
      "Physiotherapy",
      "Transport",
    ],
    label: "Select Delivery Volunteer",
    icon: "💊",
  },
};

type RequestState = {
  volunteer: string;
  status: string;
  successMsg: string;
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const [requested, setRequested] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [requestStates, setRequestStates] = useState<
    Record<number, RequestState>
  >(
    Object.fromEntries(
      helpRequests.map((r) => [
        r.id,
        { volunteer: r.volunteer, status: r.status, successMsg: "" },
      ]),
    ),
  );

  const toggleExpand = (id: number) => {
    if (requestStates[id].status === "Completed") return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const { addNotification } = useNotifications();

  const selectVolunteer = (reqId: number, volunteerName: string) => {
    setRequestStates((prev) => ({
      ...prev,
      [reqId]: {
        volunteer: volunteerName,
        status: "Accepted",
        successMsg: "✓ Volunteer assigned!",
      },
    }));
    addNotification({
      type: "success",
      title: "Volunteer Assigned",
      message: `${volunteerName} has accepted your request`,
      route: "/community",
    });
    setTimeout(() => {
      setRequestStates((prev) => ({
        ...prev,
        [reqId]: { ...prev[reqId], successMsg: "" },
      }));
      setExpandedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-bold text-[#ffffff]">
          Community Health Network
        </h2>
        <p className="text-sm text-[#888888] mt-1">
          Connect with local volunteers for health support
        </p>
      </div>

      <GlassCard className="p-6" glowColor="teal">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[rgba(249,168,201,0.15)] flex items-center justify-center">
                <Heart size={18} className="text-[#f9a8c9]" />
              </div>
              <h3 className="text-base font-semibold text-[#ffffff]">
                Need Health Support?
              </h3>
            </div>
            <p className="text-sm text-[#cccccc]">
              Our community volunteers are ready to assist with transport, first
              aid, and more.
            </p>
          </div>
          <RippleButton
            data-ocid="community.request.primary_button"
            variant="primary"
            onClick={() => setRequested(true)}
            className="px-6 py-3 flex-shrink-0"
          >
            {requested ? "✓ Request Sent!" : "Request Help"}
          </RippleButton>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Nearby Volunteers */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-[#f9a8c9]" />
            <p className="text-sm font-semibold text-[#ffffff]">
              Nearby Volunteers
            </p>
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: "rgba(249,168,201,0.15)", color: "#f9a8c9" }}
            >
              {volunteers.filter((v) => v.available).length} available
            </span>
          </div>
          <div className="space-y-3">
            {volunteers.map((v, idx) => (
              <div
                key={v.id}
                data-ocid={`community.volunteer.item.${idx + 1}`}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d0d0d] font-bold text-xs flex-shrink-0"
                  style={{ background: v.color }}
                >
                  {v.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#ffffff] truncate">
                    {v.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(249,168,201,0.12)",
                        color: "#f9a8c9",
                      }}
                    >
                      {v.skill}
                    </span>
                    <span className="text-[10px] text-[#888888]">
                      {v.distance}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: v.available ? "#f9a8c9" : "#888888" }}
                  />
                  <button
                    type="button"
                    data-ocid={`community.contact.button.${idx + 1}`}
                    className="p-1.5 rounded-lg text-[#888888] hover:text-[#f9a8c9] hover:bg-[rgba(249,168,201,0.1)] transition-all"
                  >
                    <Phone size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Request Status */}
        <GlassCard className="p-5">
          <p className="text-sm font-semibold text-[#ffffff] mb-4">
            Request Status
          </p>
          <div className="space-y-3">
            {helpRequests.map((req, idx) => {
              const state = requestStates[req.id];
              const config = requestTypeConfig[req.id];
              const isExpanded = expandedId === req.id;
              const isPending = state.status === "Pending";
              const isCompleted = state.status === "Completed";
              const matchedVolunteers = volunteers.filter(
                (v) => config.skills.includes(v.skill) && v.available,
              );

              return (
                <div
                  key={req.id}
                  data-ocid={`community.request.item.${idx + 1}`}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: isPending
                      ? "1px solid rgba(245,158,11,0.4)"
                      : "1px solid rgba(160,190,210,0.08)",
                    boxShadow: isPending
                      ? "0 0 12px rgba(245,158,11,0.1)"
                      : "none",
                  }}
                >
                  {/* Card header — clickable */}
                  <button
                    type="button"
                    className={`w-full p-4 text-left ${isCompleted ? "cursor-default" : "cursor-pointer hover:bg-[rgba(255,255,255,0.03)]"} transition-colors`}
                    onClick={() => toggleExpand(req.id)}
                    disabled={isCompleted}
                    data-ocid={`community.request.toggle.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-base">{config.icon}</span>
                        <p className="text-sm text-[#cccccc] flex-1">
                          {req.issue}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: statusConfig[state.status].bg,
                            color: statusConfig[state.status].color,
                          }}
                        >
                          {state.status}
                        </span>
                        {!isCompleted && (
                          <ChevronDown
                            size={14}
                            className="text-[#888888] transition-transform duration-300"
                            style={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#888888]">
                        Volunteer: {state.volunteer}
                      </p>
                      <p className="text-[10px] text-[#888888]">{req.time}</p>
                    </div>
                    {!isCompleted && (
                      <p className="text-[10px] text-[#f9a8c9] mt-1 opacity-70">
                        {isExpanded
                          ? "Click to collapse"
                          : `Tap to ${config.label.toLowerCase()}`}
                      </p>
                    )}
                  </button>

                  {/* Expandable volunteer selector */}
                  <div
                    className="transition-all duration-300 overflow-hidden"
                    style={{
                      maxHeight: isExpanded ? "400px" : "0px",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div
                      className="px-4 pb-4"
                      style={{ borderTop: "1px solid rgba(160,190,210,0.1)" }}
                    >
                      {/* Success message */}
                      {state.successMsg && (
                        <div
                          className="my-3 py-2 px-3 rounded-lg text-sm font-semibold text-center"
                          style={{
                            background: "rgba(249,168,201,0.15)",
                            color: "#f9a8c9",
                          }}
                        >
                          {state.successMsg}
                        </div>
                      )}

                      {!state.successMsg && (
                        <>
                          <p className="text-[11px] text-[#888888] mt-3 mb-2 uppercase tracking-wider">
                            {config.label}
                          </p>
                          <div className="space-y-2">
                            {matchedVolunteers.length === 0 ? (
                              <p className="text-xs text-[#888888] italic">
                                No volunteers available right now
                              </p>
                            ) : (
                              matchedVolunteers.map((v, vIdx) => (
                                <div
                                  key={v.id}
                                  data-ocid={`community.volunteer.select.${vIdx + 1}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[rgba(249,168,201,0.06)]"
                                  style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(160,190,210,0.07)",
                                  }}
                                >
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d0d0d] font-bold text-[10px] flex-shrink-0"
                                    style={{ background: v.color }}
                                  >
                                    {v.initials}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-[#ffffff] truncate">
                                      {v.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span
                                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                                        style={{
                                          background: "rgba(249,168,201,0.12)",
                                          color: "#f9a8c9",
                                        }}
                                      >
                                        {v.skill}
                                      </span>
                                      <span className="text-[9px] text-[#888888]">
                                        {v.distance}
                                      </span>
                                      <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: "#f9a8c9" }}
                                      />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    data-ocid={`community.select.button.${vIdx + 1}`}
                                    onClick={() =>
                                      selectVolunteer(req.id, v.name)
                                    }
                                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-105 active:scale-95"
                                    style={{
                                      background: "rgba(249,168,201,0.18)",
                                      color: "#f9a8c9",
                                      border: "1px solid rgba(249,168,201,0.3)",
                                    }}
                                  >
                                    Select
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Medicine delivery: extra Order Online button */}
                          {req.id === 3 && (
                            <button
                              type="button"
                              data-ocid="community.order.online.button"
                              onClick={() => navigate({ to: "/medicine" })}
                              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
                              style={{
                                background: "rgba(249,168,201,0.14)",
                                color: "#f9a8c9",
                                border: "1px solid rgba(249,168,201,0.28)",
                              }}
                            >
                              <ShoppingBag size={13} />
                              Order Medicine Online
                              <ExternalLink size={11} className="opacity-60" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

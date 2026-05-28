import { Bell, CheckCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type AppNotification,
  useNotifications,
} from "../../context/NotificationContext";

type Notification = AppNotification;

const typeColors: Record<string, string> = {
  success: "#4ade80",
  info: "#60a5fa",
  warning: "#fbbf24",
  error: "#f87171",
};

const typeLabels: Record<string, string> = {
  success: "Success",
  info: "Info",
  warning: "Reminder",
  error: "Alert",
};

export default function NotificationDropdown() {
  const {
    notifications: items,
    markRead,
    markAllRead,
    unreadCount,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unread = unreadCount;

  // Calculate panel position from button's screen coordinates
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  const handleClickNotification = (n: Notification) => {
    markRead(n.id);
    setSelected({ ...n, read: true });
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen(!open);
          setSelected(null);
        }}
        className="relative p-2 rounded-xl text-[#cccccc] hover:text-[#f9a8c9] hover:bg-[rgba(249,168,201,0.1)] transition-all"
        style={{
          minWidth: 44,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#f9a8c9] text-black text-[9px] flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <>
            {/* Full-screen opaque backdrop — blocks all other UI interaction */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                background: "rgba(0, 0, 0, 0.80)",
              }}
              onClick={handleClose}
              onKeyDown={(e) => e.key === "Escape" && handleClose()}
              role="button"
              tabIndex={-1}
              aria-label="Close notifications"
            />

            {/* Notification panel — solid, fully opaque */}
            <div
              style={{
                position: "fixed",
                top: panelPos.top,
                right: panelPos.right,
                zIndex: 9999,
                width: 320,
                borderRadius: 16,
                overflow: "hidden",
                background: "#111111",
                border: "1px solid rgba(249,168,201,0.3)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(249,168,201,0.1)",
              }}
            >
              {selected ? (
                /* Detail view */
                <div style={{ background: "#111111" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      background: "#111111",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      style={{
                        color: "#888",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ← Back
                    </button>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#ffffff",
                        marginLeft: "auto",
                      }}
                    >
                      Notification Detail
                    </span>
                  </div>
                  <div style={{ padding: 20, background: "#111111" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: typeColors[selected.type],
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: `${typeColors[selected.type]}22`,
                          color: typeColors[selected.type],
                        }}
                      >
                        {typeLabels[selected.type]}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: 8,
                      }}
                    >
                      {selected.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#cccccc",
                        lineHeight: 1.6,
                        marginBottom: 16,
                      }}
                    >
                      {selected.message}
                    </p>
                    <p style={{ fontSize: 11, color: "#666" }}>
                      {selected.time}
                    </p>
                  </div>
                </div>
              ) : (
                /* List view */
                <div style={{ background: "#111111" }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      background: "#111111",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#ffffff",
                          margin: 0,
                        }}
                      >
                        Notifications
                      </h3>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#f9a8c9",
                          marginTop: 2,
                        }}
                      >
                        {unread > 0 ? `${unread} unread` : "All caught up"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {unread > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          title="Mark all as read"
                          style={{
                            padding: 6,
                            borderRadius: 8,
                            color: "#888",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <CheckCheck size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleClose}
                        style={{
                          padding: 6,
                          borderRadius: 8,
                          color: "#888",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Notification list */}
                  <div
                    style={{
                      maxHeight: 288,
                      overflowY: "auto",
                      WebkitOverflowScrolling: "touch",
                      background: "#111111",
                    }}
                  >
                    {items.length === 0 ? (
                      <div
                        style={{
                          padding: "32px 16px",
                          textAlign: "center",
                          color: "#555",
                          fontSize: 13,
                          background: "#111111",
                        }}
                      >
                        No notifications yet
                      </div>
                    ) : (
                      items.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => handleClickNotification(n)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            background: !n.read
                              ? "rgba(249,168,201,0.07)"
                              : "#111111",
                            border: "none",
                            cursor: "pointer",
                            display: "block",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "rgba(249,168,201,0.12)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = !n.read
                              ? "rgba(249,168,201,0.07)"
                              : "#111111";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: typeColors[n.type],
                                flexShrink: 0,
                                marginTop: 4,
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: !n.read ? "#ffffff" : "#aaaaaa",
                                  margin: 0,
                                }}
                              >
                                {n.title}
                              </p>
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "#888",
                                  marginTop: 2,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {n.message}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#555",
                                  marginTop: 4,
                                }}
                              >
                                {n.time}
                              </p>
                            </div>
                            {!n.read && (
                              <div
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#f9a8c9",
                                  flexShrink: 0,
                                  marginTop: 6,
                                }}
                              />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      background: "#111111",
                    }}
                  >
                    <span style={{ fontSize: 11, color: "#555" }}>
                      Click a notification to view details
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

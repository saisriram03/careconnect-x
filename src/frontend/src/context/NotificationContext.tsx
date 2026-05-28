import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { notifications as seedNotifications } from "../data/dummyData";

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning" | "error";
  route?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "time" | "read">) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

let nextId = seedNotifications.length + 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    seedNotifications.map((n) => ({ ...n }) as AppNotification),
  );

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "time" | "read">) => {
      const newItem: AppNotification = {
        ...n,
        id: nextId++,
        time: "Just now",
        read: false,
      };
      setNotifications((prev) => [newItem, ...prev]);
    },
    [],
  );

  const markRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markRead,
        markAllRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  return ctx;
}

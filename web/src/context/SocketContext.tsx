import { BASE_URL, TokenManager } from "@ahmedrioueche/gympro-client";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { notificationKeys } from "../hooks/queries/useNotifications";
import { useUserStore } from "../store/user";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = TokenManager.getAccessToken();
    const serverUrl = BASE_URL().replace("/api", "");

    if (!socketRef.current) {
      console.log("Initializing socket connection to:", serverUrl);
      socketRef.current = io(`${serverUrl}/notifications`, {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        console.log("✅ Connected to notifications gateway");
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("❌ Disconnected from notifications gateway");
      });

      socketRef.current.on("notification", (notification: any) => {
        console.log("🔔 New notification received:", notification);

        // 1. Show a toast
        toast.success(notification.title || "New notification", {
          icon: "🔔",
          duration: 4000,
        });

        // 2. Invalidate notifications queries to trigger a refresh
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }

    return () => {
      // We keep the socket alive as long as authenticated
    };
  }, [isAuthenticated, user, queryClient]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

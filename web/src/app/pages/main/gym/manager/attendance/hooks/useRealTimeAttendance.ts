import { useEffect, useState } from "react";
import { useSocket } from "../../../../../../../context/SocketContext";
import { useGymStore } from "../../../../../../../store/gym";
import type { ScanResult } from "../../../../../../../types/common";

export const useRealTimeAttendance = () => {
  const { currentGym } = useGymStore();
  const { socket } = useSocket();
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    if (!socket || !currentGym?._id) return;

    // Join gym room
    socket.emit("join_gym", { gymId: currentGym._id });

    // Listen for access attempts
    const handleAccessAttempt = (data: any) => {
      console.log("🔔 Real-time access attempt:", data);
      setLastResult({
        status: data.status,
        name: data.name,
        photo: data.photo,
        reason: data.reason,
        expiry: data.expiry ? new Date(data.expiry) : undefined,
        timestamp: new Date(data.timestamp),
      });

      // Clear after 4 seconds
      setTimeout(() => setLastResult(null), 4000);
    };

    socket.on("access_attempt", handleAccessAttempt);

    return () => {
      socket.off("access_attempt", handleAccessAttempt);
    };
  }, [socket, currentGym?._id]);

  return {
    lastResult,
    clearResult: () => setLastResult(null),
  };
};

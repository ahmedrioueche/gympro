import { useEffect } from "react";
import { useSocket } from "../../../../../../../context/SocketContext";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import type { ScanResult } from "../../../../../../../types/common";

export const useRealTimeAttendance = () => {
  const { currentGym } = useGymStore();
  const { socket, isConnected } = useSocket();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (!socket || !isConnected || !currentGym?._id) return;

    // Join gym room
    console.log(`🔌 Joining gym room: gym_${currentGym._id}`);
    socket.emit("join_gym", { gymId: currentGym._id });

    // Listen for access attempts
    const handleAccessAttempt = (data: any) => {
      console.log("🔔 Real-time access attempt:", data);

      const result: ScanResult = {
        status: data.status,
        name: data.name,
        photo: data.photo,
        reason: data.reason,
        expiry: data.expiry ? new Date(data.expiry) : undefined,
        timestamp: new Date(data.timestamp),
      };

      openModal("scan_result", { result });

      // Clear after 4 seconds
      setTimeout(() => closeModal(), 4000);
    };

    socket.on("access_attempt", handleAccessAttempt);

    return () => {
      socket.off("access_attempt", handleAccessAttempt);
    };
  }, [socket, isConnected, currentGym?._id, openModal, closeModal]);
};

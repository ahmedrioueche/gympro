import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "../../../../../../../context/SocketContext";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import type { ScanResult } from "../../../../../../../types/common";

export const useRealTimeAttendance = () => {
  const { currentGym } = useGymStore();
  const { socket, isConnected } = useSocket();
  const { openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      console.log("❌ [useRealTimeAttendance] Socket not available");
      return;
    }
    if (!isConnected) {
      console.log("❌ [useRealTimeAttendance] Socket not connected");
      return;
    }
    if (!currentGym?._id) {
      console.log("❌ [useRealTimeAttendance] No active gym selected");
      return;
    }

    // Join gym room
    console.log(
      `🔌 [useRealTimeAttendance] Joining gym room: gym_${currentGym._id}`
    );
    socket.emit("join_gym", { gymId: currentGym._id });

    // Listen for access attempts
    const handleAccessAttempt = (data: any) => {
      console.log(
        "🔔 [useRealTimeAttendance] Real-time access attempt received:",
        data
      );

      // 1. Invalidate queries to refresh the list instantly
      console.log("🔄 [useRealTimeAttendance] Invalidating attendance logs...");
      queryClient.invalidateQueries({
        queryKey: ["attendance-logs", currentGym._id],
      });

      // 2. Open the modal
      const result: ScanResult = {
        status: data.status,
        name: data.name,
        photo: data.photo,
        reason: data.reason,
        expiry: data.expiry ? new Date(data.expiry) : undefined,
        timestamp: new Date(data.timestamp),
      };

      console.log(
        "📱 [useRealTimeAttendance] Opening modal with result:",
        result
      );
      openModal("scan_result", { result });

      // Clear after 4 seconds
      setTimeout(() => {
        console.log("⏲️ [useRealTimeAttendance] Auto-closing modal");
        closeModal();
      }, 4000);
    };

    socket.on("access_attempt", handleAccessAttempt);
    // Debug: Listen for join confirmation if available (optional)
    // socket.on("joined_gym", (room) => console.log(`✅ Joined ${room}`));

    return () => {
      console.log("🛑 [useRealTimeAttendance] Cleaning up listener");
      socket.off("access_attempt", handleAccessAttempt);
    };
  }, [
    socket,
    isConnected,
    currentGym?._id,
    openModal,
    closeModal,
    queryClient,
  ]);
};

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAttendance } from "../../../../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import { useAudioFeedback } from "./useAudioFeedback";
import { useScanner } from "./useScanner";

export type AccessMethod = "qr" | "pin" | "rfid";

export const useAccessPage = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { checkIn, checkInByPin, checkInByRfid, isCheckingIn } = useAttendance(
    currentGym?._id,
    true,
  );
  const { playSound } = useAudioFeedback();
  const { openModal, closeModal } = useModalStore();

  const lastScanTimeRef = useRef<number>(0);
  const isCheckingInRef = useRef(false);
  const isVerifyingRef = useRef(false);

  const [activeMethod, setActiveMethod] = useState<AccessMethod>("qr");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync isCheckingIn with ref for use in callback
  isCheckingInRef.current = isCheckingIn;

  const handleAccessResult = useCallback(
    (response: any) => {
      if (response.success) {
        playSound("success");
        openModal("scan_result", {
          result: {
            status: "granted",
            name:
              (response.data as any).userId?.profile?.fullName ||
              t("common.member"),
            photo: (response.data as any).userId?.profile?.profileImageUrl,
            expiry: (response.data as any).expiryDate,
            timestamp: new Date(),
          },
        });
      } else {
        if (response.data) {
          playSound("error");
          openModal("scan_result", {
            result: {
              status: "denied",
              name:
                (response.data as any).userId?.profile?.fullName ||
                t("common.member"),
              photo: (response.data as any).userId?.profile?.profileImageUrl,
              expiry: (response.data as any).expiryDate,
              reason: response.message || t("access.status.denied"),
              timestamp: new Date(),
            },
          });
        } else {
          throw new Error(response.message || t("access.status.denied"));
        }
      }

      // Auto-clear result after 4 seconds
      setTimeout(() => closeModal(), 4000);
    },
    [playSound, openModal, t, closeModal],
  );

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      const now = Date.now();
      if (now - lastScanTimeRef.current < 3000) return;
      if (isCheckingInRef.current || isVerifyingRef.current) return;

      lastScanTimeRef.current = now;
      isVerifyingRef.current = true;

      try {
        const response = await checkIn({
          token: decodedText,
          gymId: currentGym?._id!,
        });
        handleAccessResult(response);
      } catch (error: any) {
        playSound("error");
        openModal("scan_result", {
          result: {
            status: "denied",
            reason: error.message || t("access.status.invalid"),
            timestamp: new Date(),
          },
        });
      } finally {
        isVerifyingRef.current = false;
      }
    },
    [currentGym?._id, checkIn, playSound, openModal, t, handleAccessResult],
  );

  const handlePinComplete = async (pin: string) => {
    if (isCheckingIn || isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    try {
      const response = await checkInByPin({
        pin,
        gymId: currentGym?._id!,
      });
      handleAccessResult(response);
    } catch (error: any) {
      playSound("error");
      openModal("scan_result", {
        result: {
          status: "denied",
          reason: error.message || t("access.status.invalid"),
          timestamp: new Date(),
        },
      });
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const handleRfidTap = async () => {
    const rfidId = prompt(
      t("access.rfid.simulation_prompt", "Scan RFID Tag (Enter ID)"),
    );
    if (!rfidId) return;

    if (isCheckingIn || isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    try {
      const response = await checkInByRfid({
        rfidId,
        gymId: currentGym?._id!,
      });
      handleAccessResult(response);
    } catch (error: any) {
      playSound("error");
      openModal("scan_result", {
        result: {
          status: "denied",
          reason: error.message || t("access.status.invalid"),
          timestamp: new Date(),
        },
      });
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const {
    isScannerReady,
    isMirrored,
    setIsMirrored,
    cameraError,
    startScanner,
  } = useScanner({
    onScanSuccess: handleScanSuccess,
    enabled: activeMethod === "qr",
  });

  const tabs = [
    { id: "qr", label: t("access.method.qr") },
    { id: "pin", label: t("access.method.pin") },
    { id: "rfid", label: t("access.method.rfid") },
  ];

  const handleTabChange = (id: string) => {
    setActiveMethod(id as AccessMethod);
    setIsFullscreen(false);
  };

  return {
    t,
    activeMethod,
    isFullscreen,
    setIsFullscreen,
    tabs,
    handleTabChange,
    isCheckingIn,
    handlePinComplete,
    handleRfidTap,
    isScannerReady,
    isMirrored,
    setIsMirrored,
    cameraError,
    startScanner,
  };
};

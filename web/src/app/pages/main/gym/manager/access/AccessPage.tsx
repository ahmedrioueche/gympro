import { useNavigate } from "@tanstack/react-router";
import { Key } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAttendance } from "../../../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../../../store/gym";
import type { ScanResult } from "../../../../../../types/common";
import PageHeader from "../../../../../components/PageHeader";
import { ScanResultModal } from "../../../../../components/ScanResultModal";
import { ScannerView } from "./components/ScannerView";
import { useAudioFeedback } from "./hooks/useAudioFeedback";
import { useScanner } from "./hooks/useScanner";

const AccessPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { checkIn, isCheckingIn } = useAttendance(currentGym?._id, true);
  const navigate = useNavigate();
  const { playSound } = useAudioFeedback();
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const isCheckingInRef = useRef(false);
  const isVerifyingRef = useRef(false);

  // Sync isCheckingIn with ref for use in callback
  isCheckingInRef.current = isCheckingIn;

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      const now = Date.now();
      // Rate limit scans (3 seconds)
      if (now - lastScanTimeRef.current < 3000) return;
      if (isCheckingInRef.current || isVerifyingRef.current) return;

      lastScanTimeRef.current = now;
      isVerifyingRef.current = true;
      setLastResult({ status: "verifying", timestamp: new Date() });

      try {
        const response = await checkIn({
          token: decodedText,
          gymId: currentGym?._id!,
        });

        if (response.success) {
          playSound("success");
          setLastResult({
            status: "granted",
            name:
              (response.data as any).userId?.profile?.fullName ||
              t("common.member"),
            photo: (response.data as any).userId?.profile?.profileImageUrl,
            expiry: (response.data as any).expiryDate,
            timestamp: new Date(),
          });
        } else {
          throw new Error(response.message || t("access.status.denied"));
        }
      } catch (error: any) {
        playSound("error");
        setLastResult({
          status: "denied",
          reason: error.message || t("access.status.invalid"),
          timestamp: new Date(),
        });
      } finally {
        isVerifyingRef.current = false;
      }

      // Auto-clear result after 4 seconds
      setTimeout(() => setLastResult(null), 4000);
    },
    [currentGym?._id, checkIn, playSound]
  );

  const {
    isScannerReady,
    isMirrored,
    setIsMirrored,
    cameraError,
    startScanner,
  } = useScanner({ onScanSuccess: handleScanSuccess });

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("access.title")}
        subtitle={t("access.subtitle")}
        icon={Key}
      />

      <div className="mt-8 space-y-6">
        <ScannerView
          isScannerReady={isScannerReady}
          cameraError={cameraError}
          isMirrored={isMirrored}
          onToggleMirror={() => setIsMirrored(!isMirrored)}
          onRetry={startScanner}
        />
      </div>

      <ScanResultModal
        result={lastResult}
        onClose={() => setLastResult(null)}
      />

      <style>
        {`
          #qr-reader video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          #qr-reader {
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(250px); }
            100% { transform: translateY(0); }
          }
          @keyframes progress {
            0% { width: 100%; }
            100% { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default AccessPage;

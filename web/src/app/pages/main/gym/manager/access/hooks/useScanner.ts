import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface ScanResult {
  status: "granted" | "denied" | "verifying";
  name?: string;
  photo?: string;
  reason?: string;
  expiry?: string;
  timestamp: Date;
}

interface UseScannerProps {
  onScanSuccess: (decodedText: string) => Promise<void>;
}

export const useScanner = ({ onScanSuccess }: UseScannerProps) => {
  const { t } = useTranslation();
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const onScanSuccessRef = useRef(onScanSuccess);
  onScanSuccessRef.current = onScanSuccess;

  const startScanner = useCallback(async () => {
    if (
      isStartingRef.current ||
      isTransitioningRef.current ||
      (scannerRef.current && scannerRef.current.isScanning)
    ) {
      return;
    }

    if (!scannerRef.current) {
      try {
        scannerRef.current = new Html5Qrcode("qr-reader");
      } catch (e) {
        console.error("Scanner creation failed:", e);
        return;
      }
    }

    isStartingRef.current = true;
    isTransitioningRef.current = true;
    try {
      setCameraError(null);

      const config = {
        fps: 25,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdge * 0.85);
          return { width: qrboxSize, height: qrboxSize };
        },
      };

      const scanWrapper = (text: string) => onScanSuccessRef.current(text);

      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          scanWrapper,
          () => {}
        );
      } catch (err: any) {
        if (err?.toString().includes("transition")) {
          console.warn("Scanner transition in progress, skipping start");
          return;
        }

        console.warn(
          "Environment camera failed, falling back to user camera:",
          err
        );
        await new Promise((r) => setTimeout(r, 200));

        if (scannerRef.current && !scannerRef.current.isScanning) {
          await scannerRef.current.start(
            { facingMode: "user" },
            config,
            scanWrapper,
            () => {}
          );
        }
      }

      setIsScannerReady(true);
    } catch (err: any) {
      console.error("Failed to start scanner:", err);
      if (!scannerRef.current?.isScanning) {
        setCameraError(t("access.scanner.error_camera"));
        setIsScannerReady(false);
      }
    } finally {
      isStartingRef.current = false;
      isTransitioningRef.current = false;
    }
  }, [t]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        isTransitioningRef.current = true;
        await scannerRef.current.stop();
        setIsScannerReady(false);
      } catch (e) {
        console.error("Error stopping scanner:", e);
      } finally {
        isTransitioningRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(() => {
      if (active) startScanner();
    }, 600);

    return () => {
      active = false;
      clearTimeout(timeout);
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return {
    isScannerReady,
    isMirrored,
    setIsMirrored,
    cameraError,
    startScanner,
    stopScanner,
  };
};

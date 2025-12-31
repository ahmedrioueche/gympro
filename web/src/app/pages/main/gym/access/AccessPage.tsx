import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Html5Qrcode } from "html5-qrcode";
import { Ban, Camera, Key, Loader2, Logs, ShieldCheck, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useAttendance } from "../../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../../store/gym";
import { cn } from "../../../../../utils/helper";
import PageHeader from "../../../../components/PageHeader";

interface ScanResult {
  status: "granted" | "denied" | "verifying";
  name?: string;
  photo?: string;
  reason?: string;
  expiry?: string;
  timestamp: Date;
}

const AccessPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { checkIn, isCheckingIn } = useAttendance(currentGym?._id, true);
  const navigate = useNavigate();
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScanTimeRef = useRef<number>(0);

  const lastResultRef = useRef<ScanResult | null>(null);
  const isCheckingInRef = useRef(false);
  const isStartingRef = useRef(false);

  useEffect(() => {
    lastResultRef.current = lastResult;
  }, [lastResult]);

  useEffect(() => {
    isCheckingInRef.current = isCheckingIn;
  }, [isCheckingIn]);

  const playSound = useCallback((type: "success" | "error") => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc2.type = "square";
        osc2.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }, []);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      const now = Date.now();
      if (now - lastScanTimeRef.current < 3000) return;

      if (
        isCheckingInRef.current ||
        lastResultRef.current?.status === "verifying"
      )
        return;

      lastScanTimeRef.current = now;
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
            name: (response.data as any).userId?.profile?.fullName || "Member",
            photo: (response.data as any).userId?.profile?.profileImageUrl,
            expiry: (response.data as any).expiryDate,
            timestamp: new Date(),
          });
        } else {
          throw new Error(response.message || "Access Denied");
        }
      } catch (error: any) {
        playSound("error");
        setLastResult({
          status: "denied",
          reason: error.message || "Invalid QR Code",
          timestamp: new Date(),
        });
      }

      setTimeout(() => setLastResult(null), 4000);
    },
    [currentGym?._id, checkIn, playSound]
  );

  const startScanner = useCallback(async () => {
    if (
      isStartingRef.current ||
      (scannerRef.current && scannerRef.current.isScanning)
    ) {
      return;
    }

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }

    isStartingRef.current = true;
    try {
      setCameraError(null);

      const config = {
        fps: 20,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdge * 0.75);
          return { width: qrboxSize, height: qrboxSize };
        },
      };

      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          handleScanSuccess,
          () => {}
        );
      } catch (err) {
        console.warn(
          "Environment camera failed, falling back to user camera:",
          err
        );
        await scannerRef.current.start(
          { facingMode: "user" },
          config,
          handleScanSuccess,
          () => {}
        );
      }

      setIsScannerReady(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      if (!scannerRef.current?.isScanning) {
        setCameraError(t("access.scanner.error_camera"));
        setIsScannerReady(false);
      }
    } finally {
      isStartingRef.current = false;
    }
  }, [handleScanSuccess, t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [startScanner]);

  return (
    <div className="max-w-7xl p-4 md:p-6 lg:py-8 mx-auto animate-in fade-in duration-700">
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
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(250px);
            }
            100% {
              transform: translateY(0);
            }
          }
          @keyframes progress {
            0% {
              width: 100%;
            }
            100% {
              width: 0%;
            }
          }
        `}
      </style>
      <PageHeader
        title={t("access.title")}
        subtitle={t("access.subtitle")}
        icon={Key}
        actionButton={{
          label: t("access.view_access_logs"),
          onClick: () => {
            navigate({ to: APP_PAGES.gym.accessLogs.link });
          },
          icon: Logs,
        }}
      />

      <div className="mt-8 space-y-6">
        <div
          ref={containerRef}
          className="relative group transition-all duration-500"
        >
          <div className="relative bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl rounded-3xl transition-all duration-500">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Camera className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-zinc-100">
                  {t("access.scanner.title")}
                </h3>
              </div>
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  isMirrored
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                {isMirrored ? "Mirrored" : "Normal View"}
              </button>
            </div>

            <div className="relative bg-black overflow-hidden flex items-center justify-center">
              <div
                id="qr-reader"
                className={cn(
                  "max-w-full transition-transform duration-300",
                  isMirrored ? "-scale-x-100" : ""
                )}
              ></div>

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-blue-500/30 rounded-[2.5rem] relative">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>

                  <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_2.5s_linear_infinite] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {!isScannerReady && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-20">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-zinc-100 font-bold uppercase tracking-widest text-sm">
                    {t("access.scanner.initializing")}
                  </p>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md px-6 text-center z-20">
                  <div className="p-5 bg-rose-500/10 rounded-full mb-6 border border-rose-500/20">
                    <Camera className="w-12 h-12 text-rose-500" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
                    {t("access.scanner.error_title")}
                  </h4>
                  <p className="text-zinc-400 max-w-sm mb-8 font-medium">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => startScanner()}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                  >
                    {t("access.scanner.retry")}
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800">
              <div className="flex items-center justify-center gap-3 text-zinc-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-bold uppercase tracking-wide">
                  {t("access.scanner.instruction")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lastResult && lastResult.status !== "verifying" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className={cn(
              "w-full max-w-md bg-zinc-900 border-2 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500",
              lastResult.status === "granted"
                ? "border-emerald-500/50 shadow-emerald-500/10"
                : "border-rose-500/50 shadow-rose-500/10"
            )}
          >
            <div className="p-8 text-center relative">
              <button
                onClick={() => setLastResult(null)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-6">
                <div
                  className={cn(
                    "p-6 rounded-full relative",
                    lastResult.status === "granted"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  )}
                >
                  {lastResult.status === "granted" ? (
                    <>
                      <ShieldCheck className="w-20 h-20 relative z-10" />
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping pointer-events-none"></div>
                    </>
                  ) : (
                    <>
                      <Ban className="w-20 h-20 relative z-10" />
                      <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping pointer-events-none"></div>
                    </>
                  )}
                </div>

                <div>
                  <h4
                    className={cn(
                      "text-3xl font-black tracking-tight mb-2 uppercase italic",
                      lastResult.status === "granted"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    )}
                  >
                    {lastResult.status === "granted"
                      ? t("access.status.granted")
                      : t("access.status.denied")}
                  </h4>
                  {lastResult.status === "granted" ? (
                    <p className="text-zinc-400 text-lg font-medium">
                      {t("access.status.welcome", { name: lastResult.name })}
                    </p>
                  ) : (
                    <p className="text-zinc-400 text-lg font-medium">
                      {lastResult.reason || t("access.status.invalid")}
                    </p>
                  )}
                </div>

                {lastResult.status === "granted" && (
                  <div className="flex flex-col items-center gap-4 mt-2">
                    {lastResult.photo && (
                      <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-2xl">
                        <img
                          src={lastResult.photo}
                          alt={lastResult.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {lastResult.expiry && (
                      <div className="px-4 py-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">
                          {t("access.status.expiry_label")}
                        </p>
                        <p className="text-emerald-400 font-bold">
                          {format(new Date(lastResult.expiry), "PPP")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className={cn(
                "h-2 w-full",
                lastResult.status === "granted"
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              )}
            >
              <div className="h-full bg-white/30 animate-[progress_4s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessPage;

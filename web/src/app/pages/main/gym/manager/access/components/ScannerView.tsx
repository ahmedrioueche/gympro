import { Camera, Loader2, ShieldCheck } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../utils/helper";

interface ScannerViewProps {
  isScannerReady: boolean;
  cameraError: string | null;
  isMirrored: boolean;
  onToggleMirror: () => void;
  onRetry: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  isScannerReady,
  cameraError,
  isMirrored,
  onToggleMirror,
  onRetry,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative group transition-all duration-500">
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
            onClick={onToggleMirror}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              isMirrored
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            )}
          >
            {isMirrored
              ? t("access.scanner.mirrored")
              : t("access.scanner.normal")}
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
            <div className="w-[75%] h-[75%] max-w-[400px] max-h-[400px] border-2 border-dashed border-blue-500/30 rounded-[2rem] md:rounded-[3rem] relative">
              <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl md:rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl md:rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl md:rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-blue-500 rounded-br-2xl md:rounded-br-3xl"></div>

              <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_2.5s_linear_infinite] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
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
                onClick={onRetry}
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
  );
};

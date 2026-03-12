import { X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../../utils/helper";
import { ScannerView } from "../ScannerView";

interface QRMethodViewProps {
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  isScannerReady: boolean;
  cameraError: string | null;
  isMirrored: boolean;
  setIsMirrored: (v: boolean) => void;
  startScanner: () => void;
}

export const QRMethodView: React.FC<QRMethodViewProps> = ({
  isFullscreen,
  setIsFullscreen,
  isScannerReady,
  cameraError,
  isMirrored,
  setIsMirrored,
  startScanner,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isFullscreen
          ? "fixed inset-0 z-[45] bg-zinc-950/98 flex items-center justify-center p-6 md:p-12 animate-in fade-in"
          : "w-full relative group",
      )}
    >
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-8 right-8 p-4 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full active:scale-90 transition-all shadow-2xl z-[10000]"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div
        className={cn(
          "transition-all duration-500 overflow-hidden",
          isFullscreen
            ? "w-full max-w-[50vw] h-[99vh] rounded-[2.5rem] border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black"
            : "rounded-3xl",
        )}
      >
        <ScannerView
          isScannerReady={isScannerReady}
          cameraError={cameraError}
          isMirrored={isMirrored}
          onToggleMirror={() => setIsMirrored(!isMirrored)}
          onRetry={startScanner}
          onMaximize={!isFullscreen ? () => setIsFullscreen(true) : undefined}
          className="w-full h-full"
        />
      </div>

      {isFullscreen && (
        <p className="fixed bottom-8 text-zinc-500 font-bold uppercase tracking-[0.3em] text-center text-[10px] animate-pulse">
          {t("gymMember.access.qr.tapToClose")}
        </p>
      )}
    </div>
  );
};

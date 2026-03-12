import React from "react";
import { RefreshCw, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../../utils/helper";

interface MemberQRViewProps {
  token: string | null;
  isLoading: boolean;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
}

export const MemberQRView: React.FC<MemberQRViewProps> = ({
  token,
  isLoading,
  isFullscreen,
  setIsFullscreen,
}) => {
  const { t } = useTranslation();

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in duration-300"
        onClick={() => setIsFullscreen(false)}
      >
        <button
          className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full active:scale-90 transition-all"
          aria-label={t("common.close")}
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.1)]">
          <QRCodeSVG
            value={token || ""}
            size={Math.min(
              Math.min(window.innerWidth, window.innerHeight) * 0.7,
              500,
            )}
            level="M"
          />
        </div>

        <p className="mt-8 md:mt-12 text-zinc-500 font-bold uppercase tracking-widest text-center text-xs md:text-sm">
          {t("gymMember.access.qr.tapToClose")}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={() => token && setIsFullscreen(true)}
      className={cn(
        "relative bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_60px_rgba(255,255,255,0.03)] group transition-all duration-500 flex items-center justify-center",
        token
          ? "cursor-zoom-in hover:scale-[1.02]"
          : "opacity-50 grayscale scale-95",
      )}
    >
      {isLoading ? (
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center bg-zinc-50 rounded-[1.5rem] md:rounded-[2rem]">
          <RefreshCw className="w-10 h-10 md:w-12 h-12 text-zinc-300 animate-spin" />
        </div>
      ) : token ? (
        <div className="relative">
          <QRCodeSVG
            value={token}
            size={256}
            level="M"
            includeMargin={false}
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
          />
          <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl md:rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl md:rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl md:rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 border-b-4 border-r-4 border-primary rounded-br-2xl md:rounded-br-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </div>
      ) : (
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex flex-col items-center justify-center bg-zinc-50 rounded-[1.5rem] md:rounded-[2rem]">
          <p className="text-zinc-400 font-bold px-4 md:px-6 uppercase tracking-wider text-[10px] md:text-sm">
            {t("gymMember.access.qr.generating")}
          </p>
        </div>
      )}
    </div>
  );
};

import { Eye, EyeOff, Hash, Maximize2, X } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/helper";

export interface PinViewProps {
  pinCode?: string;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

export const PinView: React.FC<PinViewProps> = ({
  pinCode,
  isFullscreen,
  setIsFullscreen,
}) => {
  const { t } = useTranslation();
  const [showPin, setShowPin] = useState(false);

  if (!pinCode) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
        <Hash className="w-12 h-12 opacity-20" />
        <p className="font-medium tracking-tight">
          {t("access.management.not_set")}
        </p>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in duration-300"
        onClick={() => setIsFullscreen(false)}
      >
        <button
          className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full active:scale-90 transition-all"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="flex justify-center gap-4 md:gap-6 p-10 md:p-12 bg-zinc-900/40 rounded-[3rem] border border-white/10 backdrop-blur-2xl">
          {pinCode.split("").map((digit, i) => (
            <div
              key={i}
              className="w-14 h-20 md:w-20 md:h-28 flex items-center justify-center bg-zinc-950 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-3xl"
            >
              <span className="text-4xl md:text-6xl font-black text-white font-mono">
                {digit}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 md:mt-12 text-zinc-500 font-bold uppercase tracking-widest text-center text-xs md:text-sm">
          {t("gymMember.access.qr.tapToClose")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-6 group cursor-pointer"
      onClick={() => setIsFullscreen(true)}
    >
      <div className="relative w-full max-sm:max-w-xs">
        <div className="flex justify-center gap-3 md:gap-4 p-8 md:p-10 bg-zinc-800/20 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:bg-zinc-800/40">
          {pinCode.split("").map((digit, i) => (
            <div
              key={i}
              className="w-10 h-14 md:w-14 md:h-20 flex items-center justify-center bg-zinc-900 rounded-xl md:rounded-2xl border border-white/5 shadow-2xl overflow-hidden"
            >
              {showPin ? (
                <span className="text-2xl md:text-4xl font-black text-white font-mono">
                  {digit}
                </span>
              ) : (
                <div className="w-2.5 h-2.5 md:w-4 md:h-4 bg-primary rounded-full" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPin(!showPin);
          }}
          className="absolute -top-3 -right-3 p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-xl active:scale-95 z-20"
        >
          {showPin ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Maximize2 className="w-4 h-4" />
        <p className="text-xs font-bold uppercase tracking-widest">
          {t("gymMember.access.qr.tapToExpand")}
        </p>
      </div>
    </div>
  );
};

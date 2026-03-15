import { Eye, EyeOff, Hash } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface PinViewProps {
  pinCode?: string;
}

export const PinView: React.FC<PinViewProps> = ({ pinCode }) => {
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

  return (
    <div className="w-full flex flex-col items-center gap-6 group">
      <div className="relative w-full max-sm:max-w-[280px]">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4 md:p-10 bg-zinc-800/20 rounded-[2rem] md:rounded-[3rem] border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:bg-zinc-800/40">
          {pinCode.split("").map((digit, i) => (
            <div
              key={i}
              className="w-8 h-12 md:w-14 md:h-20 flex items-center justify-center bg-zinc-900 rounded-lg md:rounded-2xl border border-white/5 shadow-2xl overflow-hidden"
            >
              {showPin ? (
                <span className="text-xl md:text-4xl font-black text-white font-mono">
                  {digit}
                </span>
              ) : (
                <div className="w-2 h-2 md:w-4 md:h-4 bg-primary rounded-full" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPin(!showPin);
          }}
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 p-2.5 md:p-3 bg-zinc-800 border border-zinc-700 rounded-xl md:rounded-2xl text-zinc-400 hover:text-white transition-all shadow-xl active:scale-95 z-20"
        >
          {showPin ? (
            <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Eye className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

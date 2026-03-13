import { CreditCard, Maximize2, Sparkles, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/helper";

export interface RFIDViewProps {
  rfidId?: string;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

export const RFIDView: React.FC<RFIDViewProps> = ({
  rfidId,
  isFullscreen,
  setIsFullscreen,
}) => {
  const { t } = useTranslation();

  if (!rfidId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
        <CreditCard className="w-12 h-12 opacity-20" />
        <p className="font-medium tracking-tight">
          {t("access.management.rfid_not_set", "RFID Card not linked")}
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

        <div className="w-full max-w-2xl aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[3rem] md:rounded-[4rem] border border-white/10 p-12 shadow-3xl text-left">
          <div className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Sparkles className="w-12 h-12 text-primary" />
              <p className="text-2xl font-black text-white/20 tracking-widest uppercase">
                GYMPRO
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-white/40 font-black uppercase tracking-[0.3em]">
                Active Card ID
              </p>
              <p className="text-4xl md:text-5xl font-black text-white tracking-[0.1em]">
                {rfidId.toUpperCase().replace(/(.{4})/g, "$1 ").trim()}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 md:mt-12 text-zinc-500 font-bold uppercase tracking-widest text-center text-xs md:text-sm">
          {t("gymMember.access.qr.tapToClose")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-8 group cursor-pointer"
      onClick={() => setIsFullscreen(true)}
    >
      <div className="relative w-full max-sm:max-w-xs aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[2rem] md:rounded-[3rem] border border-white/5 p-8 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-white/20 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-primary/20 blur-[60px] md:blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-emerald-500/10 blur-[40px] md:blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="p-3 md:p-4 bg-white/5 rounded-2xl md:rounded-[1.5rem] border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 md:w-6 h-6 text-primary" />
            </div>
            <div className="text-right">
              <p className="text-[10px] md:text-xs text-white/40 font-black uppercase tracking-widest leading-none mb-1">
                Access Card
              </p>
              <p className="text-xs md:text-sm font-black text-white/80 tracking-tighter">
                GYMPRO
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] md:text-xs text-white/40 font-black uppercase tracking-[0.2em] mb-1">
              Card ID
            </p>
            <p className="text-lg md:text-2xl font-black text-white tracking-[0.1em]">
              {rfidId.toUpperCase().replace(/(.{4})/g, "$1 ").trim()}
            </p>
          </div>
        </div>
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

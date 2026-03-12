import { CreditCard, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../../utils/helper";

interface MemberRFIDViewProps {
  rfidId?: string;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
}

export const MemberRFIDView: React.FC<MemberRFIDViewProps> = ({
  rfidId,
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
          className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full active:scale-90 transition-all font-black"
          aria-label={t("common.close")}
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="flex flex-col items-center gap-8">
          <div className="p-6 bg-primary/10 rounded-3xl">
            <CreditCard className="w-16 h-16 md:w-24 md:h-24 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-wider uppercase text-center">
            {rfidId}
          </h2>
        </div>

        <p className="mt-8 md:mt-12 text-zinc-500 font-bold uppercase tracking-widest text-center text-xs md:text-sm">
          {t("gymMember.access.qr.tapToClose")}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={() => rfidId && setIsFullscreen(true)}
      className={cn(
        "relative bg-zinc-800/50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-zinc-700/50 group transition-all duration-500 flex flex-col items-center gap-6",
        rfidId
          ? "cursor-zoom-in hover:scale-[1.02] hover:bg-zinc-800"
          : "opacity-50 grayscale",
      )}
    >
      <div className="p-4 bg-primary/10 rounded-2xl">
        <CreditCard className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2 text-center">
        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em]">
          {t("access.management.rfid_label")}
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-wider uppercase">
          {rfidId || t("access.management.not_linked")}
        </h2>
      </div>
    </div>
  );
};

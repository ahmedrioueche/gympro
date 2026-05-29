import { CreditCard, Maximize2, ShieldCheck, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../../utils/helper";

interface RFIDMethodViewProps {
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  onRfidTap: () => void;
}

export const RFIDMethodView: React.FC<RFIDMethodViewProps> = ({
  isFullscreen,
  setIsFullscreen,
  onRfidTap,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl transition-all duration-500 flex flex-col items-center text-center",
        isFullscreen
          ? "fixed inset-0 z-[45] bg-zinc-950/98 justify-center p-12"
          : "w-full max-w-2xl p-8 md:p-12 relative group",
      )}
    >
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className={cn(
          "p-2 text-zinc-500 hover:text-white transition-colors z-[10000]",
          isFullscreen
            ? "absolute top-8 right-8 bg-zinc-900 border border-zinc-800 rounded-full p-4"
            : "absolute top-6 right-6",
        )}
      >
        {isFullscreen ? (
          <X className="w-6 h-6" />
        ) : (
          <Maximize2 className="w-5 h-5" />
        )}
      </button>

      <div
        className={cn(
          "flex flex-col items-center gap-6",
          isFullscreen ? "py-4" : "py-12",
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className={cn(
              "bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center",
              isFullscreen ? "p-8" : "p-8",
            )}
          >
            <CreditCard
              className={cn(
                "text-primary",
                isFullscreen ? "w-12 h-12" : "w-16 h-16",
              )}
            />
          </div>
          <div
            className={cn(
              "absolute bg-emerald-500 rounded-full border-4 border-zinc-900 flex items-center justify-center",
              isFullscreen
                ? "-bottom-1 -right-1 p-2"
                : "-bottom-2 -right-2 p-3",
            )}
          >
            <ShieldCheck
              className={cn("text-white", isFullscreen ? "w-3 h-3" : "w-5 h-5")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3
            className={cn(
              "font-black text-white uppercase tracking-tight",
              isFullscreen ? "text-2xl" : "text-2xl",
            )}
          >
            {t("access.rfid.title")}
          </h3>
          <p
            className={cn(
              "text-zinc-400 mx-auto font-medium",
              isFullscreen ? "text-sm max-w-xs" : "text-base max-w-sm",
            )}
          >
            {t("access.rfid.instruction")}
          </p>
        </div>

        <div
          className={cn(
            "mt-4 flex flex-col gap-4 w-full",
            isFullscreen ? "mt-4" : "mt-8",
          )}
        >
          {!isFullscreen && (
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
              {t("access.rfid.hardware_hint")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

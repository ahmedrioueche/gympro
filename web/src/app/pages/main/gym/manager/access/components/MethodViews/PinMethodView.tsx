import { Hash, Maximize2, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../../utils/helper";
import { PinPad } from "../PinPad";

interface PinMethodViewProps {
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  onPinComplete: (pin: string) => void;
  isLoading: boolean;
}

export const PinMethodView: React.FC<PinMethodViewProps> = ({
  isFullscreen,
  setIsFullscreen,
  onPinComplete,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl transition-all duration-500 flex flex-col items-center",
        isFullscreen
          ? "fixed inset-0 z-[45] bg-zinc-950/98 justify-center p-12"
          : "w-full max-w-md p-8 md:p-12 relative group",
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
          "flex flex-col items-center gap-2 mb-10 text-center",
          isFullscreen ? "mb-6" : "mb-10",
        )}
      >
        <div
          className={cn(
            "bg-primary/10 rounded-2xl flex items-center justify-center",
            isFullscreen ? "p-3 mb-2" : "p-4 mb-0",
          )}
        >
          <Hash
            className={cn("text-primary", isFullscreen ? "w-6 h-6" : "w-8 h-8")}
          />
        </div>
        <h3
          className={cn(
            "font-black text-white uppercase tracking-tight",
            isFullscreen ? "text-xl" : "text-xl",
          )}
        >
          {t("access.pin.title")}
        </h3>
        {!isFullscreen && (
          <p className="text-zinc-500 text-sm">{t("access.pin.subtitle")}</p>
        )}
      </div>

      <PinPad
        onComplete={onPinComplete}
        isLoading={isLoading}
        size={isFullscreen ? "compact" : "normal"}
      />
    </div>
  );
};

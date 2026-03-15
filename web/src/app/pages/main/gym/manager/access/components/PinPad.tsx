import { Delete, X } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../utils/helper";

interface PinPadProps {
  onComplete: (pin: string) => void;
  isLoading?: boolean;
  size?: "normal" | "compact";
}

export const PinPad: React.FC<PinPadProps> = ({ 
  onComplete, 
  isLoading, 
  size = "normal" 
}) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");

  const handleNumberClick = (num: string) => {
    if (pin.length < 6 && !isLoading) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        onComplete(newPin);
        // Clear pin after a short delay to show the last digit
        setTimeout(() => setPin(""), 500);
      }
    }
  };

  const handleDelete = () => {
    if (!isLoading) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!isLoading) {
      setPin("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 animate-in fade-in zoom-in duration-500 w-full max-w-full">
      {/* PIN Display */}
      <div className={cn("flex justify-center flex-wrap gap-2 md:gap-3", size === "compact" ? "gap-1.5 md:gap-2" : "gap-2 md:gap-3")}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
              size === "compact" 
                ? "w-8 h-12 md:w-10 md:h-14 rounded-lg md:rounded-xl" 
                : "w-9 h-12 md:w-12 md:h-16 lg:w-14 lg:h-20",
              i < pin.length
                ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] scale-105"
                : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
            )}
          >
            {i < pin.length ? (
              <div className={cn("bg-primary rounded-full animate-in zoom-in", size === "compact" ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4")} />
            ) : (
              <div className={cn("bg-zinc-700 rounded-full", size === "compact" ? "w-0.5 h-0.5 md:w-1 md:h-1" : "w-1 h-1 md:w-1.5 md:h-1.5")} />
            )}
          </div>
        ))}
      </div>

      {/* Number Pad Grid */}
      <div className={cn("grid grid-cols-3", size === "compact" ? "gap-2 md:gap-3" : "gap-3 md:gap-4 lg:gap-6")}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            disabled={isLoading}
            className={cn(
              "rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 font-black text-zinc-100 hover:bg-zinc-700/50 hover:border-zinc-600 active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center",
              size === "compact" 
                ? "w-12 h-12 md:w-14 md:h-14 text-lg md:text-xl rounded-lg md:rounded-xl" 
                : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-xl lg:text-2xl"
            )}
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={isLoading || pin.length === 0}
          className={cn(
            "rounded-xl md:rounded-2xl bg-zinc-800/20 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 active:scale-95 transition-all flex items-center justify-center disabled:opacity-0",
            size === "compact" ? "w-12 h-12 md:w-14 md:h-14" : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
          )}
        >
          <X className={cn(size === "compact" ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-6 md:h-6")} />
        </button>
        <button
          onClick={() => handleNumberClick("0")}
          disabled={isLoading}
          className={cn(
            "rounded-xl md:rounded-2xl bg-zinc-800/50 border border-zinc-700/50 font-black text-zinc-100 hover:bg-zinc-700/50 hover:border-zinc-600 active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center",
            size === "compact" 
              ? "w-12 h-12 md:w-14 md:h-14 text-lg md:text-xl rounded-lg md:rounded-xl" 
              : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-xl lg:text-2xl"
          )}
        >
          0
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          className={cn(
            "rounded-xl md:rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-0",
            size === "compact" ? "w-12 h-12 md:w-14 md:h-14" : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
          )}
        >
          <Delete className={cn(size === "compact" ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-6 md:h-6")} />
        </button>
      </div>

      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4">
        {isLoading ? t("common.processing") : t("access.pin.instruction")}
      </p>
    </div>
  );
};

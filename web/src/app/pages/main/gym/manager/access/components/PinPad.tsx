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
    <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
      {/* PIN Display */}
      <div className={cn("flex gap-3", size === "compact" ? "gap-2" : "gap-3")}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
              size === "compact" ? "w-10 h-14 rounded-xl" : "w-12 h-16 md:w-14 md:h-20",
              i < pin.length
                ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] scale-105"
                : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
            )}
          >
            {i < pin.length ? (
              <div className={cn("bg-primary rounded-full animate-in zoom-in", size === "compact" ? "w-2.5 h-2.5" : "w-3 h-3 md:w-4 md:h-4")} />
            ) : (
              <div className={cn("bg-zinc-700 rounded-full", size === "compact" ? "w-1 h-1" : "w-1.5 h-1.5")} />
            )}
          </div>
        ))}
      </div>

      {/* Number Pad Grid */}
      <div className={cn("grid grid-cols-3", size === "compact" ? "gap-3" : "gap-4 md:gap-6")}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            disabled={isLoading}
            className={cn(
              "rounded-2xl bg-zinc-800/50 border border-zinc-700/50 font-black text-zinc-100 hover:bg-zinc-700/50 hover:border-zinc-600 active:scale-90 transition-all disabled:opacity-50",
              size === "compact" ? "w-14 h-14 text-xl rounded-xl" : "w-16 h-16 md:w-20 md:h-20 text-2xl"
            )}
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={isLoading || pin.length === 0}
          className={cn(
            "rounded-2xl bg-zinc-800/20 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 active:scale-95 transition-all flex items-center justify-center disabled:opacity-0",
            size === "compact" ? "w-14 h-14 rounded-xl" : "w-16 h-16 md:w-20 md:h-20"
          )}
        >
          <X className={cn(size === "compact" ? "w-5 h-5" : "w-6 h-6")} />
        </button>
        <button
          onClick={() => handleNumberClick("0")}
          disabled={isLoading}
          className={cn(
            "rounded-2xl bg-zinc-800/50 border border-zinc-700/50 font-black text-zinc-100 hover:bg-zinc-700/50 hover:border-zinc-600 active:scale-90 transition-all disabled:opacity-50",
            size === "compact" ? "w-14 h-14 text-xl rounded-xl" : "w-16 h-16 md:w-20 md:h-20 text-2xl"
          )}
        >
          0
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          className={cn(
            "rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-0",
            size === "compact" ? "w-14 h-14 rounded-xl" : "w-16 h-16 md:w-20 md:h-20"
          )}
        >
          <Delete className={cn(size === "compact" ? "w-5 h-5" : "w-6 h-6")} />
        </button>
      </div>

      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-4">
        {isLoading ? t("common.processing") : t("access.pin.instruction")}
      </p>
    </div>
  );
};

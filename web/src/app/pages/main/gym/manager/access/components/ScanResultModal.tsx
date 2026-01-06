import { format } from "date-fns";
import { Ban, ShieldCheck, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../utils/helper";
import { type ScanResult } from "../hooks/useScanner";

interface ScanResultModalProps {
  result: ScanResult | null;
  onClose: () => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  result,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!result || result.status === "verifying") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className={cn(
          "w-full max-w-md bg-zinc-900 border-2 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500",
          result.status === "granted"
            ? "border-emerald-500/50 shadow-emerald-500/10"
            : "border-rose-500/50 shadow-rose-500/10"
        )}
      >
        <div className="p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-6">
            <div
              className={cn(
                "p-6 rounded-full relative",
                result.status === "granted"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              )}
            >
              {result.status === "granted" ? (
                <>
                  <ShieldCheck className="w-20 h-20 relative z-10" />
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping pointer-events-none"></div>
                </>
              ) : (
                <>
                  <Ban className="w-20 h-20 relative z-10" />
                  <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping pointer-events-none"></div>
                </>
              )}
            </div>

            <div>
              <h4
                className={cn(
                  "text-3xl font-black tracking-tight mb-2 uppercase italic",
                  result.status === "granted"
                    ? "text-emerald-400"
                    : "text-rose-400"
                )}
              >
                {result.status === "granted"
                  ? t("access.status.granted")
                  : t("access.status.denied")}
              </h4>
              {result.status === "granted" ? (
                <p className="text-zinc-400 text-lg font-medium">
                  {t("access.status.welcome", { name: result.name })}
                </p>
              ) : (
                <p className="text-zinc-400 text-lg font-medium">
                  {result.reason || t("access.status.invalid")}
                </p>
              )}
            </div>

            {result.status === "granted" && (
              <div className="flex flex-col items-center gap-4 mt-2">
                {result.photo && (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-2xl">
                    <img
                      src={result.photo}
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {result.expiry && (
                  <div className="px-4 py-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">
                      {t("access.status.expiry_label")}
                    </p>
                    <p className="text-emerald-400 font-bold">
                      {format(new Date(result.expiry), "PPP")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "h-2 w-full",
            result.status === "granted" ? "bg-emerald-500" : "bg-rose-500"
          )}
        >
          <div className="h-full bg-white/30 animate-[progress_4s_linear_forwards]"></div>
        </div>
      </div>
    </div>
  );
};

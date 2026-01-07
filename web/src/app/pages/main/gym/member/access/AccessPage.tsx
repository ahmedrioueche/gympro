import { useNavigate } from "@tanstack/react-router";
import { Key, Maximize2, RefreshCw, ShieldCheck, Timer, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../store/gym";
import { cn } from "../../../../../../utils/helper";
import PageHeader from "../../../../../components/PageHeader";
import { useAccessPage } from "./hooks/useAccessPage";

const AccessPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const navigate = useNavigate();
  const { token, timeLeft, isLoading, refresh } = useAccessPage(
    currentGym?._id
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("gymMember.access.title")}
        subtitle={t("gymMember.access.subtitle")}
        icon={Key}
      />

      <div className="mt-8 md:mt-12 flex justify-center">
        {/* QR Code Card */}
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700/50">
          <div className="p-6 md:p-8 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl">
                <ShieldCheck className="w-5 h-5 md:w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-base md:text-lg">
                  {t("gymMember.access.qr.title")}
                </h3>
                <p className="text-[10px] md:text-xs text-zinc-500 font-medium">
                  {t("gymMember.access.qr.instruction")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center">
            <div
              onClick={() => token && setIsFullscreen(true)}
              className={cn(
                "relative bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_60px_rgba(255,255,255,0.03)] group transition-all duration-500 hover:scale-[1.02]",
                token && "cursor-zoom-in"
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
                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl md:rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl md:rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl md:rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 border-b-4 border-r-4 border-primary rounded-br-2xl md:rounded-br-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center bg-zinc-50 rounded-[1.5rem] md:rounded-[2rem]">
                  <p className="text-zinc-400 font-bold px-4 md:px-6 uppercase tracking-wider text-[10px] md:text-sm">
                    {t("gymMember.access.qr.generating")}
                  </p>
                </div>
              )}
            </div>

            {/* Tap to expand hint - always visible on mobile, hover on desktop */}
            {token && (
              <div className="mt-4 flex items-center justify-center gap-2 text-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  {t("gymMember.access.qr.tapToExpand")}
                </p>
              </div>
            )}

            <div className="mt-8 md:mt-12 w-full space-y-6">
              <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-zinc-800/30 rounded-2xl md:rounded-3xl border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={cn(
                      "p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-500",
                      timeLeft <= 5
                        ? "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        : "bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    <Timer
                      className={cn(
                        "w-4 h-4 md:w-5 h-5",
                        timeLeft <= 5 && "animate-pulse"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] md:text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">
                      {t("common.status")}
                    </p>
                    <p
                      className={cn(
                        "text-xs md:text-sm font-black uppercase tracking-tight",
                        timeLeft <= 5 ? "text-rose-400" : "text-emerald-400"
                      )}
                    >
                      {timeLeft === 0
                        ? t("gymMember.access.qr.expired")
                        : t("gymMember.access.qr.expiresIn", {
                            seconds: timeLeft,
                          })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => refresh()}
                  disabled={isLoading}
                  className="p-2.5 md:p-3 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-xl md:rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                  title={t("gymMember.access.qr.refresh")}
                >
                  <RefreshCw
                    className={cn(
                      "w-4 h-4 md:w-5 h-5",
                      isLoading && "animate-spin"
                    )}
                  />
                </button>
              </div>

              {/* Progress bar */}
              <div className="relative h-1.5 md:h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-1000 ease-linear rounded-full",
                    timeLeft <= 5
                      ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                      : "bg-primary"
                  )}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && token && (
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
              value={token}
              size={Math.min(
                Math.min(window.innerWidth, window.innerHeight) * 0.7,
                500
              )}
              level="M"
            />
          </div>

          <p className="mt-8 md:mt-12 text-zinc-500 font-bold uppercase tracking-widest text-center text-xs md:text-sm">
            {t("gymMember.access.qr.tapToClose")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessPage;

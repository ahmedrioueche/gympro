import { useNavigate } from "@tanstack/react-router";
import { Key, Logs, RefreshCw, ShieldCheck, Timer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
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

  return (
    <div className="max-w-7xl p-4 md:p-6 lg:py-8 mx-auto animate-in fade-in duration-700">
      <PageHeader
        title={t("gymMember.access.title")}
        subtitle={t("gymMember.access.subtitle")}
        icon={Key}
        actionButton={{
          label: t("gymMember.access.viewLogs"),
          onClick: () => {
            navigate({ to: APP_PAGES.gym.member.accessLogs.link });
          },
          icon: Logs,
        }}
      />

      <div className="mt-12 flex justify-center">
        {/* QR Code Card */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700/50">
          <div className="p-8 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-lg">
                  {t("gymMember.access.qr.title")}
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  {t("gymMember.access.qr.instruction")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="relative bg-white p-8 rounded-[3rem] shadow-[0_0_60px_rgba(255,255,255,0.03)] group transition-all duration-500 hover:scale-[1.02]">
              {isLoading ? (
                <div className="w-56 h-56 md:w-64 md:h-64 flex items-center justify-center bg-zinc-50 rounded-[2rem]">
                  <RefreshCw className="w-12 h-12 text-zinc-300 animate-spin" />
                </div>
              ) : token ? (
                <div className="relative">
                  <QRCodeSVG
                    value={token}
                    size={256}
                    level="H"
                    includeMargin={false}
                    className="w-56 h-56 md:w-64 md:h-64"
                  />
                  {/* Decorative corners */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              ) : (
                <div className="w-56 h-56 md:w-64 md:h-64 flex items-center justify-center bg-zinc-50 rounded-[2rem]">
                  <p className="text-zinc-400 font-bold px-6 uppercase tracking-wider text-sm">
                    {t("gymMember.access.qr.generating")}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-12 w-full space-y-6">
              <div className="flex items-center justify-between px-8 py-5 bg-zinc-800/30 rounded-3xl border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-500",
                      timeLeft <= 5
                        ? "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        : "bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    <Timer
                      className={cn(
                        "w-5 h-5",
                        timeLeft <= 5 && "animate-pulse"
                      )}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">
                      {t("common.status")}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-black uppercase tracking-tight",
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
                  className="p-3 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                  title={t("gymMember.access.qr.refresh")}
                >
                  <RefreshCw
                    className={cn("w-5 h-5", isLoading && "animate-spin")}
                  />
                </button>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
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
    </div>
  );
};

export default AccessPage;

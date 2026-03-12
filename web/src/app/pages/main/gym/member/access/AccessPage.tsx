import { Key, Maximize2, RefreshCw, ShieldCheck, Timer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tabs, { type TabItem } from "../../../../../../components/ui/Tabs";
import { useGymStore } from "../../../../../../store/gym";
import { cn } from "../../../../../../utils/helper";
import PageHeader from "../../../../../components/PageHeader";
import { MemberPinView } from "./components/MethodViews/MemberPinView";
import { MemberQRView } from "./components/MethodViews/MemberQRView";
import { MemberRFIDView } from "./components/MethodViews/MemberRFIDView";
import { useAccessPage } from "./hooks/useAccessPage";

const AccessPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { token, membership, timeLeft, isLoading, isUpdating, refresh } =
    useAccessPage(currentGym?._id);

  const preferredMethod = currentGym?.settings?.preferredAccessMethod || "qr";
  const [activeTab, setActiveTab] = useState<string>(preferredMethod);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync activeTab with preferredMethod when it changes initially
  useEffect(() => {
    if (preferredMethod) {
      setActiveTab(preferredMethod);
    }
  }, [preferredMethod]);

  const accessData = (membership as any)?.accessData;

  const tabs: TabItem[] = [
    { id: "qr", label: t("access.management.method_qr") },
    { id: "pin", label: t("access.management.method_pin") },
    { id: "rfid", label: t("access.management.method_rfid") },
  ];

  const renderAccessContent = () => {
    switch (activeTab) {
      case "qr":
        return (
          <MemberQRView
            token={token}
            isLoading={isLoading}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        );
      case "pin":
        return (
          <MemberPinView
            pinCode={accessData?.pinCode}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        );
      case "rfid":
        return (
          <MemberRFIDView
            rfidId={accessData?.rfidId}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <PageHeader
        title={t("gymMember.access.title")}
        subtitle={t("gymMember.access.subtitle")}
        icon={Key}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-8 md:mt-12 flex flex-col items-center gap-8">
        <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700/50">
          <div className="p-6 md:p-8 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl">
                <ShieldCheck className="w-5 h-5 md:w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-100 text-base md:text-lg">
                    {t(`access.management.method_${activeTab}`)}
                  </h3>
                  {activeTab === preferredMethod && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-black uppercase tracking-tighter">
                      {t("common.default", "Default")}
                    </span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-zinc-500 font-medium">
                  {t(
                    `gymMember.access.${activeTab}.instruction`,
                    t("gymMember.access.qr.instruction"),
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center">
            {renderAccessContent()}

            {(activeTab === "qr"
              ? token
              : activeTab === "pin"
                ? accessData?.pinCode
                : accessData?.rfidId) && (
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
                      activeTab === "qr" && timeLeft <= 5
                        ? "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        : "bg-emerald-500/10 text-emerald-400",
                    )}
                  >
                    <Timer
                      className={cn(
                        "w-4 h-4 md:w-5 h-5",
                        activeTab === "qr" && timeLeft <= 5 && "animate-pulse",
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
                        activeTab === "qr" && timeLeft <= 5
                          ? "text-rose-400"
                          : "text-emerald-400",
                      )}
                    >
                      {activeTab !== "qr"
                        ? t("access.management.active")
                        : timeLeft === 0
                          ? t("gymMember.access.qr.expired")
                          : t("gymMember.access.qr.expiresIn", {
                              seconds: timeLeft,
                            })}
                    </p>
                  </div>
                </div>
                {activeTab === "qr" && (
                  <button
                    onClick={() => refresh()}
                    disabled={isLoading}
                    className="p-2.5 md:p-3 bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-xl md:rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                    title={t("gymMember.access.qr.refresh")}
                  >
                    <RefreshCw
                      className={cn(
                        "w-4 h-4 md:w-5 h-5",
                        isLoading && "animate-spin",
                        isUpdating && "animate-spin",
                      )}
                    />
                  </button>
                )}
              </div>

              {activeTab === "qr" && (
                <div className="relative h-1.5 md:h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 transition-all duration-1000 ease-linear rounded-full",
                      timeLeft <= 5
                        ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        : "bg-primary",
                    )}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPage;

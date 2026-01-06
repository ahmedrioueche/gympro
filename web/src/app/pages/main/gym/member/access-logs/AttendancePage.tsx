import { format } from "date-fns";
import { Ban, CheckCircle2, ChevronDown, Clock, History } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../components/ui/SearchInput";
import { useGymStore } from "../../../../../../store/gym";
import { cn } from "../../../../../../utils/helper";
import PageHeader from "../../../../../components/PageHeader";
import { useAttendance } from "./hooks/useAttendance";

const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();

  const {
    logs,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useAttendance(currentGym?._id);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    if (status === "checked_in") {
      return {
        icon: CheckCircle2,
        label: t("gymMember.attendance.filter.granted"),
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/20",
        textClass: "text-emerald-400",
      };
    }
    return {
      icon: Ban,
      label: t("gymMember.attendance.filter.denied"),
      bgClass: "bg-rose-500/10",
      borderClass: "border-rose-500/20",
      textClass: "text-rose-400",
    };
  };

  const renderMobileCard = (log: any) => {
    const config = getStatusConfig(log.status);
    const StatusIcon = config.icon;

    return (
      <div
        key={log._id}
        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-zinc-100 font-bold">
              {format(new Date(log.checkIn), "MMM dd, yyyy")}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{format(new Date(log.checkIn), "HH:mm:ss")}</span>
            </div>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border",
              config.bgClass,
              config.borderClass,
              config.textClass
            )}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {config.label}
            </span>
          </div>
        </div>

        {log.notes && (
          <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800/50">
            <p className="text-xs text-zinc-400 italic">{log.notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl p-4 md:p-6 lg:py-8 mx-auto animate-in fade-in duration-700">
      <PageHeader
        title={t("gymMember.attendance.title")}
        subtitle={t("gymMember.attendance.subtitle")}
        icon={History}
      />

      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("gymMember.attendance.search")}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:border-zinc-700 transition-all"
            >
              <span>
                {statusFilter === "all" && t("gymMember.attendance.filter.all")}
                {statusFilter === "granted" &&
                  t("gymMember.attendance.filter.granted")}
                {statusFilter === "denied" &&
                  t("gymMember.attendance.filter.denied")}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isFilterOpen && "rotate-180"
                )}
              />
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in zoom-in-95 duration-200">
                  {["all", "granted", "denied"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setStatusFilter(filter as any);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm font-bold transition-colors",
                        statusFilter === filter
                          ? "bg-primary/10 text-primary"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      )}
                    >
                      {filter === "all" && t("gymMember.attendance.filter.all")}
                      {filter === "granted" &&
                        t("gymMember.attendance.filter.granted")}
                      {filter === "denied" &&
                        t("gymMember.attendance.filter.denied")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {t("common.date")}
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {t("common.status")}
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {t("common.reason")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6">
                      <div className="h-4 bg-zinc-800 rounded w-32" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-6 bg-zinc-800 rounded-full w-24" />
                    </td>
                    <td className="px-8 py-6">
                      <div className="h-4 bg-zinc-800 rounded w-48" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <History className="w-12 h-12 text-zinc-800" />
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-zinc-100">
                          {t("gymMember.attandance.empty")}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {t("gymMember.attandance.emptyDesc")}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  const config = getStatusConfig(log.status);
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={log._id}
                      className="group hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-zinc-100 italic group-hover:text-primary transition-colors">
                            {format(new Date(log.checkIn), "MMM dd, yyyy")}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                            {format(new Date(log.checkIn), "HH:mm:ss")}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border",
                            config.bgClass,
                            config.borderClass,
                            config.textClass
                          )}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {config.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {log.notes ? (
                          <p
                            className="text-xs text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-800/50 italic max-w-sm truncate"
                            title={log.notes}
                          >
                            {log.notes}
                          </p>
                        ) : (
                          <span className="text-zinc-700 italic text-xs">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 animate-pulse space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-4 bg-zinc-800 rounded w-32" />
                  <div className="h-6 bg-zinc-800 rounded-full w-24" />
                </div>
                <div className="h-4 bg-zinc-800 rounded w-full" />
              </div>
            ))
          ) : logs.length === 0 ? (
            <div className="py-20 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <History className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="font-bold text-zinc-100">
                {t("gymMember.attandance.empty")}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {t("gymMember.attandance.emptyDesc")}
              </p>
            </div>
          ) : (
            logs.map(renderMobileCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;

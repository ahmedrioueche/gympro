import { format } from "date-fns";
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  User as UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../../../../../../components/ui/SearchInput";
import { useAttendance } from "../../../../../../hooks/queries/useAttendance";
import { useGymStore } from "../../../../../../store/gym";
import { cn } from "../../../../../../utils/helper";
import PageHeader from "../../../../../components/PageHeader";

type StatusFilter = "all" | "granted" | "denied";

const AccessLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { logs: logsRes, isLoadingLogs } = useAttendance(currentGym?._id);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const logs = logsRes?.data || [];

  const filteredLogs = logs.filter((log: any) => {
    const name = log.userId?.profile?.fullName?.toLowerCase() || "";
    const matchesSearch = name.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "granted" && log.status === "checked_in") ||
      (statusFilter === "denied" && log.status === "denied");

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    if (status === "checked_in") {
      return {
        icon: CheckCircle2,
        label: t("access.status.granted"),
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/20",
        textClass: "text-emerald-400",
        iconClass: "text-emerald-500",
      };
    }
    return {
      icon: Ban,
      label: t("access.status.denied"),
      bgClass: "bg-rose-500/10",
      borderClass: "border-rose-500/20",
      textClass: "text-rose-400",
      iconClass: "text-rose-500",
    };
  };

  const renderMobileCard = (log: any) => {
    const config = getStatusConfig(log.status);
    const StatusIcon = config.icon;

    return (
      <div
        key={log._id}
        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {log.userId?.profile?.profileImageUrl ? (
            <img
              src={log.userId.profile.profileImageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover ring-2 ring-zinc-800 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center rounded-lg ring-2 ring-zinc-800 flex-shrink-0">
              <UserIcon className="w-6 h-6 text-zinc-500" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name and Status */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-zinc-100 truncate">
                  {log.userId?.profile?.fullName || t("common.unknown")}
                </h4>
                <p className="text-xs text-zinc-500 uppercase tracking-tight">
                  {log.userId?._id
                    ? `ID: ${log.userId._id.slice(-8)}`
                    : "Invalid QR"}
                </p>
              </div>
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border flex-shrink-0",
                  config.bgClass,
                  config.borderClass,
                  config.textClass
                )}
              >
                <StatusIcon className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {config.label}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">
                {format(new Date(log.checkIn), "MMM dd, yyyy · HH:mm:ss")}
              </span>
            </div>

            {/* Notes */}
            {log.notes && (
              <p className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800/50 italic">
                {log.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("access.logs.title")}
        subtitle={t("access.logs.subtitle")}
        icon={History}
      />

      <div className="mt-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("access.logs.search_placeholder")}
            className="w-full sm:max-w-md"
          />

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
            >
              <span>
                {statusFilter === "all" && t("access.logs.filter_all")}
                {statusFilter === "granted" && t("access.logs.filter_granted")}
                {statusFilter === "denied" && t("access.logs.filter_denied")}
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
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden">
                  {(["all", "granted", "denied"] as StatusFilter[]).map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setStatusFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors",
                          statusFilter === filter
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-zinc-300 hover:bg-zinc-800/50"
                        )}
                      >
                        {filter === "all" && t("access.logs.filter_all")}
                        {filter === "granted" &&
                          t("access.logs.filter_granted")}
                        {filter === "denied" && t("access.logs.filter_denied")}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {t("common.member")}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {t("common.status")}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {t("common.date_time")}
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {t("common.reason")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoadingLogs ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg"></div>
                          <div className="h-4 bg-zinc-800 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-zinc-800 rounded-full w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-zinc-800 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-zinc-800 rounded w-40"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-20 text-center text-zinc-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Clock className="w-12 h-12 opacity-10" />
                        <p className="font-medium">{t("access.logs.empty")}</p>
                        <p className="text-xs text-zinc-600">
                          {t("access.logs.empty_desc")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log: any) => {
                    const config = getStatusConfig(log.status);
                    const StatusIcon = config.icon;

                    return (
                      <tr
                        key={log._id}
                        className="group hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {log.userId?.profile?.profileImageUrl ? (
                              <img
                                src={log.userId.profile.profileImageUrl}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover ring-2 ring-zinc-800"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center rounded-lg ring-2 ring-zinc-800">
                                <UserIcon className="w-5 h-5 text-zinc-500" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                                {log.userId?.profile?.fullName ||
                                  t("common.unknown")}
                              </p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                {log.userId?._id
                                  ? `Member ID: ${log.userId._id.slice(-8)}`
                                  : "Invalid QR Code"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
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
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-zinc-200">
                              {format(new Date(log.checkIn), "HH:mm:ss")}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                              {format(new Date(log.checkIn), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.notes ? (
                            <p
                              className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800/50 max-w-xs truncate"
                              title={log.notes}
                            >
                              {log.notes}
                            </p>
                          ) : (
                            <span className="text-zinc-600 italic text-xs">
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
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3">
          {isLoadingLogs ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-32"></div>
                    <div className="h-3 bg-zinc-800 rounded w-24"></div>
                    <div className="h-3 bg-zinc-800 rounded w-40"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <Clock className="w-16 h-16 text-zinc-600 mb-4" />
              <h3 className="text-lg font-black text-zinc-100 mb-1 uppercase tracking-tight">
                {t("access.logs.empty")}
              </h3>
              <p className="text-sm text-zinc-500 text-center px-4">
                {t("access.logs.empty_desc")}
              </p>
            </div>
          ) : (
            filteredLogs.map((log: any) => renderMobileCard(log))
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessLogsPage;

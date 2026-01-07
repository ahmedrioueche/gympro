import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Ban, CheckCircle2, Clock, History } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../../../components/ui/SearchFilterBar";
import { Table, type TableColumn } from "../../../../../../components/ui/Table";
import { useGymStore } from "../../../../../../store/gym";
import { cn } from "../../../../../../utils/helper";
import PageHeader from "../../../../../components/PageHeader";
import { useAttendance } from "./hooks/useAttendance";

type StatusFilter = "all" | "granted" | "denied";

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

  const columns: TableColumn<MemberAttendanceRecord>[] = [
    {
      key: "date",
      header: t("common.date"),
      render: (log) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-zinc-100 italic group-hover:text-primary transition-colors">
            {format(new Date(log.checkIn), "MMM dd, yyyy")}
          </p>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
            {format(new Date(log.checkIn), "HH:mm:ss")}
          </p>
        </div>
      ),
      renderSkeleton: () => <div className="h-4 bg-zinc-800 rounded w-32" />,
    },
    {
      key: "status",
      header: t("common.status"),
      render: (log) => {
        const config = getStatusConfig(log.status);
        const StatusIcon = config.icon;
        return (
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
        );
      },
      renderSkeleton: () => (
        <div className="h-6 bg-zinc-800 rounded-full w-24" />
      ),
    },
    {
      key: "reason",
      header: t("common.reason"),
      render: (log) =>
        log.notes ? (
          <p
            className="text-xs text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-800/50 italic max-w-sm truncate"
            title={log.notes}
          >
            {log.notes}
          </p>
        ) : (
          <span className="text-zinc-700 italic text-xs">—</span>
        ),
      renderSkeleton: () => <div className="h-4 bg-zinc-800 rounded w-48" />,
    },
  ];

  const renderMobileCard = (log: MemberAttendanceRecord) => {
    const config = getStatusConfig(log.status);
    const StatusIcon = config.icon;

    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all">
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

  const renderMobileLoadingSkeleton = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-4 bg-zinc-800 rounded w-32" />
        <div className="h-6 bg-zinc-800 rounded-full w-24" />
      </div>
      <div className="h-4 bg-zinc-800 rounded w-full" />
    </div>
  );

  const emptyState = (
    <div className="flex flex-col items-center gap-4 py-12">
      <History className="w-12 h-12 text-zinc-600 opacity-30" />
      <div className="space-y-1 text-center">
        <p className="text-lg font-bold text-zinc-100">
          {t("gymMember.attendance.empty")}
        </p>
        <p className="text-sm text-zinc-500">
          {t("gymMember.attendance.emptyDesc")}
        </p>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={t("gymMember.attendance.title")}
        subtitle={t("gymMember.attendance.subtitle")}
        icon={History}
      />

      <div className="mt-8 space-y-6">
        {/* Controls */}
        <SearchFilterBar<StatusFilter>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("gymMember.attendance.search")}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { value: "all", label: t("gymMember.attendance.filter.all") },
            {
              value: "granted",
              label: t("gymMember.attendance.filter.granted"),
            },
            { value: "denied", label: t("gymMember.attendance.filter.denied") },
          ]}
        />

        {/* Table */}
        <Table
          columns={columns}
          data={logs as unknown as MemberAttendanceRecord[]}
          keyExtractor={(log) => log._id || ""}
          isLoading={isLoading}
          skeletonRowCount={6}
          emptyState={emptyState}
          rowClassName={() => "group hover:bg-zinc-800/30 transition-colors"}
          renderMobileCard={renderMobileCard}
          renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
          wrapperClassName="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
          headerClassName="border-b border-zinc-800 bg-zinc-900/50"
        />
      </div>
    </div>
  );
};

export default AttendancePage;

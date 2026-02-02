import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Ban, CheckCircle2, Clock, History } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../../components/ui/NoData";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { cn } from "../../../../../../../utils/helper";

interface AttendanceTableProps {
  logs: MemberAttendanceRecord[];
  isLoading: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  logs,
  isLoading,
}) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: string) => {
    if (status === "checked_in") {
      return {
        icon: CheckCircle2,
        label: t("gymMember.attendance.filter.granted") as string,
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/20",
        textClass: "text-emerald-400",
      };
    }
    return {
      icon: Ban,
      label: t("gymMember.attendance.filter.denied") as string,
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
              config.textClass,
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
              config.textClass,
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
    <NoData
      title={t("gymMember.attendance.emptyDesc") as string}
      description={t("gymMember.attendance.empty") as string}
      icon={History}
      className=""
      iconBg=""
    />
  );

  return (
    <Table
      columns={columns}
      data={logs}
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
  );
};

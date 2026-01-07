import { type GymAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Ban, CheckCircle2, Clock, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { cn } from "../../../../../../../utils/helper";

interface AttendanceTableProps {
  logs: GymAttendanceRecord[];
  isLoading: boolean;
}

export const AttendanceTable = ({ logs, isLoading }: AttendanceTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const columns: TableColumn<GymAttendanceRecord>[] = [
    {
      key: "member",
      header: t("common.member"),
      render: (log) => (
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
              {log.userId?.profile?.fullName || t("common.unknown")}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
              {log.userId?._id
                ? `Member ID: ${log.userId._id.slice(-8)}`
                : "Invalid QR Code"}
            </p>
          </div>
        </div>
      ),
      renderSkeleton: () => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
          <div className="h-4 bg-zinc-800 rounded w-24" />
        </div>
      ),
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
        );
      },
      renderSkeleton: () => (
        <div className="h-6 bg-zinc-800 rounded-full w-20" />
      ),
    },
    {
      key: "dateTime",
      header: t("common.date_time"),
      render: (log) => (
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-zinc-200">
            {format(new Date(log.checkIn), "HH:mm:ss")}
          </p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
            {format(new Date(log.checkIn), "MMM dd, yyyy")}
          </p>
        </div>
      ),
      renderSkeleton: () => <div className="h-4 bg-zinc-800 rounded w-32" />,
    },
    {
      key: "reason",
      header: t("common.reason"),
      render: (log) =>
        log.notes ? (
          <p
            className="text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800/50 max-w-xs truncate"
            title={log.notes}
          >
            {log.notes}
          </p>
        ) : (
          <span className="text-zinc-600 italic text-xs">—</span>
        ),
      renderSkeleton: () => <div className="h-4 bg-zinc-800 rounded w-40" />,
    },
  ];

  const renderMobileCard = (log: GymAttendanceRecord) => {
    const config = getStatusConfig(log.status);
    const StatusIcon = config.icon;

    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
        <div className="flex items-start gap-3">
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

          <div className="flex-1 min-w-0">
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

            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">
                {format(new Date(log.checkIn), "MMM dd, yyyy · HH:mm:ss")}
              </span>
            </div>

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

  const renderMobileLoadingSkeleton = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-zinc-800 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-32" />
          <div className="h-3 bg-zinc-800 rounded w-24" />
          <div className="h-3 bg-zinc-800 rounded w-40" />
        </div>
      </div>
    </div>
  );

  const emptyState = (
    <div className="flex flex-col items-center gap-3 py-12">
      <Clock className="w-12 h-12 text-zinc-600 opacity-30" />
      <p className="font-medium text-zinc-500">{t("access.logs.empty")}</p>
      <p className="text-xs text-zinc-600">{t("access.logs.empty_desc")}</p>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={logs}
      keyExtractor={(log) => log._id}
      isLoading={isLoading}
      skeletonRowCount={10}
      emptyState={emptyState}
      onRowClick={(log) => {
        if (log?.userId?._id)
          navigate({
            to: `${APP_PAGES.gym.manager.member_profile.link}/${log.userId._id}`,
          });
      }}
      rowClassName={() => "group hover:bg-border/40 cursor-pointer"}
      renderMobileCard={renderMobileCard}
      renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
      wrapperClassName="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl"
      headerClassName="border-b border-zinc-800 bg-zinc-900/50"
    />
  );
};

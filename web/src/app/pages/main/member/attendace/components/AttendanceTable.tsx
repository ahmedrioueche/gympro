import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import { Table, type TableColumn } from "../../../../../../components/ui/Table";

interface AttendanceTableProps {
  records: MemberAttendanceRecord[];
  isLoading: boolean;
}

export function AttendanceTable({ records, isLoading }: AttendanceTableProps) {
  const { t } = useTranslation();

  const getStatusIcon = (status: MemberAttendanceRecord["status"]) => {
    switch (status) {
      case "checked_in":
        return "✅";
      case "checked_out":
        return "🚪";
      case "denied":
        return "❌";
      case "missed":
        return "⏰";
      default:
        return "📋";
    }
  };

  const getStatusStyle = (status: MemberAttendanceRecord["status"]) => {
    switch (status) {
      case "checked_in":
        return "bg-success/10 text-success border-success/20";
      case "checked_out":
        return "bg-primary/10 text-primary border-primary/20";
      case "denied":
        return "bg-danger/10 text-danger border-danger/20";
      case "missed":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  const columns: TableColumn<MemberAttendanceRecord>[] = [
    {
      key: "status",
      header: t("attendance.table.status", "Status"),
      render: (record) => (
        <span className="text-xl" role="img" aria-label={record.status}>
          {getStatusIcon(record.status)}
        </span>
      ),
      renderSkeleton: () => <div className="h-6 bg-muted rounded w-8" />,
    },
    {
      key: "gym",
      header: t("attendance.table.gym", "Gym"),
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary">
            {record.gymId?.name || t("common.unknown", "Unknown Gym")}
          </span>
          {record.gymId?.location?.city && (
            <span className="text-sm text-text-secondary mt-0.5">
              {record.gymId.location.city}
            </span>
          )}
        </div>
      ),
      renderSkeleton: () => (
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      ),
    },
    {
      key: "date",
      header: t("attendance.table.date", "Date & Time"),
      render: (record) => (
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">
            {new Date(record.checkIn).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDistanceToNow(new Date(record.checkIn), {
              addSuffix: true,
            })}
          </span>
        </div>
      ),
      renderSkeleton: () => (
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      ),
    },
    {
      key: "badge",
      header: t("attendance.table.badge", "Badge"),
      render: (record) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusStyle(
            record.status,
          )}`}
        >
          {t(`attendance.status.${record.status}`, record.status) as string}
        </span>
      ),
      renderSkeleton: () => <div className="h-6 bg-muted rounded-full w-20" />,
    },
  ];

  const renderMobileCard = (record: MemberAttendanceRecord) => (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <span
          className="text-2xl flex-shrink-0"
          role="img"
          aria-label={record.status}
        >
          {getStatusIcon(record.status)}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-text-primary">
              {record.gymId?.name || t("common.unknown", "Unknown Gym")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusStyle(
                record.status,
              )}`}
            >
              {t(`attendance.status.${record.status}`, record.status) as string}
            </span>
          </div>

          {record.gymId?.location?.city && (
            <p className="text-sm text-text-secondary mb-2">
              {record.gymId.location.city}
            </p>
          )}

          <span className="text-xs text-text-secondary">
            {new Date(record.checkIn).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            •{" "}
            {formatDistanceToNow(new Date(record.checkIn), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );

  const renderMobileLoadingSkeleton = () => (
    <div className="p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-muted rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-40" />
        </div>
      </div>
    </div>
  );

  const emptyState = (
    <NoData
      title={t("attendance.empty", "No attendance records")}
      description={t(
        "attendance.emptyDesc",
        "Your check-in history will appear here once you visit a gym.",
      )}
      emoji="📋"
      iconBg=""
      className=""
    />
  );

  return (
    <Table
      columns={columns}
      data={records}
      keyExtractor={(record) => record._id || ""}
      isLoading={isLoading}
      skeletonRowCount={6}
      emptyState={emptyState}
      rowClassName={() => "transition-colors duration-200 hover:bg-muted/50"}
      renderMobileCard={renderMobileCard}
      renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
      wrapperClassName="bg-surface border border-border rounded-2xl overflow-hidden"
      headerClassName="bg-primary/10 border-b border-border"
    />
  );
}

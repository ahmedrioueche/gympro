import { type MemberAttendanceRecord } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

interface AttendanceTableProps {
  records: MemberAttendanceRecord[];
}

export const AttendanceTable = ({ records }: AttendanceTableProps) => {
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

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-16">
                {t("attendance.table.status", "Status")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("attendance.table.gym", "Gym")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-48">
                {t("attendance.table.date", "Date & Time")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-32">
                {t("attendance.table.badge", "Badge")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => (
              <tr
                key={record._id}
                className="transition-colors duration-200 hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <span
                    className="text-xl"
                    role="img"
                    aria-label={record.status}
                  >
                    {getStatusIcon(record.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusStyle(
                      record.status
                    )}`}
                  >
                    {t(`attendance.status.${record.status}`, record.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {records.map((record) => (
          <div key={record._id} className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <span
                className="text-2xl flex-shrink-0"
                role="img"
                aria-label={record.status}
              >
                {getStatusIcon(record.status)}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Gym Name and Status Row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-text-primary">
                    {record.gymId?.name || t("common.unknown", "Unknown Gym")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusStyle(
                      record.status
                    )}`}
                  >
                    {t(`attendance.status.${record.status}`, record.status)}
                  </span>
                </div>

                {/* Location */}
                {record.gymId?.location?.city && (
                  <p className="text-sm text-text-secondary mb-2">
                    {record.gymId.location.city}
                  </p>
                )}

                {/* Date */}
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
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;

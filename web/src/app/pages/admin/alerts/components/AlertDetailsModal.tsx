import { AlertStatus } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { AlertCircle, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import { useAlerts } from "../../../../../hooks/queries/useAlerts";
import { useModalStore } from "../../../../../store/modal";

export default function AlertDetailsModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, alertProps } = useModalStore();
  const { updateStatus, isUpdating } = useAlerts();

  if (currentModal !== "alert_details" || !alertProps?.alert) {
    return null;
  }

  const { alert } = alertProps;

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id: alert._id, status: status as AlertStatus },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  const statusOptions = Object.values(AlertStatus).map((status) => ({
    value: status,
    label: t(`admin.alerts.status.${status}`),
  }));

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={t("admin.alerts.modals.details_title")}
      icon={AlertCircle}
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {alert.title}
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-text-primary`}
              >
                {t(`admin.alerts.type.${alert.type}`)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500`}
              >
                {t(`admin.alerts.priority.${alert.priority}`)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary">
                {t(`admin.alerts.source.${alert.source}`)}
              </span>
            </div>
          </div>
          <span className="text-sm text-text-secondary">
            {format(new Date(alert.createdAt), "PPp")}
          </span>
        </div>

        {/* Message */}
        <div className="bg-surface-secondary p-4 rounded-lg">
          <p className="text-text-secondary whitespace-pre-wrap text-sm">
            {alert.message}
          </p>
        </div>

        {/* Stack Trace / Technical Details */}
        {alert.stackTrace && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              {t("admin.alerts.modals.stack_trace")}
            </h4>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-border overflow-x-auto max-h-60 overflow-y-auto">
              <pre className="text-xs text-text-primary font-mono whitespace-pre">
                {alert.stackTrace}
              </pre>
            </div>
          </div>
        )}

        {/* Metadata */}
        {alert.metadata && Object.keys(alert.metadata).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">
              {t("admin.alerts.modals.metadata")}
            </h4>
            <div className="grid grid-cols-2 gap-2 bg-surface-secondary p-3 rounded-lg border border-border/50 text-xs text-text-secondary font-mono">
              {Object.entries(alert.metadata).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-0.5">
                  <span className="text-text-secondary uppercase">{key}</span>
                  <span className="truncate">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Update */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t("admin.alerts.modals.update_status")}
          </label>
          <CustomSelect
            options={statusOptions}
            selectedOption={alert.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            placeholder={t("admin.alerts.status.unread")}
          />
        </div>
      </div>
    </BaseModal>
  );
}

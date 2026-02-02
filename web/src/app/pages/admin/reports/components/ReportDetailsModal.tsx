import { ReportStatus } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import { useUpdateReportStatus } from "../../../../../hooks/queries/useReports";
import { useModalStore } from "../../../../../store/modal";

export default function ReportDetailsModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, reportDetailsProps } = useModalStore();
  const { mutate: updateStatus, isPending } = useUpdateReportStatus();

  if (currentModal !== "report_details" || !reportDetailsProps?.report) {
    return null;
  }

  const { report } = reportDetailsProps;

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id: report._id, status: status as ReportStatus },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  const statusOptions = Object.values(ReportStatus).map((status) => ({
    value: status,
    label: t(`admin.reports.status.${status}`),
  }));

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={t("admin.reports.modals.details_title")}
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {report.subject}
            </h3>
            <div className="flex gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary`}
              >
                {t(`admin.reports.type.${report.type}`)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500`}
              >
                {t(`admin.reports.priority.${report.priority}`)}
              </span>
            </div>
          </div>
          <span className="text-sm text-text-tertiary">
            {format(new Date(report.createdAt), "PPp")}
          </span>
        </div>

        {/* Description */}
        <div className="bg-surface-secondary p-4 rounded-lg">
          <p className="text-text-secondary whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* Reporter Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">
            {t("admin.reports.modals.reporter_info")}
          </h4>
          <div className="flex items-center gap-3 bg-surface-secondary p-3 rounded-lg border border-border/50">
            {typeof report.reporter !== "string" && (
              <>
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                  {report.reporter.profile.fullName}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {report.reporter.profile.fullName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {report.reporter.profile.email}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Update */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t("admin.reports.modals.update_status")}
          </label>
          <CustomSelect
            options={statusOptions}
            selectedOption={report.status}
            onChange={handleStatusChange}
            disabled={isPending}
            placeholder={t("admin.reports.status.open")}
          />
        </div>
      </div>
    </BaseModal>
  );
}

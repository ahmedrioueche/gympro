import { ReportStatus } from "@ahmedrioueche/gympro-client";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  FileText,
  Loader,
  Paperclip,
  Plus,
  Send,
  User,
} from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import Button from "../../../../components/ui/Button";
import CustomSelect from "../../../../components/ui/CustomSelect";
import TextArea from "../../../../components/ui/TextArea";
import { useModalStore } from "../../../../store/modal";
import { useReportDetailsModal } from "./useReportDetailsModal";

export default function ReportDetailsModal() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isOpen,
    report,
    message,
    setMessage,
    selectedStatus,
    setSelectedStatus,
    isUpdatingStatus,
    isSendingResponse,
    isUploading,
    isReporter,
    hasResponses,
    statusOptions,
    closeModal,
    handleSaveStatus,
    handleSendMessage,
    handleUploadAttachments,
    getStatusColor,
    getPriorityColor,
    getSenderInfo,
  } = useReportDetailsModal();

  if (!isOpen || !report) {
    return null;
  }

  const hasAttachments = report.attachments && report.attachments.length > 0;
  const hasReporterInfo = typeof report.reporter !== "string";

  return (
    <BaseModal
      isOpen={true}
      icon={FileText}
      onClose={closeModal}
      title={report.subject}
      maxWidth="max-w-2xl"
      showFooter={false}
    >
      <div className="space-y-5">
        {/* Meta Info Row */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`px-2.5 py-1 rounded-lg font-medium ${getStatusColor(report.status)}`}
          >
            {t(`admin.reports.status.${report.status}`)}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg font-medium ${getPriorityColor(report.priority)}`}
          >
            {t(`admin.reports.priority.${report.priority}`)}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-text-secondary">
            {t(`admin.reports.type.${report.type}`)}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-text-secondary">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(report.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        {/* Description */}
        <p className="text-text-primary leading-relaxed">
          {report.description}
        </p>

        {/* Attachments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Paperclip className="w-4 h-4" />
            {t("support.modal.attachments")}
            {hasAttachments && ` (${report.attachments.length})`}
          </div>
          <div className="flex gap-2 flex-wrap">
            {report.attachments?.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-brand-primary transition-colors"
              >
                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={url} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </a>
            ))}

            {/* Upload button - only for reporter */}
            {isReporter && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleUploadAttachments(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-brand-primary flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader className="w-5 h-5 text-text-secondary animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-text-secondary" />
                      <span className="text-[10px] text-text-secondary">
                        {t("common.add")}
                      </span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reporter - Clickable for admins */}
        {typeof report.reporter !== "string" && (
          <button
            onClick={() => {
              if (!isReporter) {
                // Close this modal and open user profile
                closeModal();
                // Small delay to let modal close before opening new one
                setTimeout(() => {
                  openModal("user_profile", {
                    user: report.reporter,
                  });
                }, 100);
              }
            }}
            disabled={isReporter}
            className={`flex items-center gap-3 p-3 bg-surface-secondary rounded-xl w-full text-left ${
              !isReporter
                ? "hover:bg-surface-hover cursor-pointer transition-colors"
                : ""
            }`}
          >
            {report.reporter.profile?.profileImageUrl ? (
              <img
                src={report.reporter.profile.profileImageUrl}
                alt={report.reporter.profile.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                <User className="w-5 h-5 text-text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {report.reporter.profile.fullName}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {report.reporter.profile.email}
              </p>
            </div>
            {!isReporter && (
              <span className="text-xs text-text-secondary">
                {t("common.view")}
              </span>
            )}
          </button>
        )}

        {/* Status Update - Only for admins */}
        {!isReporter && (
          <>
            {hasReporterInfo && <div className="border-t border-border" />}
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  {t("admin.reports.modals.update_status")}
                </label>
                <CustomSelect
                  options={statusOptions}
                  selectedOption={selectedStatus || report.status}
                  onChange={(val) => setSelectedStatus(val as ReportStatus)}
                  disabled={isUpdatingStatus}
                  placeholder={t("admin.reports.status.open")}
                />
              </div>
              <Button
                onClick={handleSaveStatus}
                disabled={
                  isUpdatingStatus ||
                  !selectedStatus ||
                  selectedStatus === report.status
                }
                loading={isUpdatingStatus}
                size="default"
              >
                {t("common.save")}
              </Button>
            </div>
          </>
        )}

        {/* Conversation */}
        {hasResponses && (
          <>
            {(!isReporter || hasReporterInfo) && (
              <div className="border-t border-border" />
            )}
            <div className="space-y-3">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {t("support.conversation")}
              </p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {report.responses?.map((response, idx) => {
                  const { isCurrentUser, label, initial } =
                    getSenderInfo(response);

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isCurrentUser
                            ? "bg-brand-primary text-white"
                            : "bg-surface-tertiary text-text-secondary"
                        }`}
                      >
                        {initial}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`flex flex-col max-w-[80%] ${isCurrentUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm ${
                            isCurrentUser
                              ? "bg-brand-primary text-white rounded-tr-sm"
                              : "bg-surface-secondary text-text-primary rounded-tl-sm"
                          }`}
                        >
                          {response.message}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 px-1">
                          <span className="text-[10px] text-text-secondary">
                            {label}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            ·
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {formatDistanceToNow(new Date(response.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Message Input */}
        <div className="pt-3 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1">
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("support.type_message")}
                rows={2}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingResponse}
              className="self-end p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

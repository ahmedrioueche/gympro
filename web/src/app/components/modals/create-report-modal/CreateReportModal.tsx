import { ReportPriority, ReportType } from "@ahmedrioueche/gympro-client";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquarePlus,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import TextArea from "../../../../components/ui/TextArea";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useCreateReportForm } from "./useCreateReportForm";

const CreateReportModal = () => {
  const { t } = useTranslation();
  const {  } = useModalStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    subject,
    setSubject,
    description,
    setDescription,
    type,
    setType,
    priority,
    setPriority,
    attachments,
    handleUpload,
    handleRemoveAttachment,
    isUploading,
    uploads,
    handleSubmit,
    handleClose,
    isValid,
    isPending,
    ACCEPT_TYPES,
  } = useCreateReportForm();

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("create-report");

  const typeOptions = [
    { value: ReportType.ISSUE, label: t("support.types.issue") },
    { value: ReportType.FEEDBACK, label: t("support.types.feedback") },
    {
      value: ReportType.FEATURE_REQUEST,
      label: t("support.types.feature_request"),
    },
  ];

  const priorityOptions = [
    { value: ReportPriority.LOW, label: t("support.priorities.low") },
    { value: ReportPriority.MEDIUM, label: t("support.priorities.medium") },
    { value: ReportPriority.HIGH, label: t("support.priorities.high") },
  ];

  return (
    <BaseModal
      title={t("support.modal.title")}
      subtitle={t("support.modal.subtitle")}
      onClose={handleClose}
      icon={MessageSquarePlus}
      isOpen={isOpen} zIndex={zIndex}
      primaryButton={{
        label: isPending
          ? t("support.modal.submitting")
          : isUploading
            ? t("common.uploading")
            : t("support.modal.submit"),
        onClick: handleSubmit,
        disabled: !isValid || isPending || isUploading,
        loading: isPending,
        icon: Send,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: handleClose,
        icon: X,
      }}
    >
      <div className="space-y-4">
        <InputField
          label={t("support.modal.subject")}
          placeholder={t("support.modal.subjectPlaceholder")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <TextArea
          label={t("support.modal.description")}
          placeholder={t("support.modal.descriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="resize-none"
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {t("support.modal.attachments")}
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
              accept={ACCEPT_TYPES?.IMAGE_AND_VIDEO || "image/*,video/*"}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center gap-2 text-text-secondary hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>{t("support.modal.uploadPlaceholder")}</span>
            </button>

            {/* Upload Progress */}
            {uploads.length > 0 && (
              <div className="space-y-2">
                {uploads.map((upload, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-surface-secondary rounded-lg"
                  >
                    {upload.status === "uploading" ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                    ) : upload.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : upload.status === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {upload.file.name}
                      </p>
                      {upload.status === "uploading" && (
                        <div className="mt-1 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      )}
                      {upload.error && (
                        <p className="text-xs text-red-500 mt-0.5 truncate">
                          {upload.error}
                        </p>
                      )}
                    </div>
                    {upload.status === "uploading" && (
                      <span className="text-xs text-text-secondary flex-shrink-0">
                        {upload.progress}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Completed attachments */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {attachments.map((url, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    {url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={url}
                        alt="Attachment"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            title={t("support.modal.type")}
            options={typeOptions}
            selectedOption={type}
            onChange={(val) => setType(val as ReportType)}
          />
          <CustomSelect
            title={t("support.modal.priority")}
            options={priorityOptions}
            selectedOption={priority}
            onChange={(val) => setPriority(val as ReportPriority)}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateReportModal;

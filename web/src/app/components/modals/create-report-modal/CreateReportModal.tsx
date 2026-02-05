import { ReportPriority, ReportType } from "@ahmedrioueche/gympro-client";
import { MessageSquarePlus, Upload, X } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import TextArea from "../../../../components/ui/TextArea";
import { useModalStore } from "../../../../store/modal";
import { useCreateReportForm } from "./useCreateReportForm";

const CreateReportModal = () => {
  const { t } = useTranslation();
  const { closeModal, currentModal } = useModalStore();
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
    handleSubmit,
    isValid,
    isPending,
  } = useCreateReportForm();

  const isOpen = currentModal === "create-report";

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
      onClose={closeModal}
      icon={MessageSquarePlus}
      isOpen={isOpen}
      primaryButton={{
        label: isPending
          ? t("support.modal.submitting")
          : isUploading
            ? t("common.uploading")
            : t("support.modal.submit"),
        onClick: handleSubmit,
        disabled: !isValid || isPending || isUploading,
        loading: isPending || isUploading,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
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
              accept="image/*,video/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center gap-2 text-text-secondary hover:text-primary hover:border-primary/50 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>{t("support.modal.uploadPlaceholder")}</span>
            </button>

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

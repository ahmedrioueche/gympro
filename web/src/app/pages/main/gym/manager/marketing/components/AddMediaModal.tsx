import {
  GYM_MEDIA_CATEGORIES,
  type GymMediaCategory,
  type GymMediaType,
} from "@ahmedrioueche/gympro-client";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import { useMarketing } from "../../../../../../../hooks/queries/useMarketing";
import { useFileUpload } from "../../../../../../../hooks/useFileUpload";
import { useModalStore } from "../../../../../../../store/modal";

export default function AddMediaModal() {
  const { t } = useTranslation();
  const { currentModal, gymMediaProps, closeModal } = useModalStore();
  const { gymId, type: fixedType, onSuccess } = gymMediaProps || {};

  const isOpen = currentModal === "add-gym-media";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: (fixedType || "image") as GymMediaType,
    category: "marketing" as GymMediaCategory,
    url: "",
    publicId: "",
  });

  const {
    uploads,
    isUploading: isUploadingFile,
    uploadFiles,
    clearUploads,
  } = useFileUpload({
    onComplete: (results) => {
      if (results.length > 0) {
        setFormData((prev) => ({
          ...prev,
          url: results[0].url,
          publicId: results[0].publicId,
        }));
      }
    },
    onError: (err) => toast.error(err),
  });

  // Reset form when modal opens with new type
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        type: (fixedType || "image") as GymMediaType,
        category: "marketing",
        url: "",
        publicId: "",
      });
      clearUploads();
    }
  }, [isOpen, fixedType, clearUploads]);

  const { addMedia } = useMarketing(gymId || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let detectedType = formData.type;

    // Auto-detect type based on file mimetype
    if (file.type.startsWith("image/")) {
      detectedType = "image" as GymMediaType;
    } else if (file.type.startsWith("video/")) {
      detectedType = "video" as GymMediaType;
    } else if (file.type === "application/pdf") {
      detectedType = "document" as GymMediaType;
    }

    // Update form type and clear previous upload if type changed
    if (detectedType !== formData.type) {
      setFormData((prev) => ({ ...prev, type: detectedType, url: "" }));
      clearUploads();
    }

    // Determine resource type for Cloudinary
    const resourceType =
      detectedType === "video"
        ? "video"
        : detectedType === "document"
          ? "auto"
          : "image";

    // Use the uploadFiles from useFileUpload hook
    await uploadFiles(files, resourceType);

    // The onComplete callback above handles setting the URL
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId || !formData.url) return;

    try {
      await addMedia.mutateAsync(formData);
      onSuccess?.();
      closeModal();
      setFormData({
        title: "",
        description: "",
        type: "image",
        category: "marketing",
        url: "",
        publicId: "",
      });
      clearUploads();
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Hardcode types as a fallback for sync issues
  const mediaTypes = ["image", "video", "document"] as const;

  if (!isOpen) return null;

  const currentUpload = uploads[0];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={Plus}
      title={
        formData.type === "document"
          ? t("marketing.form.addMaterial")
          : t("marketing.form.addMedia")
      }
      maxWidth="max-w-2xl"
      primaryButton={{
        label: t("common.save"),
        type: "submit",
        form: "add-media-form",
        loading: addMedia.isPending || isUploadingFile,
        icon: Save,
        disabled: !formData.url || isUploadingFile,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
    >
      <form id="add-media-form" onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`grid ${
            fixedType === "document" ? "grid-cols-1" : "grid-cols-2"
          } gap-4`}
        >
          {fixedType !== "document" && (
            <CustomSelect
              title={t("marketing.form.type")}
              options={mediaTypes
                .filter((t) => t !== "document") // Don't show document in media gallery
                .map((type) => ({
                  label:
                    type === "image"
                      ? t("marketing.gallery.types.image")
                      : t("marketing.gallery.types.video"),
                  value: type,
                }))}
              selectedOption={formData.type}
              onChange={(val) => {
                setFormData({ ...formData, type: val as any, url: "" });
                clearUploads();
              }}
            />
          )}
          <CustomSelect
            title={t("marketing.form.category")}
            options={GYM_MEDIA_CATEGORIES.map((cat) => ({
              label: t(`marketing.gallery.categories.${cat}`),
              value: cat,
            }))}
            selectedOption={formData.category}
            onChange={(val) =>
              setFormData({ ...formData, category: val as any })
            }
          />
        </div>

        <InputField
          label={t("marketing.form.title")}
          placeholder={t("marketing.form.titlePlaceholder")}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextArea
          label={t("marketing.form.description")}
          placeholder={t("marketing.form.descriptionPlaceholder")}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t("marketing.form.file")}
          </label>
          <div
            onClick={() => !isUploadingFile && fileInputRef.current?.click()}
            className={`
              relative h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300
              ${formData.url ? "border-success bg-success/5" : "border-border hover:border-primary hover:bg-primary/5"}
              ${isUploadingFile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isUploadingFile ? (
              <div className="flex flex-col items-center gap-3 w-full px-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${currentUpload?.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary">
                  {currentUpload?.progress || 0}%
                </span>
              </div>
            ) : formData.url ? (
              <div className="flex flex-col items-center gap-2">
                {formData.type === "image" ? (
                  <img
                    src={formData.url}
                    className="h-24 object-contain rounded border border-border"
                  />
                ) : formData.type === "video" ? (
                  <video
                    src={formData.url}
                    className="h-24 w-full object-contain rounded border border-border"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-success" />
                )}
                <span className="text-xs text-success font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />{" "}
                  {t("common.uploadSuccess")}
                </span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-text-secondary mb-2 group-hover:text-primary transition-colors" />
                <span className="text-sm text-text-secondary font-medium">
                  {t("marketing.form.selectFile")}
                </span>
                <span className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider font-bold">
                  {formData.type === "document"
                    ? "PDF (MAX 20MB)"
                    : formData.type === "video"
                      ? "MP4, WEBM (MAX 50MB)"
                      : "JPG, PNG, WEBP (MAX 10MB)"}
                </span>
              </>
            )}
          </div>
          <input
            key={formData.type}
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={
              formData.type === "document"
                ? ".pdf"
                : formData.type === "video"
                  ? "video/*"
                  : "image/*"
            }
          />
          {currentUpload?.status === "error" && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {currentUpload.error}
            </p>
          )}
          {formData.url && !isUploadingFile && (
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, url: "", publicId: "" }));
                clearUploads();
              }}
              className="text-xs text-danger hover:underline mt-1 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> {t("common.remove")}
            </button>
          )}
        </div>
      </form>
    </BaseModal>
  );
}

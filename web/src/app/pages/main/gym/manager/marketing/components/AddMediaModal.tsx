import {
  GYM_MEDIA_CATEGORIES,
  GYM_MEDIA_TYPES,
  uploadApi,
  type GymMediaCategory,
  type GymMediaType,
} from "@ahmedrioueche/gympro-client";
import { Loader2, Plus, Save, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import { useMarketing } from "../../../../../../../hooks/queries/useMarketing";
import { useModalStore } from "../../../../../../../store/modal";

export default function AddMediaModal() {
  const { t } = useTranslation();
  const { currentModal, gymMediaProps, closeModal } = useModalStore();
  const { gymId, type: fixedType, onSuccess } = gymMediaProps || {};

  const isOpen = currentModal === "add-gym-media";
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: (fixedType || "image") as GymMediaType,
    category: "marketing" as GymMediaCategory,
    url: "",
    publicId: "",
  });

  const { addMedia } = useMarketing(gymId || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Use the appropriate upload type based on selection
      const res = await uploadApi.uploadFile(
        file,
        formData.type === "document" ? "auto" : "image",
      );
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          url: res.data!.url,
          publicId: res.data!.publicId,
        }));
        toast.success(
          t("marketing.form.uploadSuccess") || t("common.uploadSuccess"),
        );
      } else {
        toast.error(res.message || t("common.uploadFailed"));
      }
    } catch (error) {
      toast.error(t("marketing.form.uploadError") || t("common.uploadError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId || !formData.url) return;

    try {
      await addMedia.mutateAsync(formData);
      onSuccess?.();
      closeModal();
      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "image",
        category: "marketing",
        url: "",
        publicId: "",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!isOpen) return null;

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
      maxWidth="max-w-lg"
      primaryButton={{
        label: t("common.save"),
        type: "submit",
        form: "add-media-form",
        loading: addMedia.isPending || uploading,
        icon: Save,
        disabled: !formData.url || uploading,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
    >
      <form id="add-media-form" onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`grid ${fixedType ? "grid-cols-1" : "grid-cols-2"} gap-4`}
        >
          {!fixedType && (
            <CustomSelect
              title={t("marketing.form.type")}
              options={GYM_MEDIA_TYPES.map((type) => ({
                label: t(`marketing.gallery.types.${type}`),
                value: type,
              }))}
              selectedOption={formData.type}
              onChange={(val) => setFormData({ ...formData, type: val as any })}
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
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`
              relative h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300
              ${formData.url ? "border-success bg-success/5" : "border-border hover:border-primary hover:bg-primary/5"}
              ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : formData.url ? (
              <div className="flex flex-col items-center">
                {formData.type === "image" ? (
                  <img
                    src={formData.url}
                    className="h-20 object-contain mb-2 rounded"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-success mb-1" />
                )}
                <span className="text-xs text-success font-medium">
                  {t("common.uploadSuccess")}
                </span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-text-secondary mb-2 group-hover:text-primary transition-colors" />
                <span className="text-sm text-text-secondary">
                  {t("marketing.form.selectFile")}
                </span>
                <span className="text-[10px] text-text-secondary mt-1 uppercase">
                  {formData.type === "document" ? "PDF" : "JPG, PNG, WEBP"}
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={formData.type === "document" ? ".pdf" : "image/*"}
          />
          {formData.url && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, url: "", publicId: "" }))
              }
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

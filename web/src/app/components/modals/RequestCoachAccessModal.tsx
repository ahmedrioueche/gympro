import { dashboardApi } from "@ahmedrioueche/gympro-client";
import { useMutation } from "@tanstack/react-query";
import { FileText, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import InputField from "../../../components/ui/InputField";
import TextArea from "../../../components/ui/TextArea";
import { useModalStore } from "../../../store/modal";
import { uploadToCloudinary } from "../../../utils/cloudinary";

interface DocumentItem {
  url: string;
  description: string;
  type: string;
  file?: File; // For display/uploading state reference if needed locally
}

export default function RequestCoachAccessModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal } = useModalStore();
  const isOpen = currentModal === "request_coach_access";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [certificationDetails, setCertificationDetails] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState<string[]>([""]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const { isPending, mutate: requestAccess } = useMutation({
    mutationFn: dashboardApi.requestCoachAccess,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          t("dashboard.requestTimeout", "Request submitted successfully"),
        );
        closeModal();
        setCertificationDetails("");
        setSocialMediaLinks([""]);
        setDocuments([]);
      } else {
        toast.error(data.message || t("common.error"));
      }
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error"));
    },
  });

  const handleAddLink = () => {
    setSocialMediaLinks([...socialMediaLinks, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(newLinks);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index] = value;
    setSocialMediaLinks(newLinks);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("common.fileTooLarge", "File size must be less than 5MB"));
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setDocuments([
        ...documents,
        {
          url,
          description: "",
          type: "certificate", // Default type
          file,
        },
      ]);
      toast.success(t("common.uploadSuccess", "File uploaded successfully"));
    } catch (error) {
      console.error("Upload failed", error);
      toast.error(t("common.uploadError", "Failed to upload file"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDocs = [...documents];
    newDocs[index].description = value;
    setDocuments(newDocs);
  };

  const handleSubmit = () => {
    const validLinks = socialMediaLinks.filter((link) => link.trim());

    if (!certificationDetails.trim()) {
      toast.error(
        t(
          "dashboard.errors.certificationRequired",
          "Certification details are required",
        ),
      );
      return;
    }

    if (documents.length === 0) {
      toast.error(
        t(
          "dashboard.errors.documentsRequired",
          "Please upload at least one certification file",
        ),
      );
      return;
    }

    requestAccess({
      certificationDetails,
      socialMediaLinks: validLinks.length > 0 ? validLinks : undefined,
      documents: documents.map((d) => ({
        url: d.url,
        description: d.description,
        type: d.type,
      })),
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("dashboard.requestCoachAccess", "Request Coach Access")}
      subtitle={t(
        "dashboard.coachAccessDescription",
        "To access the coach dashboard, please provide your certification details.",
      )}
      primaryButton={{
        label: t("common.submit", "Submit"),
        onClick: handleSubmit,
        loading: isPending || uploading,
        disabled:
          !certificationDetails.trim() || uploading || documents.length === 0,
      }}
      secondaryButton={{
        label: t("common.cancel", "Cancel"),
        onClick: closeModal,
      }}
    >
      <div className="space-y-6">
        {/* Certification Details */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("dashboard.certificationDetails", "Certification Details")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <TextArea
            value={certificationDetails}
            onChange={(e) => setCertificationDetails(e.target.value)}
            placeholder={t(
              "dashboard.certificationPlaceholder",
              "e.g., ACE Certified Personal Trainer, NASM-CPT",
            )}
            rows={3}
          />
        </div>

        {/* Documents Section */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("dashboard.certificationFiles", "Certification Files")}{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3 mb-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="p-3 bg-surface border border-border rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-primary font-medium truncate">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="truncate">
                      {doc.file?.name || "Uploaded File"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(index)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <InputField
                  value={doc.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder={t(
                    "dashboard.fileDescriptionPlaceholder",
                    "Add a description (e.g. Front side)",
                  )}
                  className="w-full text-sm"
                />
              </div>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-border rounded-xl text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {uploading
                ? t("common.uploading", "Uploading...")
                : t("dashboard.uploadFile", "Upload Certificate")}
            </span>
          </button>
        </div>

        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("dashboard.socialMediaLinks", "Social Media / Portfolio Links")}
          </label>
          <div className="space-y-3">
            {socialMediaLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <InputField
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://"
                  />
                </div>
                {socialMediaLinks.length > 1 && (
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-[1px]" // Align with input height
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddLink}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80"
            >
              <Plus className="w-4 h-4" />
              {t("common.addLink", "Add Link")}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

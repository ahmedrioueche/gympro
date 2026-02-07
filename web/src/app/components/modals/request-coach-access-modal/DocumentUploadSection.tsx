import { FileText, Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../components/ui/InputField";
import type { DocumentItem } from "./useRequestCoachAccess";

interface DocumentUploadSectionProps {
  documents: DocumentItem[];
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (index: number) => void;
  onDescriptionChange: (index: number, value: string) => void;
}

export function DocumentUploadSection({
  documents,
  uploading,
  fileInputRef,
  onFileUpload,
  onRemoveDocument,
  onDescriptionChange,
}: DocumentUploadSectionProps) {
  const { t } = useTranslation();

  return (
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
                onClick={() => onRemoveDocument(index)}
                className="p-1 text-text-secondary hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <InputField
              value={doc.description}
              onChange={(e) => onDescriptionChange(index, e.target.value)}
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
        onChange={onFileUpload}
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
  );
}

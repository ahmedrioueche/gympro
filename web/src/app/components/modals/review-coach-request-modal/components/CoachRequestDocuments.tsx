import { FileText, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  documents?: Array<{ description?: string; url: string }>;
  getSafeFileUrl: (url: string) => string;
  getDocumentLabel: (
    doc: { description?: string; url: string },
    index: number,
  ) => string;
}

export function CoachRequestDocuments({
  documents,
  getSafeFileUrl,
  getDocumentLabel,
}: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        {t("admin.coaching.reviewModal.documents")}
      </h4>
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc, index) => (
            <a
              key={index}
              href={getSafeFileUrl(doc.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-hover border border-border rounded-xl transition-all group"
            >
              <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-text-primary truncate">
                  {getDocumentLabel(doc, index)}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {t("admin.coaching.reviewModal.clickToView")}
                </p>
              </div>
              <LinkIcon className="w-4 h-4 text-text-secondary" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary italic">
          {t("admin.coaching.reviewModal.noDocuments")}
        </p>
      )}
    </div>
  );
}

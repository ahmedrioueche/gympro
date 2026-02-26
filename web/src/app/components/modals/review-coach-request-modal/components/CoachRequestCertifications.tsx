import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  details?: string;
}

export function CoachRequestCertifications({ details }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        {t("admin.coaching.reviewModal.certificationDetails")}
      </h4>
      <div className="p-4 bg-surface rounded-xl border border-border text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
        {details || t("admin.coaching.reviewModal.noCertificationDetails")}
      </div>
    </div>
  );
}

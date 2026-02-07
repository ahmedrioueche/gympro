import { useTranslation } from "react-i18next";
import TextArea from "../../../../components/ui/TextArea";

interface CertificationDetailsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function CertificationDetailsSection({
  value,
  onChange,
}: CertificationDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {t("dashboard.certificationDetails", "Certification Details")}{" "}
        <span className="text-red-500">*</span>
      </label>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(
          "dashboard.certificationPlaceholder",
          "e.g., ACE Certified Personal Trainer, NASM-CPT",
        )}
        rows={3}
      />
    </div>
  );
}

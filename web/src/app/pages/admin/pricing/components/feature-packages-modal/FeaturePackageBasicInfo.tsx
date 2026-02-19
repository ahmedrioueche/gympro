import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";

interface Props {
  name: string;
  order: number;
  onChange: (field: string, value: any) => void;
}

export default function FeaturePackageBasicInfo({
  name,
  order,
  onChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label={t("common.name")}
        placeholder={t(
          "admin.pricing.placeholders.packageName",
          "e.g. Basic Management",
        )}
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <InputField
        label={t("admin.pricing.order", "Display Order")}
        type="number"
        placeholder={t("admin.pricing.placeholders.order", "0")}
        value={order}
        onChange={(e) => onChange("order", parseInt(e.target.value) || 0)}
      />
    </div>
  );
}

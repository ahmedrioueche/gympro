import { useTranslation } from "react-i18next";

export function MemberOverviewTab() {
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-surface-hover rounded-2xl border border-dashed border-border text-center text-text-secondary">
      {t("general.no_data")}
    </div>
  );
}

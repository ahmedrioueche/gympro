import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DeleteAccountSection } from "../../../../../../components/settings/DeleteAccountSection";
import SettingsTab from "../../../../../components/settings/SettingsTab";

export default function SecurityTab() {
  const { t } = useTranslation();

  return (
    <SettingsTab
      title={t("extra.settings.tabs.security", "Security")}
      description={t(
        "extra.settings.security.description",
        "Manage your account security and deletion preferences",
      )}
      icon={Lock}
    >
      <DeleteAccountSection />
    </SettingsTab>
  );
}

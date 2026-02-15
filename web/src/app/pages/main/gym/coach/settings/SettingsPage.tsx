import { Building2, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import SettingsContainer from "../../../../../components/settings/SettingsContainer";
import AffiliationTab from "./components/AffiliationTab";
import { useGymCoachSettings } from "./hooks/useGymCoachSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { affiliation, isLoading, isLeaving, handleLeaveGym } =
    useGymCoachSettings();

  const activeTab = "affiliation";

  if (isLoading) return <Loading className="py-20" />;

  if (!affiliation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="w-12 h-12 text-text-secondary mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {t("coach.settings.gym.noAffiliation", "No Active Affiliation")}
        </h3>
        <p className="text-text-secondary max-w-md">
          {t(
            "coach.settings.gym.noAffiliationDesc",
            "You don't seem to be affiliated with this gym anymore.",
          )}
        </p>
      </div>
    );
  }

  const handleConfirmLeave = () => {
    openModal("confirm", {
      title: t("coach.settings.gym.leaveTitle", "Leave Gym"),
      text: t(
        "coach.settings.gym.leaveConfirmation",
        "Are you sure you want to end your affiliation with this gym? You will lose access to the gym's facilities and client management.",
      ),
      confirmText: t("common.leave", "Leave"),
      confirmVariant: "danger",
      onConfirm: handleLeaveGym,
    });
  };

  const tabs = [
    {
      id: "affiliation",
      label: t("coach.settings.tabs.affiliation", "Affiliation"),
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <PageHeader
        title={t("settings.pageTitle", "Gym Settings")}
        subtitle={t(
          "coach.settings.gym.subtitle",
          "Manage your affiliation with this gym",
        )}
        icon={Settings}
      />

      <SettingsContainer
        activeTab={activeTab}
        onTabChange={() => {}}
        tabs={tabs}
      >
        {activeTab === "affiliation" && (
          <AffiliationTab
            affiliation={affiliation}
            onLeave={handleConfirmLeave}
            isLeaving={isLeaving}
          />
        )}
      </SettingsContainer>
    </div>
  );
}

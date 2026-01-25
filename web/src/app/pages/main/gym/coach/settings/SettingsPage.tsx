import { Building2, Settings } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { ActivePermissions } from "./components/ActivePermissions";
import { AffiliationDetails } from "./components/AffiliationDetails";
import { DangerZone } from "./components/DangerZone";
import { useGymCoachSettings } from "./hooks/useGymCoachSettings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { affiliation, isLoading, isLeaving, handleLeaveGym } =
    useGymCoachSettings();

  const [activeTab] = useState("affiliation");

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.pageTitle", "Settings")}
        subtitle={t(
          "coach.settings.gym.subtitle",
          "Manage your gym affiliation",
        )}
        icon={Settings}
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs (Single Tab for now) */}
        <div className="w-full md:w-64 space-y-1">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-primary text-white shadow-lg shadow-primary/20`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">
              {t("coach.settings.tabs.affiliation", "Affiliation")}
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <AffiliationDetails affiliation={affiliation} />
          <ActivePermissions affiliation={affiliation} />
          <DangerZone onLeave={handleConfirmLeave} isLeaving={isLeaving} />
        </div>
      </div>
    </div>
  );
}

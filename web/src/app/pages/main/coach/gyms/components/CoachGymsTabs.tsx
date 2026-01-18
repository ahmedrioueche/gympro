import { useTranslation } from "react-i18next";
import Tab from "../../../../../../components/ui/Tab";
import type { CoachGymsTab } from "../hooks/useCoachGymsPage";

interface CoachGymsTabsProps {
  activeTab: CoachGymsTab;
  setActiveTab: (tab: CoachGymsTab) => void;
  affiliationsCount: number;
  invitationsCount: number;
  exploreCount: number;
}

export function CoachGymsTabs({
  activeTab,
  setActiveTab,
  affiliationsCount,
  invitationsCount,
  exploreCount,
}: CoachGymsTabsProps) {
  const { t } = useTranslation();

  const tabs: { key: CoachGymsTab; label: string; count: number }[] = [
    {
      key: "affiliations",
      label: t("coach.gyms.tabs.myGyms"),
      count: affiliationsCount,
    },
    {
      key: "invitations",
      label: t("coach.gyms.tabs.invitations"),
      count: invitationsCount,
    },
    {
      key: "explore",
      label: t("coach.gyms.tabs.explore"),
      count: exploreCount,
    },
  ];

  return (
    <div className="flex gap-4 border-b border-border">
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          label={tab.label}
          count={tab.count}
          isActive={activeTab === tab.key}
          onClick={() => setActiveTab(tab.key)}
        />
      ))}
    </div>
  );
}

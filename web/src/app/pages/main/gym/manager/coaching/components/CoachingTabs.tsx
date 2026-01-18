import { useTranslation } from "react-i18next";
import Tab from "../../../../../../../components/ui/Tab";

type CoachingTab = "active" | "pending" | "invites";

interface CoachingTabsProps {
  activeTab: CoachingTab;
  setActiveTab: (tab: CoachingTab) => void;
  activeCount: number;
  pendingCount: number;
  invitesCount: number;
}

export function CoachingTabs({
  activeTab,
  setActiveTab,
  activeCount,
  pendingCount,
  invitesCount,
}: CoachingTabsProps) {
  const { t } = useTranslation();

  const tabs: { key: CoachingTab; label: string; count: number }[] = [
    {
      key: "active",
      label: t("coaching.activeCoaches"),
      count: activeCount,
    },
    {
      key: "pending",
      label: t("coaching.pendingRequests"),
      count: pendingCount,
    },
    {
      key: "invites",
      label: t("coaching.sentInvites"),
      count: invitesCount,
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

import { useTranslation } from "react-i18next";
import Tab from "../../../../../../components/ui/Tab";
import type { MemberGymsTab } from "../hooks/useMemberGymsPage";

interface MemberGymsTabsProps {
  activeTab: MemberGymsTab;
  setActiveTab: (tab: MemberGymsTab) => void;
  myGymsCount: number;
  exploreCount: number;
}

export function MemberGymsTabs({
  activeTab,
  setActiveTab,
  myGymsCount,
  exploreCount,
}: MemberGymsTabsProps) {
  const { t } = useTranslation();

  const tabs: { key: MemberGymsTab; label: string; count: number }[] = [
    {
      key: "my_gyms",
      label: t("gyms.your_gyms"),
      count: myGymsCount,
    },
    {
      key: "explore",
      label: t("gyms.discover_title"),
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

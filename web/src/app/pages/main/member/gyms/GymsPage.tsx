import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import GymList from "../../../../components/gym/GymList";
import GymDiscovery from "../../../../components/gyms/GymDiscovery";
import { MemberGymsTabs } from "./components/MemberGymsTabs";
import { useMemberGymsPage } from "./hooks/useMemberGymsPage";

export default function GymsPage() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, myGyms, exploreCount, isMyGymsLoading } =
    useMemberGymsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("member.gyms.title")}
        subtitle={t("member.gyms.subtitle")}
        icon={Dumbbell}
      />

      <MemberGymsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myGymsCount={myGyms.length}
        exploreCount={exploreCount}
      />

      {activeTab === "my_gyms" && (
        <div className="space-y-4">
          <GymList gyms={myGyms} isLoading={isMyGymsLoading} />
        </div>
      )}

      {activeTab === "explore" && (
        <GymDiscovery
          title={t("gyms.discover_title")}
          description={t("gyms.discover_subtitle")}
        />
      )}
    </div>
  );
}

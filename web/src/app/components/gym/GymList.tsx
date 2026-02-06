import { type Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import NoData from "../../../components/ui/NoData";
import { useGymStore } from "../../../store/gym";
import { useUserStore } from "../../../store/user";
import { getGymRouteForDashboard } from "../../../utils/gym-routing";
import GymCard from "./gym-card/GymCard";
import GymCardSkeleton from "./gym-card/GymCard.Skeleton";

interface GymListProps {
  gyms: Gym[];
  isLoading: boolean;
  onSelect?: (gym: Gym) => void;
  onJoin?: (gym: Gym) => void;
}

export default function GymList({
  gyms,
  isLoading,
  onSelect,
  onJoin,
}: GymListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setGym } = useGymStore();
  const { user, activeDashboard } = useUserStore();

  if (isLoading) {
    return <GymCardSkeleton />;
  }

  if (!gyms || gyms.length === 0) {
    return (
      <NoData
        emoji="🏢"
        title={t("gyms.no_gyms")}
        description={t("gyms.no_gyms_desc")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {gyms.map((gym) => (
        <GymCard
          onJoin={onJoin ? () => onJoin(gym) : undefined}
          onSelect={() => {
            if (onSelect) {
              onSelect(gym);
              return;
            }

            setGym(gym);
            if (user) {
              const route = getGymRouteForDashboard(activeDashboard);
              navigate({ to: route });
            }
          }}
          key={gym._id}
          gym={gym}
        />
      ))}
    </div>
  );
}

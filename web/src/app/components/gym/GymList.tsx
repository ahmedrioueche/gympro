import type { Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import NoData from "../../../components/ui/NoData";
import { useGymStore } from "../../../store/gym";
import { useUserStore } from "../../../store/user";
import { getGymDashboardRoute } from "../../../utils/gym-routing";
import GymCard from "./gym-card/GymCard";
import GymCardSkeleton from "./gym-card/GymCard.Skeleton";

interface GymListProps {
  gyms: Gym[];
  isLoading: boolean;
}

export default function GymList({ gyms, isLoading }: GymListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setGym } = useGymStore();
  const { user } = useUserStore();

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
          onSelect={() => {
            setGym(gym);

            if (user) {
              const route = getGymDashboardRoute(user, gym);
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

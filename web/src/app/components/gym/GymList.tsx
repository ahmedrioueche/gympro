import type { Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../store/gym";
import { useUserStore } from "../../../store/user";
import { getGymDashboardRoute } from "../../../utils/gym-routing";
import GymCard from "./GymCard";
import GymCardSkeleton from "./GymCard.Skeleton";

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
      <div className="text-center py-12 bg-surface border border-border rounded-xl">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {t("gyms.no_gyms")}
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          {t("gyms.no_gyms_desc")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {gyms.map((gym) => (
        <GymCard
          onSelect={() => {
            setGym(gym);

            if (user) {
              // Use centralized routing logic based on membership roles
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

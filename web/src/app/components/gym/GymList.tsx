import { type Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import NoData from "../../../components/ui/NoData";
import { useGymAccess } from "../../../hooks/useGymAccess";
import { useGymStore } from "../../../store/gym";
import { useModalStore } from "../../../store/modal";
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
  const { activeDashboard } = useUserStore();
  const { hasAccess, isPending, user } = useGymAccess();
  const { openModal } = useModalStore();

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
          onJoin={
            onJoin
              ? () => {
                  if (hasAccess(gym._id) || isPending(gym._id)) return;
                  onJoin(gym);
                }
              : undefined
          }
          onSelect={() => {
            if (onSelect) {
              onSelect(gym);
              return;
            }

            // Verify access
            if (hasAccess(gym._id)) {
              setGym(gym);
              if (user) {
                const route = getGymRouteForDashboard(activeDashboard);
                navigate({ to: route });
              }
              return;
            }

            // If request is pending, do nothing
            if (isPending(gym._id)) {
              return;
            }

            return;
          }}
          key={gym._id}
          gym={gym}
        />
      ))}
    </div>
  );
}

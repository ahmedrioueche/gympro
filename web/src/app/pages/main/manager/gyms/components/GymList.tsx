import type { Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../store/gym";
import GymCard from "./GymCard";

interface GymListProps {
  gyms: Gym[];
  isLoading: boolean;
}

export default function GymList({ gyms, isLoading }: GymListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGym, setGym } = useGymStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-xl p-6 h-64 animate-pulse"
          >
            <div className="w-12 h-12 rounded-lg bg-border/50 mb-4" />
            <div className="h-6 w-3/4 bg-border/50 rounded mb-2" />
            <div className="h-4 w-1/2 bg-border/50 rounded mb-6" />
            <div className="h-10 w-full bg-border/50 rounded" />
          </div>
        ))}
      </div>
    );
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
            navigate({ to: "/gym" });
          }}
          key={gym._id}
          gym={gym}
        />
      ))}
    </div>
  );
}

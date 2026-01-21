import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import NoData from "../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../store/modal";
import GymCard from "../../../../../components/gym/gym-card/GymCard";

interface ExploreGymsProps {
  gyms: Gym[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRequestAffiliation?: (gymId: string) => void;
}

export function ExploreGyms({
  gyms,
  searchTerm,
  onSearchChange,
  onRequestAffiliation,
}: ExploreGymsProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const handleRequest = (gym: Gym) => {
    if (!onRequestAffiliation) return;

    openModal("confirm", {
      title: t("coach.gyms.requestJoinTitle"),
      text: t("coach.gyms.requestJoinConfirm", {
        gymName: gym.name,
      }),
      confirmText: t("coach.gyms.requestJoin"),
      onConfirm: () => onRequestAffiliation(gym._id),
      confirmVariant: "primary",
    });
  };

  return (
    <div className="space-y-4">
      {gyms.length > 0 ? (
        <InputField
          type="text"
          placeholder={t("coach.gyms.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      ) : null}

      {gyms.length === 0 ? (
        <NoData
          emoji="🔍"
          title={t("coach.gyms.noGymsFound")}
          description={t("coach.gyms.noGymsFoundDesc")}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {gyms.map((gym) => (
            <GymCard
              key={gym._id}
              gym={gym}
              onSelect={() => handleRequest(gym)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

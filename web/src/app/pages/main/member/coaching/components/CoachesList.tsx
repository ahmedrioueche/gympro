import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import CoachCard from "../../../../../../components/cards/CoachCard";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";

interface CoachesListProps {
  coaches: CoachProfile[];
  isLoading: boolean;
  onSelectCoach: (coach: CoachProfile) => void;
}

export default function CoachesList({
  coaches,
  isLoading,
  onSelectCoach,
}: CoachesListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Loading />;
  }

  if (coaches.length === 0) {
    return (
      <NoData
        icon={UserCheck}
        title={t("coaches.noData.title")}
        description={t("coaches.noData.description")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coaches.map((coach) => (
        <CoachCard
          key={coach.userId}
          coach={coach}
          onViewDetails={onSelectCoach}
        />
      ))}
    </div>
  );
}

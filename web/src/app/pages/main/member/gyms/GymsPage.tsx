import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAllMyGyms } from "../../../../../hooks/queries/useGyms";
import PageHeader from "../../../../components/PageHeader";
import GymList from "../../../../components/gym/GymList";

export default function GymsPage() {
  const { t } = useTranslation();
  const { data: gyms = [], isLoading } = useAllMyGyms();

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8 max-w-7xl ">
      <PageHeader
        title={t("member.gyms.title")}
        subtitle={t("member.gyms.subtitle")}
        icon={Dumbbell}
      />

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {t("gyms.your_gyms")}
        </h2>

        <GymList gyms={gyms} isLoading={isLoading} />
      </div>
    </div>
  );
}

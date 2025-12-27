import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useAllMyGyms } from "../../../../../hooks/queries/useGyms";
import PageHeader from "../../../../components/PageHeader";
import GymList from "./components/GymList";

export default function GymsPage() {
  const { t } = useTranslation();
  const { data: gyms = [], isLoading } = useAllMyGyms();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8 max-w-7xl ">
      <PageHeader
        title={t("gyms.title")}
        subtitle={t("gyms.subtitle")}
        actionButton={{
          icon: Plus,
          label: t("gyms.create_button"),
          onClick: () => navigate({ to: APP_PAGES.manager.createGym.link }),
        }}
        icon={Dumbbell}
      />

      {/* 🏋️‍♂️ Your gyms section */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {t("gyms.your_gyms")}
        </h2>

        <GymList gyms={gyms} isLoading={isLoading} />
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAllMyGyms } from "../../../../../hooks/queries/useGyms";
import PageHeader from "../../../../components/PageHeader";
import GymList from "../../../../components/gym/GymList";

import { useModalStore } from "../../../../../store/modal";

export default function GymsPage() {
  const { t } = useTranslation();
  const { data: gyms = [], isLoading } = useAllMyGyms();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  return (
    <div>
      <PageHeader
        title={t("gyms.title")}
        subtitle={t("gyms.subtitle")}
        actionButton={{
          icon: Plus,
          label: t("gyms.create_button"),
          onClick: () => openModal("create_gym"),
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

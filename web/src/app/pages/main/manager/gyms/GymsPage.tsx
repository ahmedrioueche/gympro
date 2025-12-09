import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useAllMyGyms } from "../../../../../hooks/queries/useGyms";
import GymList from "./components/GymList";

export default function GymsPage() {
  const { t } = useTranslation();
  const { data: gyms = [], isLoading } = useAllMyGyms();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* 🔥 Combined Header + Create Gym Section */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 border border-border rounded-xl p-8 gap-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side: Page header */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {t("gyms.title")}
            </h1>
            <p className="text-text-secondary mb-4 max-w-md">
              {t("gyms.subtitle")}
            </p>
          </div>

          {/* Right side: Create gym card (kept exactly as you like it) */}
          <Link
            to={APP_PAGES.manager.createGym.link}
            className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <span>➕</span>
            {t("gyms.create_button")}
          </Link>
        </div>
      </div>

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

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../constants/navigation";

export default function CreateGymSection() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          {t("gyms.create_title")}
        </h2>
        <p className="text-text-secondary max-w-xl">{t("gyms.create_desc")}</p>
      </div>
      <Link
        to={APP_PAGES.manager.createGym.link}
        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
      >
        <span>➕</span>
        {t("gyms.create_button")}
      </Link>
    </div>
  );
}

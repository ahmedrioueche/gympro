import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScreen from "../../../../../hooks/useScreen";

export default function NoGymsView() {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  return (
    <div className={`flex items-center gap-3 px-2 py-2`}>
      <div className="flex-shrink-0">
        <div
          className={`${
            isMobile ? "w-11 h-11" : "w-14 h-14"
          } rounded-2xl bg-surface-hover/50 flex items-center justify-center`}
        >
          <Dumbbell
            className={`${
              isMobile ? "w-6 h-6" : "w-7 h-7"
            } text-text-secondary/50`}
          />
        </div>
      </div>
      <div className="flex-1 text-left min-w-0">
        <div
          className={`${
            isMobile ? "text-sm" : "text-lg"
          } font-bold text-text-secondary/60`}
        >
          {t("gym.no_gyms_available", "No gyms available")}
        </div>
      </div>
    </div>
  );
}

import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface GymCardHeaderProps {
  gym: Gym;
  displayRole?: string;
}

export function GymCardHeader({ gym, displayRole }: GymCardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 md:p-8 border-b border-border/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Icon or Gym Image + Name */}
        <div className="flex items-center gap-4 md:gap-6">
          {gym.logoUrl ? (
            <img
              src={gym.logoUrl}
              alt={gym.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center text-4xl md:text-5xl shadow-lg group-hover:scale-110 transition-transform duration-500">
              🏢
            </div>
          )}

          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-1 group-hover:text-primary transition-colors duration-300">
              {gym.name}
            </h2>

            {gym.slogan && (
              <p className="text-sm md:text-base text-text-secondary italic">
                "{gym.slogan}"
              </p>
            )}
          </div>
        </div>

        {/* Status Badges Container */}
        <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto flex flex-col items-end md:flex-row md:items-center gap-2">
          {/* Role Badge */}
          {displayRole && (
            <div className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md bg-blue-500/20 text-blue-500 border-2 border-blue-500/30">
              {t(`roles.${displayRole.toLowerCase()}`, displayRole)}
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md ${
              gym.isActive
                ? "bg-success/20 text-success border-2 border-success/30"
                : "bg-text-secondary/20 text-text-secondary border-2 border-text-secondary/30"
            }`}
          >
            {gym.isActive
              ? t("gymCard.activeStatus", "● Active")
              : t("gymCard.inactiveStatus", "○ Inactive")}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface GymInfoOverviewProps {
  gym: Gym;
  onSelect: () => void;
  onToggleSettings: () => void;
}

export function GymInfoOverview({
  gym,
  onSelect,
  onToggleSettings,
}: GymInfoOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Location */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📍</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.location", "Location")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-words">
                {gym.address || t("gymCard.noAddress", "No address provided")}
              </p>

              {(gym.city || gym.state || gym.country) && (
                <p className="text-xs text-text-secondary mt-1">
                  {gym.city}
                  {gym.state && `, ${gym.state}`}
                  {gym.country && ` - ${gym.country}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📞</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.contact", "Contact")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-all">
                {gym.phone || t("gymCard.noPhone", "No phone")}
              </p>

              {gym.email && (
                <p className="text-xs text-text-secondary mt-1 break-all">
                  {gym.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="flex items-start gap-3">
            <span className="text-3xl">👥</span>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.members", "Members")}
              </h4>
              <p className="text-2xl font-bold text-text-primary">
                0{" "}
                <span className="text-sm font-normal text-text-secondary">
                  {t("gymCard.activeMembers", "active members")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Website */}
      {gym.website && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🌐</span>
            <span className="text-text-secondary">
              {t("gymCard.website", "Website")}:
            </span>
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all"
            >
              {gym.website}
            </a>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button className="flex-1 py-4 px-6 text-center rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
          {t("gymCard.manageGym", "Manage Gym")}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSettings();
          }}
          className="flex-1 py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
        >
          {t("gymCard.viewMoreDetails")}
        </button>
      </div>
    </div>
  );
}

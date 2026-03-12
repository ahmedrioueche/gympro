import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface GymSettingsViewProps {
  gym: Gym;
  onBack: () => void;
}

export function GymSettingsView({ gym, onBack }: GymSettingsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <h3 className="text-lg md:text-2xl font-bold text-text-primary mb-4 md:mb-6">
        {t("gymCard.settingsTitle", "Gym Details & Settings")}
      </h3>

      <div className="space-y-4 md:space-y-6">
        {/* Settings */}
        {gym.settings && (
          <div className="bg-surface/50 rounded-xl p-3.5 md:p-5 border border-border/50">
            <h4 className="text-sm md:text-lg font-semibold text-text-primary mb-3 md:mb-4 flex items-center gap-2">
              <span>⚙️</span>
              {t("gymCard.settings", "Settings")}
            </h4>
            <div className="space-y-3">
              {gym.settings.paymentMethods &&
                gym.settings.paymentMethods.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      {t("gymCard.paymentMethods", "Payment Methods")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gym.settings.paymentMethods.map((method, idx) => (
                        <span
                           key={idx}
                           className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {gym.settings.workingHours && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                      {t("gymCard.workingHours", "Working Hours")}
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      {gym.settings.workingHours.start} -{" "}
                      {gym.settings.workingHours.end}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                    {t("gymCard.mixedTraining", "Mixed Training")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {gym.settings.isMixed
                      ? "✅ Males and females can train together"
                      : "❌ Separate training times"}
                  </p>
                </div>
              </div>

              {gym.settings.femaleOnlyHours &&
                gym.settings.femaleOnlyHours.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                      {t("gymCard.femaleOnlyHours", "Female-Only Hours")}
                    </p>
                    <div className="space-y-2">
                      {gym.settings.femaleOnlyHours.map((timeRange, idx) => (
                        <div
                          key={idx}
                          className="text-sm font-medium text-text-primary bg-primary/5 px-3 py-2 rounded-lg"
                        >
                          {timeRange.days.join(", ")}: {timeRange.range.start} -{" "}
                          {timeRange.range.end}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {gym.settings.servicesOffered &&
                gym.settings.servicesOffered.length > 0 && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                      {t("gymCard.servicesOffered", "Services Offered")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gym.settings.servicesOffered.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-5 md:mt-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="w-full py-3 md:py-4 px-4 md:px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-sm md:text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
        >
          {t("gymCard.back", "← Back to Overview")}
        </button>
      </div>
    </div>
  );
}

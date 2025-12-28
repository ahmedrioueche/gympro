import { type GymSettings } from "@ahmedrioueche/gympro-client";
import { Clock, User, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OperatingHoursProps {
  settings?: GymSettings;
}

export default function OperatingHours({ settings }: OperatingHoursProps) {
  const { t } = useTranslation();

  if (!settings?.workingHours) return null;

  const { start, end } = settings.workingHours;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          {t("gymHome.hours.title")}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mixed Session */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-text-primary">
              {t("gymHome.hours.mixed")}
            </span>
          </div>
          <span className="text-text-secondary font-mono">
            {start} - {end}
          </span>
        </div>

        {/* Women Only (if applicable) */}
        {settings.femaleOnlyHours && settings.femaleOnlyHours.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-pink-500/5 rounded-2xl border border-pink-500/20">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-pink-500" />
              <span className="font-semibold text-pink-600">
                {t("gymHome.hours.womenOnly")}
              </span>
            </div>
            <div className="flex flex-col items-end">
              {settings.femaleOnlyHours.map((slot, idx) => (
                <span key={idx} className="text-pink-700 font-mono text-sm">
                  {slot.range.start} - {slot.range.end}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Men Only (Logic usually inverse of women or custom, but let's assume standard for now) */}
        {/* In many gyms if it's not mixed and not women, it's men. But let's show mixed if isMixed is true */}
        {!settings.isMixed && (
          <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-600">
                {t("gymHome.hours.menOnly")}
              </span>
            </div>
            <span className="text-blue-700 font-mono text-sm">
              Custom Slots
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

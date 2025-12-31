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
  const isMixed = settings.isMixed ?? false;
  const femaleOnlyHours = settings.femaleOnlyHours || [];

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          {t("home.gym.hours.title")}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Total Working Hours */}
        <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/50">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-text-primary">
              {t("settings.gym.general.workingHours", "Working Hours")}
            </span>
          </div>
          <span className="text-text-secondary font-mono font-bold">
            {start} - {end}
          </span>
        </div>

        {/* Gender Specific Hours */}
        {isMixed ? (
          <div className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-indigo-600">
                {t("home.gym.hours.mixed")}
              </span>
            </div>
            <span className="text-indigo-700 font-mono text-sm font-bold">
              {start} - {end}
            </span>
          </div>
        ) : femaleOnlyHours.length > 0 ? (
          <div className="border border-pink-500/20 bg-pink-500/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 text-pink-500" />
              <span className="font-semibold text-pink-600">
                {t("home.gym.hours.womenOnly")}
              </span>
            </div>

            <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
              {femaleOnlyHours.map((slot, idx) => (
                <div
                  key={idx}
                  className=" bg-surface/50 border border-border rounded-xl p-3 flex flex-col gap-1.5 shadow-sm"
                >
                  <span className="text-pink-700 font-mono text-sm font-bold block">
                    {slot.range.start} - {slot.range.end}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {slot.days.map((day) => (
                      <span
                        key={day}
                        className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-pink-100 text-pink-600 border border-pink-200"
                      >
                        {t(
                          `settings.gym.general.days.${day.toLowerCase()}`,
                          day.slice(0, 3)
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-600">
                {t("home.gym.hours.menOnly")}
              </span>
            </div>
            <span className="text-blue-700 font-mono text-sm font-bold">
              {start} - {end}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

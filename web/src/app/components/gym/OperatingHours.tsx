import { type GymSettings } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Clock, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatWorkingDays } from "../../../utils/gym";
import { cn } from "../../../utils/helper";
import type { GymStatus } from "../../pages/main/gym/member/home/hooks/useGymMemberHome";

interface OperatingHoursProps {
  settings?: GymSettings;
  status: GymStatus;
}

export default function OperatingHours({
  settings,
  status,
}: OperatingHoursProps) {
  const { t } = useTranslation();

  if (!settings?.workingHours) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            {t("home.gym.hours.title", "Operating Hours")}
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-muted/10 rounded-full mb-4">
            <Clock className="w-8 h-8 text-text-secondary/50" />
          </div>
          <p className="text-text-secondary font-medium text-center">
            {t("home.gymMember.noHours", "No operating hours configured")}
          </p>
        </div>
      </div>
    );
  }

  const { start, end } = settings.workingHours;
  const isMixed = settings.isMixed ?? false;
  const femaleOnlyHours = settings.femaleOnlyHours || [];

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          {t("home.gym.hours.title", "Operating Hours")}
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        {/* Active Closure Information */}
        {status.isTemporaryClosure && status.activeClosure && (
          <div className="p-4 bg-danger/5 border border-danger/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-danger" />
              <span className="text-xs font-black text-danger uppercase tracking-widest">
                {status.activeClosure.reason ||
                  t("home.gym.temporaryClosure", "Closure Active")}
              </span>
            </div>
            <div className="text-lg font-black text-text-primary">
              {format(new Date(status.activeClosure.start), "MMM d, p")} —{" "}
              {format(new Date(status.activeClosure.end), "MMM d, p")}
            </div>
            <p className="text-xs text-text-secondary mt-1 font-medium italic">
              {t(
                "home.gymMember.closureNotice",
                "The gym is currently closed for the duration above.",
              )}
            </p>
          </div>
        )}

        {/* Regular Working Hours */}
        <div className="flex flex-col gap-2 p-4 bg-muted/10 rounded-2xl border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-bold text-text-primary tracking-tight">
                {settings.useAdvancedHours
                  ? t("settings.gym.general.advancedHours", "Advanced Schedule")
                  : t("settings.gym.general.workingHours", "Regular Hours")}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-text-primary leading-none">
                {settings.useAdvancedHours
                  ? status.isOpen
                    ? status.nextStatusChange?.startsWith("Closes at")
                      ? status.nextStatusChange.replace("Closes at ", "")
                      : t("common.open", "Open")
                    : t("common.closed", "Closed")
                  : `${start} — ${end}`}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-bold text-text-secondary opacity-70 uppercase tracking-wider">
              {t("home.gymMember.operatingDays", "Operating Days")}
            </span>
            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
              {formatWorkingDays(
                settings.workingDays || [0, 1, 2, 3, 4, 5, 6],
                t,
              )}
            </span>
          </div>
        </div>

        {/* Gender Specific Sessions or Custom Slots */}
        <div className="mt-4">
          <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 px-1">
            {settings.useAdvancedHours
              ? t("home.gym.slots.title", "Daily Slots")
              : t("home.gym.sessions.title", "Access Schedule")}
          </div>

          <div className="space-y-2">
            {settings.useAdvancedHours && settings.customWorkingHours ? (
              settings.customWorkingHours.map((slot, idx) => {
                const now = new Date();
                const currentDay = now
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase();
                const isForToday = slot.days.some(
                  (day) => day.toLowerCase() === currentDay,
                );

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex flex-col gap-2 p-3 rounded-xl border",
                      isForToday
                        ? "bg-primary/5 border-primary/20"
                        : "bg-surface-hover border-border",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isForToday ? "text-primary" : "text-text-primary",
                        )}
                      >
                        {t("settings.gym.general.slot", "Slot")} {idx + 1}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-black font-mono",
                          isForToday ? "text-primary" : "text-text-secondary",
                        )}
                      >
                        {slot.range.start} — {slot.range.end}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {slot.days.map((day) => (
                        <span
                          key={day}
                          className={cn(
                            "px-1.5 py-0.5 text-[9px] font-black uppercase rounded border",
                            day.toLowerCase() === currentDay
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted/10 text-text-secondary border-border",
                          )}
                        >
                          {t(
                            `common.weekDays.${day.toLowerCase()}`,
                            day.slice(0, 3),
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : isMixed ? (
              <div className="flex items-center justify-between p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <span className="text-sm font-bold text-indigo-600">
                  {t("home.gym.hours.mixed", "Mixed Access")}
                </span>
                <span className="text-xs font-black text-indigo-700 font-mono">
                  {start} — {end}
                </span>
              </div>
            ) : (
              <>
                {/* Men's Session (Default remainder) */}
                <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-blue-600">
                      {t("home.gym.hours.menOnly", "Men Only")}
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold uppercase">
                      {t("home.gym.hours.standardSession", "Standard Session")}
                    </span>
                  </div>
                  <span className="text-xs font-black text-blue-700 font-mono">
                    {start} — {end}
                  </span>
                </div>

                {/* Female Only Hours */}
                {femaleOnlyHours.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-3 bg-pink-500/5 rounded-xl border border-pink-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-pink-600">
                        {t("home.gym.hours.womenOnly", "Women Only")}
                      </span>
                      <span className="text-xs font-black text-pink-700 font-mono">
                        {slot.range.start} — {slot.range.end}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {slot.days.map((day) => (
                        <span
                          key={day}
                          className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-pink-500/10 text-pink-600 border border-pink-500/20"
                        >
                          {t(
                            `common.weekDays.${day.toLowerCase()}`,
                            day.slice(0, 3),
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

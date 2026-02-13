import {
  SessionType,
  type CreateSessionDto,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { cn } from "../../../../utils/helper";

interface SessionFormProps {
  data: CreateSessionDto;
  updateField: <K extends keyof CreateSessionDto>(
    field: K,
    value: CreateSessionDto[K],
  ) => void;
  clients: any[];
  facilities?: any[];
}

export const SessionForm = ({
  data,
  updateField,
  clients,
  facilities = [],
}: SessionFormProps) => {
  const { t } = useTranslation();

  const handleRecurrenceChange = (type: any) => {
    updateField("recurrence", {
      ...data.recurrence,
      type,
    });
  };

  const handleDayToggle = (day: number) => {
    const currentDays = data.recurrence?.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    updateField("recurrence", {
      ...data.recurrence,
      days: newDays,
    } as any);
  };

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <CustomSelect
        title={t("schedule.form.client")}
        placeholder={t("schedule.form.selectClient")}
        selectedOption={data.memberId}
        onChange={(value) => updateField("memberId", value)}
        options={clients.map((client) => ({
          value: client.userId,
          label: client.fullName || client.username || "",
        }))}
        searchable={clients.length > 5 ? true : false}
      />

      {/* Date & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={t("schedule.form.startTime")}
          type="datetime-local"
          value={data.startTime}
          onChange={(e) => updateField("startTime", e.target.value)}
          required
        />
        <InputField
          label={t("schedule.form.duration")}
          type="number"
          value={data.duration.toString()}
          onChange={(e) => updateField("duration", parseInt(e.target.value))}
          placeholder="60"
          min="15"
          step="15"
          required
        />
      </div>

      {/* Facility / Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.length > 0 ? (
          <CustomSelect
            title={t("schedule.form.facility")}
            selectedOption={
              facilities.find((f) => f._id === data.facilityId)?.name || ""
            }
            onChange={(val) => updateField("facilityId", val)}
            options={facilities.map((f) => ({
              value: f._id,
              label: f.name,
            }))}
            placeholder={t("schedule.form.selectFacility")}
          />
        ) : (
          <InputField
            label={t("schedule.form.location")}
            type="text"
            value={data.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder={t("schedule.form.locationPlaceholder")}
          />
        )}

        <CustomSelect
          title={t("schedule.form.type")}
          selectedOption={t(`schedule.types.${data.type}`)}
          onChange={(value) => updateField("type", value as SessionType)}
          options={[
            {
              value: SessionType.ONE_ON_ONE,
              label: t("schedule.types.one_on_one"),
            },
            {
              value: SessionType.CONSULTATION,
              label: t("schedule.types.consultation"),
            },
            {
              value: SessionType.CHECK_IN,
              label: t("schedule.types.check_in"),
            },
            {
              value: SessionType.ASSESSMENT,
              label: t("schedule.types.assessment"),
            },
          ]}
          marginTop="mt-0"
        />
      </div>

      {/* Recurrence Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          title={t("classes.form.recurrence.label")}
          selectedOption={t(
            `classes.form.recurrence.${data.recurrence?.type || "none"}`,
          )}
          onChange={handleRecurrenceChange}
          options={[
            { value: "none", label: t("classes.form.recurrence.none") },
            { value: "daily", label: t("classes.form.recurrence.daily") },
            { value: "weekly", label: t("classes.form.recurrence.weekly") },
            {
              value: "biweekly",
              label: t("classes.form.recurrence.biweekly"),
            },
            { value: "monthly", label: t("classes.form.recurrence.monthly") },
            { value: "custom", label: t("classes.form.recurrence.custom") },
          ]}
        />

        {data.recurrence?.type !== "none" && (
          <div className="space-y-3">
            <InputField
              label={t("classes.form.recurrence.endDate")}
              type="date"
              value={
                data.recurrence?.endDate ? String(data.recurrence.endDate) : ""
              }
              onChange={(e) =>
                updateField("recurrence" as any, {
                  ...data.recurrence,
                  endDate: e.target.value,
                })
              }
              required={!(data.recurrence as any)?.noEndDate}
              disabled={(data.recurrence as any)?.noEndDate}
            />
            <label className="flex items-center gap-3 px-1 cursor-pointer select-none group/check">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={(data.recurrence as any)?.noEndDate || false}
                  onChange={(e) =>
                    updateField("recurrence" as any, {
                      ...data.recurrence,
                      noEndDate: e.target.checked,
                      endDate: e.target.checked ? "" : data.recurrence?.endDate,
                    })
                  }
                  className="peer hidden"
                />
                <div className="w-5 h-5 rounded-md border-2 border-white/10 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-xs font-semibold text-white/40 group-hover/check:text-white/60 transition-colors uppercase tracking-wider">
                {t(
                  "classes.form.recurrence.noEndDate",
                  "Ongoing (No end date)",
                )}
              </span>
            </label>
          </div>
        )}
      </div>

      {data.recurrence?.type === "custom" && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">
            {t("classes.form.recurrence.days")}
          </label>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const isSelected = data.recurrence?.days?.includes(day);
              const labels = [
                t("common.weekDays.sunday", "Sun"),
                t("common.weekDays.monday", "Mon"),
                t("common.weekDays.tuesday", "Tue"),
                t("common.weekDays.wednesday", "Wed"),
                t("common.weekDays.thursday", "Thu"),
                t("common.weekDays.friday", "Fri"),
                t("common.weekDays.saturday", "Sat"),
              ];
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={cn(
                    "flex-1 min-w-[60px] h-11 rounded-xl text-xs font-bold transition-all border",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.4)]"
                      : " text-white/40 border-white/10 hover:border-white/20 hover:text-white/60",
                  )}
                >
                  {labels[day]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t("schedule.form.notes")}
        </label>
        <textarea
          value={data.notes || ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder={t("schedule.form.notesPlaceholder")}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
        />
      </div>
    </div>
  );
};

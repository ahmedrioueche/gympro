import {
  SessionType,
  type CreateSessionDto,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";

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
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("schedule.form.startTime")}
          </label>
          <input
            type="datetime-local"
            value={data.startTime}
            onChange={(e) => updateField("startTime", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("schedule.form.duration")}
          </label>
          <input
            type="number"
            value={data.duration}
            onChange={(e) => updateField("duration", parseInt(e.target.value))}
            placeholder="60"
            min="15"
            step="15"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            required
          />
        </div>
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
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("schedule.form.location")}
            </label>
            <input
              type="text"
              value={data.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder={t("schedule.form.locationPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("classes.form.recurrence.endDate")}
            </label>
            <input
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
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              required
            />
          </div>
        )}
      </div>

      {data.recurrence?.type === "custom" && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-secondary">
            {t("classes.form.recurrence.days")}
          </label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const isSelected = data.recurrence?.days?.includes(day);
              const labels = ["S", "M", "T", "W", "T", "F", "S"];
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface text-text-secondary hover:bg-surface-hover border border-border"
                  }`}
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

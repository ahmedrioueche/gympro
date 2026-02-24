import { Crosshair, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import SearchFilterBar from "../../../../../../components/ui/SearchFilterBar";
import { COACH_SPECIALIZATIONS } from "../../../../../../constants/gym";

interface CoachesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  specialization: string;
  onSpecializationChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  showFilters: boolean;
  onShowFiltersToggle: () => void;
  onDetectLocation: () => void;
  detectingLocation: boolean;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const GENDER_OPTIONS = [
  { value: "all", label: "common.all" },
  { value: "male", label: "common.male" },
  { value: "female", label: "common.female" },
];

export default function CoachesFilters({
  searchQuery,
  onSearchChange,
  specialization,
  onSpecializationChange,
  city,
  onCityChange,
  state,
  onStateChange,
  country,
  onCountryChange,
  gender,
  onGenderChange,
  showFilters,
  onShowFiltersToggle,
  onDetectLocation,
  detectingLocation,
  onClearFilters,
  activeFilterCount,
}: CoachesFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={t("coaches.filters.search")}
        filters={[
          {
            value: specialization,
            onChange: onSpecializationChange,
            options: COACH_SPECIALIZATIONS.map((opt) => ({
              ...opt,
              label: t(opt.label),
            })),
            label: t("coaches.filters.specialization"),
          },
          {
            value: gender,
            onChange: onGenderChange,
            options: GENDER_OPTIONS.map((opt) => ({
              ...opt,
              label: t(opt.label),
            })),
            label: t("common.gender"),
          },
        ]}
      />

      {/* Location Filters */}
      <div className="bg-surface border border-border rounded-xl p-3 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-text-secondary flex-shrink-0" />
            <h3 className="font-semibold text-text-primary text-sm md:text-base truncate">
              {t("common.locationFilters")}
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-1.5 md:px-2 py-0.5 bg-primary/10 text-primary text-[10px] md:text-xs font-medium rounded-full flex-shrink-0">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {/* Detect Location — icon on mobile, text on desktop */}
            <button
              onClick={onDetectLocation}
              disabled={detectingLocation}
              className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              title={t("coaches.filters.detectLocation")}
            >
              <Crosshair
                className={`w-4 h-4 flex-shrink-0 ${detectingLocation ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">
                {detectingLocation
                  ? t("coaches.filters.detecting")
                  : t("coaches.filters.detectLocation")}
              </span>
            </button>

            {/* Toggle Filters — icon on mobile, text on desktop */}
            <button
              onClick={onShowFiltersToggle}
              className={`flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showFilters
                  ? "text-primary bg-primary/10"
                  : "text-text-secondary hover:text-primary hover:bg-primary/10"
              }`}
              title={`${showFilters ? t("common.hide") : t("common.show")} ${t("common.filters.label")}`}
            >
              <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">
                {showFilters ? t("common.hide") : t("common.show")}{" "}
                {t("common.filters.label")}
              </span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <InputField
                label={t("coaches.filters.city")}
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder={t("coaches.filters.cityPlaceholder")}
              />
              <InputField
                label={t("coaches.filters.state")}
                value={state}
                onChange={(e) => onStateChange(e.target.value)}
                placeholder={t("coaches.filters.statePlaceholder")}
              />
              <InputField
                label={t("coaches.filters.country")}
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                placeholder={t("coaches.filters.countryPlaceholder")}
              />
            </div>

            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={onClearFilters}
                  className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {t("coaches.filters.clearFilters")}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
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
    <div className="space-y-6">
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
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">
              {t("common.locationFilters")}
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center md:flex-row flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDetectLocation}
              loading={detectingLocation}
            >
              {detectingLocation
                ? t("coaches.filters.detecting")
                : t("coaches.filters.detectLocation")}
            </Button>
            <Button variant="ghost" size="sm" onClick={onShowFiltersToggle}>
              {showFilters ? t("common.hide") : t("common.show")}{" "}
              {t("common.filters.label")}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  icon={<X className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {t("coaches.filters.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import SearchFilterBar from "../../../../../../components/ui/SearchFilterBar";
import { COACH_SPECIALIZATIONS } from "../../../../../../constants/gym";

interface CoachesFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  specialization: string;
  onSpecializationChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
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
  gender,
  onGenderChange,
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
    </div>
  );
}

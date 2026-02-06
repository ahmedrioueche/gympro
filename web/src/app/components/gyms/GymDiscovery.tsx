import { type Gym } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchFilterBar, {
  type FilterOption,
} from "../../../components/ui/SearchFilterBar";
import { useGymCities, useGyms } from "../../../hooks/queries/useGyms";
import { useUserStore } from "../../../store/user";
import GymList from "../gym/GymList";

interface GymDiscoveryProps {
  onGymSelect?: (gym: Gym) => void;
  onGymJoin?: (gym: Gym) => void;
  title?: string;
  description?: string;
}

export function GymDiscovery({
  onGymSelect,
  onGymJoin,
  title,
  description,
}: GymDiscoveryProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [servicesFilter, setServicesFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, cityFilter, genderFilter, servicesFilter]);

  const { data: result, isLoading } = useGyms({
    search: searchQuery,
    city: cityFilter === "all" ? undefined : cityFilter,
    gender: genderFilter === "all" ? undefined : genderFilter,
    services: servicesFilter.length > 0 ? servicesFilter : undefined,
    page,
    limit,
    excludeUserId: user?._id,
  });

  const gyms = result?.data || [];
  const totalPages = result?.totalPages || 1;

  const { data: dynamicCities = [] } = useGymCities();
  console.log("GymDiscovery: dynamicCities", dynamicCities);

  const cityOptions: FilterOption[] = [
    { value: "all", label: t("gyms.cities_all") },
    ...dynamicCities
      .filter((city) => city && city.trim() !== "")
      .map((city) => ({ value: city, label: city })),
  ];

  const genderOptions: FilterOption[] = [
    { value: "all", label: t("gyms.gender_all") },
    { value: "mixed", label: t("gyms.gender_mixed") },
    { value: "female_only", label: t("gyms.gender_female_only") },
  ];

  const serviceOptions: FilterOption[] = [
    { value: "gym", label: t("gyms.service_gym") },
    { value: "cardio", label: t("gyms.service_cardio") },
    { value: "crossfit", label: t("gyms.service_crossfit") },
    { value: "swimming", label: t("gyms.service_swimming") },
  ];

  return (
    <div className="space-y-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("gyms.search_placeholder")}
        filters={[
          {
            value: cityFilter,
            onChange: setCityFilter,
            options: cityOptions,
          },
          {
            value: genderFilter,
            onChange: setGenderFilter,
            options: genderOptions,
          },
          // For services, since SearchFilterBar dropdown currently only supports single select
          // we might need a separate component if we want multi-select in the dropdown.
          // But for now let's use it as single select to stay simple with SearchFilterBar
          // OR I can update SearchFilterBar to support multi-select later.
          // Let's use it as single select for now to satisfy the "gender, services" request.
          {
            value: servicesFilter[0] || "all",
            onChange: (val) => setServicesFilter(val === "all" ? [] : [val]),
            options: [
              { value: "all", label: t("gyms.filter_services") },
              ...serviceOptions,
            ],
          },
        ]}
      />

      <GymList
        gyms={gyms}
        isLoading={isLoading}
        onSelect={onGymSelect}
        onJoin={onGymJoin}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pb-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-border disabled:opacity-50 hover:bg-surface transition-colors"
          >
            ⬅️
          </button>
          <span className="text-sm font-medium">
            {t("common.page_of", { current: page, total: totalPages })}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-border disabled:opacity-50 hover:bg-surface transition-colors"
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default GymDiscovery;

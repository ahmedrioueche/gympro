import { UserCheck } from "lucide-react";
import PageHeader from "../../../../components/PageHeader";
import CoachesFilters from "./components/CoachesFilters";
import CoachesList from "./components/CoachesList";
import { useCoachesPage } from "./hooks/useCoachesPage";

export default function CoachesPage() {
  const {
    t,
    searchQuery,
    setSearchQuery,
    specialization,
    setSpecialization,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    gender,
    setGender,
    showFilters,
    setShowFilters,
    detectingLocation,
    isLoading,
    filteredCoaches,
    activeFilterCount,
    handleSelectCoach,
    handleDetectLocation,
    handleClearFilters,
  } = useCoachesPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coaches.title")}
        subtitle={t("coaches.subtitle")}
        icon={UserCheck}
      />

      <CoachesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        specialization={specialization}
        onSpecializationChange={setSpecialization}
        city={city}
        onCityChange={setCity}
        state={state}
        onStateChange={setState}
        country={country}
        onCountryChange={setCountry}
        gender={gender}
        onGenderChange={setGender}
        showFilters={showFilters}
        onShowFiltersToggle={() => setShowFilters(!showFilters)}
        onDetectLocation={handleDetectLocation}
        detectingLocation={detectingLocation}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        {t("coaches.filters.showingResults", { count: filteredCoaches.length })}
      </div>

      {/* Coaches List */}
      <CoachesList
        coaches={filteredCoaches}
        isLoading={isLoading}
        onSelectCoach={handleSelectCoach}
      />
    </div>
  );
}

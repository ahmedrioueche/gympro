import { Dumbbell, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { SearchFilterBar } from "../../../../../components/ui/SearchFilterBar";
import { ProgramCard } from "../../../../components/cards/ProgramCard";
import PageHeader from "../../../../components/PageHeader";
import { useProgramsPage } from "./hooks/useProgramsPage";

export default function ProgramsPage() {
  const { t } = useTranslation();
  const {
    programs,
    isLoading,
    activeProgram,
    filterSource,
    setFilterSource,
    searchQuery,
    setSearchQuery,
    handleUseProgram,
    handleViewDetails,
    openModal,
  } = useProgramsPage();

  const filterOptions = [
    { value: "all", label: t("training.programs.tabs.all") },
    { value: "coach", label: t("training.programs.tabs.coach") },
    { value: "template", label: t("training.programs.tabs.template") },
    { value: "member", label: t("training.programs.tabs.member") },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("training.programs.title")}
        subtitle={t("training.programs.subtitle")}
        icon={Dumbbell}
        actionButton={{
          label: t("training.programs.createProgram"),
          icon: Plus,
          onClick: () => openModal("create_program"),
          show: true,
        }}
      />

      {/* Filters & Search */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("training.programs.searchPlaceholder")}
        filterValue={filterSource}
        onFilterChange={setFilterSource}
        filterOptions={filterOptions}
      />

      {/* Content */}
      {isLoading ? (
        <Loading className="py-20" />
      ) : !programs || programs.length === 0 ? (
        <NoData
          icon={Dumbbell}
          title={t("coach.programs.noPrograms.title")}
          actionButton={
            searchQuery === "" && filterSource === "all"
              ? {
                  label: t("coach.programs.createProgram"),
                  icon: Plus,
                  onClick: () => openModal("create_program"),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => (
            <ProgramCard
              key={program._id}
              program={program}
              isActive={
                activeProgram?.status === "active" &&
                activeProgram.program._id === program._id
              }
              onUse={handleUseProgram}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

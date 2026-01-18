import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { SearchFilterBar } from "../../../../../components/ui/SearchFilterBar";
import { APP_PAGES } from "../../../../../constants/navigation";
import {
  useActiveProgram,
  usePrograms,
  useStartProgram,
} from "../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../store/modal";
import { ProgramCard } from "../../../../components/cards/ProgramCard";
import PageHeader from "../../../../components/PageHeader";

export default function ProgramsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [filterSource, setFilterSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: programs, isLoading } = usePrograms({
    source: filterSource === "all" ? undefined : filterSource,
    search: searchQuery || undefined,
  });

  const { data: activeProgram } = useActiveProgram();
  const startProgram = useStartProgram();

  const handleUseProgram = (id: string) => {
    // 1. Check if user already has an active program
    if (activeProgram?.status === "active") {
      if (activeProgram.program._id === id) {
        // Already on this program
        navigate({ to: APP_PAGES.member.training.link });
        return;
      }
      // Different program active -> Block and Alert
      toast(t("training.page.start.activeCheck"), {
        icon: "⚠️",
        duration: 4000,
      });
      navigate({ to: APP_PAGES.member.training.link });
      return;
    }

    // 2. Start program
    startProgram.mutate(id, {
      onSuccess: () => {
        navigate({ to: APP_PAGES.member.training.link });
      },
      onError: (error: any) => {
        // Backend might also throw if we race condition, show error
        toast.error(
          error?.response?.data?.message || "Failed to start program"
        );
      },
    });
  };

  const handleViewDetails = (program: TrainingProgram) => {
    openModal("program_details", {
      program,
      isActive:
        activeProgram?.status === "active" &&
        activeProgram.program._id === program._id,
      onUse: handleUseProgram,
    });
  };

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

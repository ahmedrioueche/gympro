import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { SearchFilterBar } from "../../../../../components/ui/SearchFilterBar";
import { APP_PAGES } from "../../../../../constants/navigation";
import {
  useActiveProgram,
  usePrograms,
  useStartProgram,
} from "../../../../../hooks/queries/useTraining";
import PageHeader from "../../../../components/PageHeader";
import { CreateProgramModal } from "./components/create-program-modal";
import { ProgramCard } from "./components/program-card/ProgramCard";
import { ProgramDetailsModal } from "./components/program-details-modal/ProgramDetailsModal";

export default function ProgramsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterSource, setFilterSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] =
    useState<TrainingProgram | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          onClick: () => setIsCreateModalOpen(true),
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
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-background mb-4">
            <Dumbbell size={48} className="text-text-secondary opacity-30" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {t("training.programs.notFound.title")}
          </h3>
          <p className="text-text-secondary max-w-sm mx-auto mb-6">
            {t("training.programs.notFound.desc")}
          </p>
          {searchQuery === "" && filterSource === "all" && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 h-[42px] text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ring-1 ring-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              {t("training.programs.createProgram")}
            </button>
          )}
        </div>
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
              onViewDetails={setSelectedProgram}
            />
          ))}
        </div>
      )}

      <ProgramDetailsModal
        program={selectedProgram}
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onUse={handleUseProgram}
        onProgramUpdated={setSelectedProgram}
        isActive={
          activeProgram?.status === "active" &&
          activeProgram.program._id === selectedProgram?._id
        }
      />

      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

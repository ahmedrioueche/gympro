import { type TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { SearchInput } from "../../../../../components/ui/SearchInput";
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

  const tabs = [
    { id: "all", label: t("training.programs.tabs.all") },
    { id: "coach", label: t("training.programs.tabs.coach") },
    { id: "template", label: t("training.programs.tabs.template") },
    { id: "member", label: t("training.programs.tabs.member") },
  ];

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex p-1 bg-background-secondary rounded-xl overflow-x-auto max-w-full no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterSource(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filterSource === tab.id
                      ? "bg-card shadow-sm text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full md:w-64">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t("training.programs.searchPlaceholder")}
              />
            </div>
          </div>
        </div>

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
    </div>
  );
}

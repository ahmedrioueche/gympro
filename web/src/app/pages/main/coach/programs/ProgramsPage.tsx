import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import SearchFilterBar from "../../../../../components/ui/SearchFilterBar";
import {
  useActiveProgram,
  usePrograms,
} from "../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../store/modal";
import { ProgramCard } from "../../../../components/cards/ProgramCard";
import PageHeader from "../../../../components/PageHeader";

export default function ProgramsPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: activeProgram } = useActiveProgram();

  // Determine which source to filter by based on active tab
  const source = activeTab === 0 ? "coach" : undefined;

  const { data: programs, isLoading } = usePrograms({
    source,
    search: searchQuery || undefined,
  });

  const tabs = [
    { id: 0, label: t("coach.programs.tabs.myPrograms") },
    { id: 1, label: t("coach.programs.tabs.otherPrograms") },
  ];

  const showSearch = (programs && programs.length > 0) || searchQuery !== "";

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("coach.programs.title")}
        subtitle={t("coach.programs.subtitle")}
        icon={Dumbbell}
        actionButton={{
          label: t("coach.programs.createProgram"),
          icon: Plus,
          onClick: () => openModal("create_program"),
          show: true,
        }}
      />

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      {showSearch && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("coach.programs.searchPlaceholder")}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <Loading className="py-20" />
      ) : !programs || programs.length === 0 ? (
        <NoData
          icon={Dumbbell}
          title={t("coach.programs.noPrograms.title")}
          actionButton={
            searchQuery === "" && activeTab === 0
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
              onUse={() => {}}
              onViewDetails={() =>
                openModal("program_details", {
                  program,
                  isActive:
                    activeProgram?.status === "active" &&
                    activeProgram.program._id === program._id,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

import type { TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { ProgramCard } from "../../../cards/ProgramCard";

interface ProgramListProps {
  programs: TrainingProgram[];
  isLoading: boolean;
  selectedProgramId: string | null;
  onSelect: (id: string) => void;
}

export function ProgramList({
  programs,
  isLoading,
  selectedProgramId,
  onSelect,
}: ProgramListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loading className="items-center" fullScreen={false} />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {t("coach.clients.assignProgram.noPrograms")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
      {programs.map((program) => (
        <ProgramCard
          key={program._id}
          program={program}
          selectable
          selected={selectedProgramId === program._id}
          onSelect={() => onSelect(program._id!)}
        />
      ))}
    </div>
  );
}

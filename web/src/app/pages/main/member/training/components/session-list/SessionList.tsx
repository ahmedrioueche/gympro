import {
  type ProgramDayProgress,
  type TrainingProgram,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { SessionItem } from "./SessionItem";

interface SessionListProps {
  sessions: ProgramDayProgress[];
  program: TrainingProgram;
  onEditSession?: (session: ProgramDayProgress) => void;
}

export const SessionList = ({
  sessions,
  program,
  onEditSession,
}: SessionListProps) => {
  const { t } = useTranslation();
  if (!sessions?.length) {
    return (
      <div className="text-center py-8 text-text-secondary italic">
        {t("training.logSession.noSessions")}
      </div>
    );
  }

  // Sort by date desc
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedSessions.map((session, index) => (
        <SessionItem
          key={index}
          session={session}
          program={program}
          onEdit={onEditSession ? () => onEditSession(session) : undefined}
        />
      ))}
    </div>
  );
};

import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../../components/ui/Error";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { useModalStore } from "../../../../../../../store/modal";
import { ClientCard } from "../../../../../../components/cards/ClientCard";
import { useGymCoachClients } from "../hooks/useGymCoachClients";

export function GymActiveClientsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { data: clients, isLoading, isError, error } = useGymCoachClients();

  const handleAssignProgram = (userId: string, currentProgramId?: string) => {
    openModal("assign_program", { clientId: userId, currentProgramId });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  if (!clients || !Array.isArray(clients) || clients.length === 0) {
    return (
      <NoData
        emoji="👥"
        title={t("coach.clients.activeClients.noData")}
        description={t("coach.clients.activeClients.noDataDesc")}
        actionButton={{
          label: t("coach.clients.invite", "Invite Client"),
          onClick: () => navigate({ to: APP_PAGES.gym.coach.settings.link }), // Redirect to settings or invite page if exists
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard
          key={client.userId}
          client={client}
          onAssignProgram={() =>
            handleAssignProgram(client.userId, client.currentProgram?.programId)
          }
        />
      ))}
    </div>
  );
}

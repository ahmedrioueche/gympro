import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../store/modal";
import { ClientCard } from "../../../../../components/cards/ClientCard";
import { useActiveClients } from "../hooks/useActiveClients";

export function ActiveClientsSection() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { data: clients, isLoading, isError, error } = useActiveClients();

  if (isError) {
    console.error("Error loading clients:", error);
    // return <div className="text-red-500">Error loading clients</div>; // Optional visual
  }

  const handleAssignProgram = (userId: string, currentProgramId?: string) => {
    openModal("assign_program", { clientId: userId, currentProgramId });
  };

  console.log({ clients, isLoading, isError });
  if (isLoading) {
    return <Loading />;
  }

  if (!clients || !Array.isArray(clients) || clients.length === 0) {
    return (
      <NoData
        emoji="👥"
        title={t("coach.clients.activeClients.noData")}
        description={t("coach.clients.activeClients.noDataDesc")}
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

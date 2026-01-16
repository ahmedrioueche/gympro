import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useActiveClients } from "../hooks/useActiveClients";
import { ClientCard } from "./ClientCard";

export function ActiveClientsSection() {
  const { t } = useTranslation();
  const { data: clients = [], isLoading } = useActiveClients();

  if (isLoading) {
    return <Loading />;
  }

  if (clients.length === 0) {
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
        <ClientCard key={client.userId} client={client} />
      ))}
    </div>
  );
}

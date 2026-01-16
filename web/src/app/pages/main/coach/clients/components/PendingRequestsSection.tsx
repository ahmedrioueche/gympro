import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { usePendingRequests } from "../hooks/usePendingRequests";
import { ClientRequestCard } from "./ClientRequestCard";

export function PendingRequestsSection() {
  const { t } = useTranslation();
  const { data: requests = [], isLoading } = usePendingRequests();

  if (isLoading) {
    return <Loading />;
  }

  if (requests.length === 0) {
    return (
      <NoData
        emoji="✅"
        title={t("coach.clients.pendingRequests.noData")}
        description={t("coach.clients.pendingRequests.noDataDesc")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <ClientRequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}

import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../../components/ui/Error";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import { ClientRequestCard } from "../../../../coach/clients/components/ClientRequestCard";
import { usePendingRequests } from "../../../../coach/clients/hooks/usePendingRequests";

export function ReceivedRequestsSection() {
  const { t } = useTranslation();
  const { data: requests, isLoading, isError, error } = usePendingRequests();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  if (!requests || requests.length === 0) {
    return (
      <NoData
        title={t("coach.clients.requests.empty.title", "No pending requests")}
        description={t(
          "coach.clients.requests.empty.description",
          "You don't have any pending coaching requests.",
        )}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <ClientRequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}

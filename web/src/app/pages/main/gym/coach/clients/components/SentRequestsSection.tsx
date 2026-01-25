import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../../components/ui/Error";
import Loading from "../../../../../../../components/ui/Loading";
import NoData from "../../../../../../../components/ui/NoData";
import { ClientRequestCard } from "../../../../coach/clients/components/ClientRequestCard";
import { useSentRequests } from "../hooks/useSentRequests";

export function SentRequestsSection() {
  const { t } = useTranslation();
  const { data: requests, isLoading, isError, error } = useSentRequests();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent />;
  }

  if (!requests || requests.length === 0) {
    return (
      <NoData
        title={t("coach.clients.sent.empty.title", "No sent requests")}
        description={t(
          "coach.clients.sent.empty.description",
          "You haven't sent any coaching requests to members yet.",
        )}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <ClientRequestCard key={request._id} request={request} isSent={true} />
      ))}
    </div>
  );
}

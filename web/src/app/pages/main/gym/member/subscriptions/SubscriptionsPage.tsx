import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import { CurrentSubscriptionCard } from "./components/CurrentSubscriptionCard";
import { SubscriptionHistoryTable } from "./components/SubscriptionHistoryTable";
import { useMyGymMembership } from "./hooks/useMyGymMembership";

function SubscriptionsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useMyGymMembership();

  console.log("SubscriptionsPage: data", data);
  console.log("SubscriptionsPage: isLoading", isLoading);
  console.log("SubscriptionsPage: error", error);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const membership = data?.membership;
  const history = data?.history || [];

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t("gymMember.subscriptions.title", "My Subscription")}
          subtitle={t(
            "gymMember.subscriptions.subtitle",
            "View your active plan and subscription history"
          )}
          icon={CreditCard}
        />

        <CurrentSubscriptionCard
          subscription={membership?.subscription}
          status={membership?.membershipStatus}
        />

        <SubscriptionHistoryTable history={history} />
      </div>
    </div>
  );
}

export default SubscriptionsPage;

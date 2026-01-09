import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import { SubscriptionsTable } from "../../../member/subscriptions/components/SubscriptionsTable";
import { CurrentSubscriptionCard } from "./components/CurrentSubscriptionCard";
import { SubscriptionHistoryTable } from "./components/SubscriptionHistoryTable";
import { useMyGymMembership } from "./hooks/useMyGymMembership";

function SubscriptionsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useMyGymMembership();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const membership = data?.membership;
  const allMemberships = data?.memberships || [];
  const history = data?.history || [];

  const hasAnyData =
    !!membership || allMemberships.length > 0 || history.length > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("gymMember.subscriptions.title", "My Subscriptions")}
        subtitle={t(
          "gymMember.subscriptions.subtitle",
          "Manage your memberships and subscription history for this gym"
        )}
        icon={CreditCard}
      />

      {!hasAnyData ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-text-secondary">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              {t("gymMember.subscriptions.noRecords.title", "No Records Found")}
            </h3>
            <p className="text-text-secondary max-w-sm mx-auto mt-2">
              {t(
                "gymMember.subscriptions.noRecords.desc",
                "We couldn't find any membership records for you in this gym."
              )}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Active Plan Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary px-1">
              {t("gymMember.subscriptions.activePlan", "Active Plan")}
            </h3>
            <CurrentSubscriptionCard
              subscription={membership?.subscription}
              status={membership?.membershipStatus || "expired"}
            />
          </div>

          {/* All Records Table */}
          {allMemberships.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary px-1">
                {t(
                  "gymMember.subscriptions.allRecords",
                  "Subscription Records"
                )}
              </h3>
              <SubscriptionsTable subscriptions={allMemberships} />
            </div>
          )}

          {/* Detailed History (Internal Snapshots) */}
          {history.length > 0 && (
            <div className="space-y-4">
              <SubscriptionHistoryTable history={history} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubscriptionsPage;

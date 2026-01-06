import {
  type MembershipStatus,
  type SubscriptionInfo,
} from "@ahmedrioueche/gympro-client";
import { Calendar, CreditCard, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../../utils/date";
import { capitalize } from "../../../../../../../utils/helper";

interface CurrentSubscriptionCardProps {
  subscription?: SubscriptionInfo;
  status: MembershipStatus;
}

export function CurrentSubscriptionCard({
  subscription,
  status,
}: CurrentSubscriptionCardProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "expired":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-surface-hover text-text-secondary border-border";
    }
  };

  if (!subscription) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {t(
              "gymMember.subscriptions.noActive.title",
              "No Active Subscription"
            )}
          </h3>
          <p className="text-text-secondary max-w-md">
            {t(
              "gymMember.subscriptions.noActive.desc",
              "You don't have an active subscription for this gym. Please contact the front desk to purchase one."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {capitalize(subscription.typeId)}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  status
                )}`}
              >
                {t(`common.status.${status}`, status)}
              </span>
            </div>
            <p className="text-text-secondary">
              {t("gymMember.subscriptions.currentPlan", "Current Plan")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {t("gymMember.subscriptions.startDate", "Start Date")}
            </p>
            <p className="font-medium text-text-primary">
              {formatDate(subscription.startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <RotateCw className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {t("gymMember.subscriptions.endDate", "End Date")}
            </p>
            <p className="font-medium text-text-primary">
              {formatDate(subscription.endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {t("gymMember.subscriptions.paymentMethod", "Payment Method")}
            </p>
            <p className="font-medium text-text-primary capitalize">
              {subscription.paymentMethod || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

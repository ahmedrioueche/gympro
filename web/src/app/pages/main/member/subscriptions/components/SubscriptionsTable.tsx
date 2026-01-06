import { type MemberSubscriptionView } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SubscriptionsTableProps {
  subscriptions: MemberSubscriptionView[];
}

export const SubscriptionsTable = ({
  subscriptions,
}: SubscriptionsTableProps) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "active":
        return "✅";
      case "expired":
        return "⏰";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "expired":
        return "bg-danger/10 text-danger border-danger/20";
      case "cancelled":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  const getMembershipStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "banned":
      case "canceled":
      case "expired":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-12"></th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("mySubscriptions.table.gym", "Gym")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-40">
                {t("mySubscriptions.table.joined", "Joined")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-40">
                {t("mySubscriptions.table.expires", "Expires")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary w-32">
                {t("mySubscriptions.table.status", "Status")}
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary w-24">
                {t("mySubscriptions.table.details", "Details")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscriptions.map((sub) => (
              <>
                <tr
                  key={sub._id}
                  className="transition-colors duration-200 hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleExpand(sub._id)}
                >
                  <td className="px-6 py-4">
                    <span
                      className="text-xl"
                      role="img"
                      aria-label={sub.subscription?.status || "none"}
                    >
                      {getStatusIcon(sub.subscription?.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">
                        {sub.gym?.name || t("common.unknown", "Unknown Gym")}
                      </span>
                      {sub.gym?.location?.city && (
                        <span className="text-sm text-text-secondary mt-0.5">
                          {sub.gym.location.city}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">
                      {new Date(sub.joinedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sub.subscription?.endDate ? (
                      <div className="flex flex-col">
                        <span className="text-sm text-text-primary">
                          {new Date(
                            sub.subscription.endDate
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {formatDistanceToNow(
                            new Date(sub.subscription.endDate),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-text-secondary">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getMembershipStatusStyle(
                        sub.membershipStatus
                      )}`}
                    >
                      {t(
                        `mySubscriptions.status.${sub.membershipStatus}`,
                        sub.membershipStatus
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(sub._id);
                      }}
                      className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors"
                    >
                      {expandedId === sub._id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {/* Expanded Row - Subscription Details */}
                {expandedId === sub._id && (
                  <tr key={`${sub._id}-details`}>
                    <td colSpan={6} className="px-6 py-4 bg-background/50">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-text-primary text-sm">
                          {t(
                            "mySubscriptions.details.title",
                            "Subscription Details"
                          )}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t(
                                "mySubscriptions.details.startDate",
                                "Start Date"
                              )}
                            </p>
                            <p className="text-sm text-text-primary font-medium">
                              {sub.subscription?.startDate
                                ? new Date(
                                    sub.subscription.startDate
                                  ).toLocaleDateString()
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t("mySubscriptions.details.endDate", "End Date")}
                            </p>
                            <p className="text-sm text-text-primary font-medium">
                              {sub.subscription?.endDate
                                ? new Date(
                                    sub.subscription.endDate
                                  ).toLocaleDateString()
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t(
                                "mySubscriptions.details.subscriptionStatus",
                                "Subscription Status"
                              )}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border inline-block ${getStatusStyle(
                                sub.subscription?.status
                              )}`}
                            >
                              {sub.subscription?.status
                                ? t(
                                    `mySubscriptions.subscriptionStatus.${sub.subscription.status}`,
                                    sub.subscription.status
                                  )
                                : "—"}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t(
                                "mySubscriptions.details.paymentMethod",
                                "Payment Method"
                              )}
                            </p>
                            <p className="text-sm text-text-primary font-medium capitalize">
                              {sub.subscription?.paymentMethod || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="p-4">
            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => toggleExpand(sub._id)}
            >
              {/* Icon */}
              <span
                className="text-2xl flex-shrink-0"
                role="img"
                aria-label={sub.subscription?.status || "none"}
              >
                {getStatusIcon(sub.subscription?.status)}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Gym Name and Status Row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-text-primary">
                    {sub.gym?.name || t("common.unknown", "Unknown Gym")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${getMembershipStatusStyle(
                      sub.membershipStatus
                    )}`}
                  >
                    {t(
                      `mySubscriptions.status.${sub.membershipStatus}`,
                      sub.membershipStatus
                    )}
                  </span>
                </div>

                {/* Location */}
                {sub.gym?.location?.city && (
                  <p className="text-sm text-text-secondary mb-2">
                    {sub.gym.location.city}
                  </p>
                )}

                {/* Dates and Expand */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-secondary">
                    <span>
                      {t("mySubscriptions.joined", "Joined")}:{" "}
                      {new Date(sub.joinedAt).toLocaleDateString()}
                    </span>
                    {sub.subscription?.endDate && (
                      <span className="ml-3">
                        {t("mySubscriptions.expires", "Expires")}:{" "}
                        {new Date(
                          sub.subscription.endDate
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(sub._id);
                    }}
                    className="p-1.5 hover:bg-primary/10 rounded-full text-primary transition-colors"
                  >
                    {expandedId === sub._id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Mobile Details */}
            {expandedId === sub._id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-secondary">
                      {t("mySubscriptions.details.startDate", "Start Date")}
                    </p>
                    <p className="text-sm text-text-primary font-medium">
                      {sub.subscription?.startDate
                        ? new Date(
                            sub.subscription.startDate
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">
                      {t(
                        "mySubscriptions.details.subscriptionStatus",
                        "Status"
                      )}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border inline-block ${getStatusStyle(
                        sub.subscription?.status
                      )}`}
                    >
                      {sub.subscription?.status || "—"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary italic">
                  {t(
                    "mySubscriptions.details.paymentsComingSoon",
                    "Payment history coming soon."
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsTable;

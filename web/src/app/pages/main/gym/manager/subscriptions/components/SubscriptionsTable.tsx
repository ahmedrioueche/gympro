import { type User } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";

interface SubscriptionsTableProps {
  members: User[];
}

function SubscriptionsTable({ members }: SubscriptionsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getSubscriptionStatus = (subscription: any) => {
    if (!subscription || !subscription.endDate) return "none";

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (subscription.status === "expired" || endDate < now) return "expired";
    if (daysRemaining <= 7 && daysRemaining > 0) return "expiring";
    return "active";
  };

  const getDaysRemaining = (endDate: string | Date) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-success/10 text-success border-success/20">
            {t("common.active", "Active")}
          </span>
        );
      case "expired":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-danger/10 text-danger border-danger/20">
            {t("common.expired", "Expired")}
          </span>
        );
      case "expiring":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-warning/10 text-warning border-warning/20">
            {t("common.expiringSoon", "Expiring Soon")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-muted text-text-secondary border-border">
            {t("gymSubscriptions.noSubscription", "No Subscription")}
          </span>
        );
    }
  };

  const handleRowClick = (member: User) => {
    // Navigate to member details
    navigate({
      to: `${APP_PAGES.gym.manager.member_profile.link}/${member._id}`,
    });
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.member", "Member")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.type", "Type")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.startDate", "Start Date")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.endDate", "End Date")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.remaining", "Remaining")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("gymSubscriptions.table.status", "Status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => {
              const membership = member.memberships?.[0];
              const subscription = membership?.subscription;
              const status = getSubscriptionStatus(subscription);
              const daysRemaining = subscription?.endDate
                ? getDaysRemaining(subscription.endDate)
                : null;

              return (
                <tr
                  key={member._id}
                  onClick={() => handleRowClick(member)}
                  className="transition-colors duration-200 hover:bg-muted/50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {member.profile?.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">
                          {member.profile?.fullName || "Unknown"}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {member.profile?.email || member.profile?.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-primary">
                      {subscription?.typeId || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">
                      {subscription?.startDate
                        ? new Date(subscription.startDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">
                      {subscription?.endDate
                        ? new Date(subscription.endDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {daysRemaining !== null ? (
                      <span
                        className={`text-sm font-medium ${
                          daysRemaining < 0
                            ? "text-danger"
                            : daysRemaining <= 7
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} days ago`
                          : `${daysRemaining} days`}
                      </span>
                    ) : (
                      <span className="text-sm text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible on Mobile Only */}
      <div className="md:hidden divide-y divide-border">
        {members.map((member) => {
          const membership = member.memberships?.[0];
          const subscription = membership?.subscription;
          const status = getSubscriptionStatus(subscription);
          const daysRemaining = subscription?.endDate
            ? getDaysRemaining(subscription.endDate)
            : null;

          return (
            <div
              key={member._id}
              onClick={() => handleRowClick(member)}
              className="p-4 transition-colors duration-200 active:bg-muted/50"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                  {member.profile?.fullName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary truncate">
                    {member.profile?.fullName || "Unknown"}
                  </div>
                  <div className="text-sm text-text-secondary truncate">
                    {member.profile?.email || member.profile?.phoneNumber}
                  </div>
                </div>
                {getStatusBadge(status)}
              </div>

              {/* Subscription Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <UserIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{subscription?.typeId || "No subscription"}</span>
                </div>
                {subscription?.startDate && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {new Date(subscription.startDate).toLocaleDateString()} -{" "}
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {daysRemaining !== null && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0 text-text-secondary" />
                    <span
                      className={`font-medium ${
                        daysRemaining < 0
                          ? "text-danger"
                          : daysRemaining <= 7
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {daysRemaining < 0
                        ? `Expired ${Math.abs(daysRemaining)} days ago`
                        : `${daysRemaining} days remaining`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubscriptionsTable;

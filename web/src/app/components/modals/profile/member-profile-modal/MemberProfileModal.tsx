import { CreditCard, History, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { MemberOverviewTab } from "./components/MemberOverviewTab";
import { MemberSubscriptionsTable } from "./components/MemberSubscriptionTable";
import { PaymentHistoryTab } from "./components/PaymentHistoryTab";
import { SubscriptionStatusCard } from "./components/SubscriptionStatusCard";
import { useMemberProfileModal } from "./hooks/useMemberProfileModal";

export default function MemberProfileModal() {
  const { t } = useTranslation();

  const {
    isOpen,
    isLoading,
    user,
    currentSubscription,
    subscriptionType,
    subscriptionHistory,
    payments,
    handleRenewSubscription,
    handleClose,
  } = useMemberProfileModal();

  if (!isOpen) return null;

  const tabs = [
    {
      id: "overview",
      label: t("common.attendance"),
      icon: Info,
      content: <MemberOverviewTab />,
    },
    {
      id: "subscriptions",
      label: t("sidebar.subscriptions"),
      icon: CreditCard,
      count: subscriptionHistory.length,
      content: <MemberSubscriptionsTable history={subscriptionHistory} />,
    },
    {
      id: "history",
      label: t("sidebar.payments"),
      icon: History,
      count: payments.length,
      content: <PaymentHistoryTab />,
    },
  ];

  const actions: ProfileModalAction[] = [];

  return (
    <CustomizableProfileTemplateModal
      isOpen={isOpen}
      onClose={handleClose}
      user={user}
      isLoading={isLoading}
      title={t("dashboard.member") + " " + t("profile.menu.profile.label")}
      heroRightContent={
        <SubscriptionStatusCard
          subscription={currentSubscription}
          subscriptionType={subscriptionType}
          onRenew={handleRenewSubscription}
        />
      }
      tabs={tabs}
      actions={actions}
    />
  );
}

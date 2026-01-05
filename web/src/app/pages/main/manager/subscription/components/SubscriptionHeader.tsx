import type { GetSubscriptionDto } from "@ahmedrioueche/gympro-client";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScreen from "../../../../../../hooks/useScreen";
import PageHeader from "../../../../../components/PageHeader";

interface Props {
  mySubscription?: GetSubscriptionDto;
}

function SubscriptionHeader({ mySubscription }: Props) {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  const isCancelled =
    mySubscription?.status === "cancelled" ||
    mySubscription?.status === "expired";

  const isFreePlan = mySubscription?.plan?.level === "free";

  const showButton = mySubscription && !isCancelled && !isMobile;

  const handleClick = () => {
    document
      .getElementById("plans-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const buttonLabel = isFreePlan
    ? t("subscription.upgrade_now")
    : t("subscription.see_plans");

  const ButtonIcon = isFreePlan ? ArrowUpRight : Layers;

  return (
    <PageHeader
      icon={Layers}
      title={t("subscription.title")}
      subtitle={t("subscription.subtitle")}
      actionButton={{
        label: buttonLabel,
        icon: ButtonIcon,
        onClick: handleClick,
        show: showButton,
      }}
    />
  );
}

export default SubscriptionHeader;

import type { GetSubscriptionDto } from "@ahmedrioueche/gympro-client";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  mySubscription?: GetSubscriptionDto;
}

function SubscriptionHeader({ mySubscription }: Props) {
  const { t } = useTranslation();

  const isCancelled =
    mySubscription?.status === "cancelled" ||
    mySubscription?.status === "expired";

  const isFreePlan = mySubscription?.plan?.level === "free";

  const showButton = mySubscription && !isCancelled;

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
    <div className="relative mb-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md flex-shrink-0">
            <Layers className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
              {t("subscriptions.title")}
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              {t("subscriptions.subtitle")}
            </p>
          </div>
        </div>

        {/* Right CTA */}
        {showButton && (
          <button
            onClick={handleClick}
            className="
              group mt-2 sm:mt-0 inline-flex items-center gap-2
              rounded-xl px-5 py-2.5 text-sm font-medium text-white
              bg-gradient-to-r from-primary to-secondary
              hover:from-primary/90 hover:to-secondary/90
              ring-1 ring-primary/30
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
          >
            {buttonLabel}
            <ButtonIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SubscriptionHeader;

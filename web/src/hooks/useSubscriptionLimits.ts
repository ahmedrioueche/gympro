import { useTranslation } from "react-i18next";
import { useMyGyms } from "./queries/useGyms";
import { useMySubscription } from "./queries/useSubscription";
import { useToast } from "./useToast";

export const useSubscriptionLimits = () => {
  const { t } = useTranslation();
  const { error } = useToast();
  const { data: mySubscription } = useMySubscription();
  const { data: gyms = [] } = useMyGyms();

  // Get limits directly from the subscription's plan
  const plan = mySubscription?.plan;
  const baseLimits = plan?.limits || { maxGyms: 1, maxMembers: 50 };

  const limits = {
    maxGyms: typeof baseLimits.maxGyms === "number" ? baseLimits.maxGyms : 1,
    maxMembers:
      typeof baseLimits.maxMembers === "number" ? baseLimits.maxMembers : 50,
  };

  const currentGymsCount = (gyms || []).length;
  // maxGyms === 0 means unlimited
  const isGymLimitReached =
    limits.maxGyms > 0 && currentGymsCount >= limits.maxGyms;

  const checkGymLimit = () => {
    if (isGymLimitReached) {
      error(
        t("billing.limits.gym_creation_limit_reached", {
          limit: limits.maxGyms,
        }),
      );
      return false;
    }
    return true;
  };

  return {
    limits,
    isGymLimitReached,
    currentGymsCount,
    checkGymLimit,
  };
};

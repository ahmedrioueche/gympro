import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/user";
import { calculateSubscriptionLimits } from "../utils/subscription";
import { useMyGyms } from "./queries/useGyms";
import { useToast } from "./useToast";

export const useSubscriptionLimits = () => {
  const { t } = useTranslation();
  const { error } = useToast();
  const { user } = useUserStore();
  const { data: gyms = [] } = useMyGyms();

  const limits = calculateSubscriptionLimits(user?.appSubscription);

  const currentGymsCount = (gyms || []).length;
  const isGymLimitReached = currentGymsCount >= limits.maxGyms;

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

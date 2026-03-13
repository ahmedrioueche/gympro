import { useEffect, useState } from "react";
import { useAccessToken } from "./queries/useAttendance";
import { useMyMembershipInGym } from "./queries/useMembership";

export const useAccessPage = (gymId?: string) => {
  const {
    data: tokenRes,
    isLoading: isTokenLoading,
    refetch,
    isRefetching,
  } = useAccessToken(gymId);

  const { data: membershipRes, isLoading: isMembershipLoading } =
    useMyMembershipInGym(gymId || "");

  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (tokenRes?.data?.expiresAt) {
      const update = () => {
        const remaining = Math.max(
          0,
          Math.floor((tokenRes.data.expiresAt - Date.now()) / 1000)
        );
        setTimeLeft(remaining);

        if (remaining === 0) {
          refetch();
        }
      };

      update();
      const interval = setInterval(update, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenRes?.data?.expiresAt, refetch]);

  return {
    token: tokenRes?.data?.token,
    membership: membershipRes?.data?.membership,
    timeLeft,
    isLoading: isTokenLoading || isMembershipLoading,
    isUpdating: isRefetching,
    refresh: () => {
      refetch();
    },
  };
};

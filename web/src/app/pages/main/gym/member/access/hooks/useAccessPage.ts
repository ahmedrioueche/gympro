import { useEffect, useState } from "react";
import { useAccessToken } from "../../../../../../../hooks/queries/useAttendance";

export const useAccessPage = (gymId?: string) => {
  const {
    data: tokenRes,
    isLoading,
    refetch,
    isRefetching,
  } = useAccessToken(gymId);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (tokenRes?.data?.expiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.floor((tokenRes.data.expiresAt - Date.now()) / 1000)
        );
        setTimeLeft(remaining);

        if (remaining === 0) {
          refetch();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenRes?.data?.expiresAt, refetch]);

  return {
    token: tokenRes?.data?.token,
    isLoading: isLoading || isRefetching,
    timeLeft,
    refresh: refetch,
  };
};

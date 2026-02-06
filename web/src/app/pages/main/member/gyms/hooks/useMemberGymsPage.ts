import { useState } from "react";
import { useAllMyGyms, useGyms } from "../../../../../../hooks/queries/useGyms";
import { useUserStore } from "../../../../../../store/user";

export type MemberGymsTab = "my_gyms" | "explore";

export function useMemberGymsPage() {
  const [activeTab, setActiveTab] = useState<MemberGymsTab>("my_gyms");
  const { user } = useUserStore();

  const { data: myGyms = [], isLoading: isMyGymsLoading } = useAllMyGyms();

  const { data: result } = useGyms({
    excludeUserId: user?._id,
  });

  const exploreCount = result?.total || 0;

  return {
    activeTab,
    setActiveTab,
    myGyms,
    exploreCount,
    isMyGymsLoading,
  };
}

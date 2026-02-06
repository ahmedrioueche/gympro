import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useCoachAffiliations } from "../../../../../../hooks/queries/useGymCoach";
import { useGyms } from "../../../../../../hooks/queries/useGyms";

export type CoachGymsTab = "affiliations" | "invitations" | "explore";

export function useCoachGymsPage() {
  const [activeTab, setActiveTab] = useState<CoachGymsTab>("affiliations");

  const { data: affiliations = [], isLoading: isAffiliationsLoading } =
    useCoachAffiliations();
  const { data: result } = useGyms();
  const allGyms = result?.data || [];

  // Active affiliations (coach is accepted at these gyms)
  const activeAffiliations = affiliations.filter(
    (a: GymCoachAffiliation) => a.status === "active",
  );

  // Pending invitations from gyms (gym initiated, coach hasn't responded)
  const pendingInvitations = affiliations.filter(
    (a: GymCoachAffiliation) =>
      a.status === "pending" && a.initiatedBy === "gym",
  );

  // Explore count (simplified for tab badge)
  const affiliatedGymIds = affiliations.map((a) => a.gymId);
  const exploreCount = allGyms.filter(
    (gym) => !affiliatedGymIds.includes(gym._id),
  ).length;

  return {
    activeTab,
    setActiveTab,
    activeAffiliations,
    pendingInvitations,
    exploreCount,
    isAffiliationsLoading,
    affiliations,
  };
}

import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useCoachAffiliations } from "../../../../../../hooks/queries/useGymCoach";
import { useGyms } from "../../../../../../hooks/queries/useGyms";

export type CoachGymsTab = "affiliations" | "invitations" | "explore";

export function useCoachGymsPage() {
  const [activeTab, setActiveTab] = useState<CoachGymsTab>("affiliations");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: affiliations = [], isLoading: isAffiliationsLoading } =
    useCoachAffiliations();
  const { data: allGyms = [], isLoading: isGymsLoading } = useGyms();

  // Active affiliations (coach is accepted at these gyms)
  const activeAffiliations = affiliations.filter(
    (a: GymCoachAffiliation) => a.status === "active"
  );

  // Pending invitations from gyms (gym initiated, coach hasn't responded)
  const pendingInvitations = affiliations.filter(
    (a: GymCoachAffiliation) =>
      a.status === "pending" && a.initiatedBy === "gym"
  );

  // Debug logging
  console.log("All affiliations:", affiliations);
  console.log("Pending invitations:", pendingInvitations);

  // Filter explore gyms by search and exclude already affiliated ones
  const affiliatedGymIds = affiliations.map((a) => a.gymId);
  const exploreGyms = allGyms.filter((gym) => {
    const matchesSearch =
      !searchTerm ||
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const notAffiliated = !affiliatedGymIds.includes(gym._id);
    return matchesSearch && notAffiliated;
  });

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    activeAffiliations,
    pendingInvitations,
    exploreGyms,
    isAffiliationsLoading,
    isGymsLoading,
  };
}

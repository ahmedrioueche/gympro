import type { User } from "@ahmedrioueche/gympro-client";

export interface MemberDisplay {
  _id: string;
  membershipId?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: string;
  joinDate: string;
  subscriptionType?: string;
}

/**
 * Transform User type to display-friendly format
 */
export const getMemberDisplay = (
  member: User,
  gymId?: string
): MemberDisplay => {
  const profile = member.profile;
  const gymMembership = gymId
    ? member.memberships?.find((m) => m.gym?._id === gymId)
    : member.memberships?.[0];

  const joinDate = gymMembership?.joinedAt || member.createdAt;

  return {
    _id: member._id,
    membershipId: gymMembership?._id,
    name: profile?.fullName || profile?.username || "Unknown",
    email: profile?.email || "",
    phone: profile?.phoneNumber || "",
    avatar: profile?.profileImageUrl,
    status: gymMembership?.membershipStatus || "pending",
    joinDate:
      typeof joinDate === "string" ? joinDate : joinDate?.toISOString?.() || "",
    subscriptionType: gymMembership?.subscription?.typeId,
  };
};

import type {
  CoachProfile,
  GymCoachAffiliation,
} from "@ahmedrioueche/gympro-client";
import NoData from "../../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../../store/modal";
import CoachCard from "../../../../../../components/cards/CoachCard";

interface CoachListProps {
  coaches: GymCoachAffiliation[];
  emptyEmoji: string;
  emptyTitle: string;
  emptyDescription: string;
  isActive?: boolean;
  isPending?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onRemove?: (id: string, coachName: string) => void;
}

export function CoachList({
  coaches,
  emptyEmoji,
  emptyTitle,
  emptyDescription,
  isActive,
  isPending,
  onAccept,
  onDecline,
  onRemove,
}: CoachListProps) {
  const { openModal } = useModalStore();

  if (coaches.length === 0) {
    return (
      <NoData
        emoji={emptyEmoji}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coaches.map((affiliation) => {
        const affiliationCoach = affiliation.coach || affiliation.coachId;
        const coachName =
          (affiliationCoach as any)?.fullName ||
          (affiliationCoach as any)?.username ||
          "Coach";

        // Map affiliation.coach to CoachProfile format
        const coachProfile: CoachProfile = {
          userId: (affiliationCoach as any)?._id || affiliation.coachId,
          fullName: (affiliationCoach as any)?.fullName || "Unknown Coach",
          username: (affiliationCoach as any)?.username || "unknown",
          profileImageUrl: (affiliationCoach as any)?.profileImageUrl,
          specializations: (affiliationCoach as any)?.specializations,
          location: {
            city: (affiliationCoach as any)?.city,
            state: (affiliationCoach as any)?.state,
            country: (affiliationCoach as any)?.country,
          },
          membershipId: (affiliation as any).membershipId,
        };

        const handleReview = () => {
          // Construct a mock User object from the affiliation data
          const mockUser = {
            _id: (affiliationCoach as any)?._id || affiliation.coachId,
            profile: {
              fullName: (affiliationCoach as any)?.fullName || "Unknown Coach",
              username: (affiliationCoach as any)?.username || "unknown",
              profileImageUrl: (affiliationCoach as any)?.profileImageUrl,
              specializations: (affiliationCoach as any)?.specializations,
              city: (affiliationCoach as any)?.city,
              state: (affiliationCoach as any)?.state,
              country: (affiliationCoach as any)?.country,
            },
            coachVerification:
              (affiliationCoach as any)?.coachVerification || {},
            createdAt: affiliation.createdAt,
          };

          openModal("admin_review_coach_request", {
            request: mockUser as any,
            affiliationId: affiliation._id,
            gymId: affiliation.gymId,
          });
        };

        return (
          <CoachCard
            key={affiliation._id}
            coach={coachProfile}
            onReview={
              isPending && affiliation.initiatedBy === "coach"
                ? handleReview
                : undefined
            }
            onAccept={
              isPending && onAccept
                ? () => onAccept(affiliation._id)
                : undefined
            }
            onDecline={
              isPending && onDecline
                ? () => onDecline(affiliation._id)
                : undefined
            }
            onRemove={
              isActive && onRemove
                ? () => onRemove(affiliation._id, coachName)
                : undefined
            }
            isActive={isActive}
            isPending={isPending}
          />
        );
      })}
    </div>
  );
}

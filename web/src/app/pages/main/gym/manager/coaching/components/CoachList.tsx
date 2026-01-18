import type {
  CoachProfile,
  GymCoachAffiliation,
} from "@ahmedrioueche/gympro-client";
import NoData from "../../../../../../../components/ui/NoData";
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
        const affiliationCoach = affiliation.coach;
        const coachName =
          affiliationCoach?.fullName || affiliationCoach?.username || "Coach";

        // Map affiliation.coach to CoachProfile format
        const coachProfile: CoachProfile = {
          userId: affiliationCoach?._id || affiliation.coachId,
          fullName: affiliationCoach?.fullName || "Unknown Coach",
          username: affiliationCoach?.username || "unknown",
          profileImageUrl: affiliationCoach?.profileImageUrl,
          specializations: affiliationCoach?.specializations,
        };

        return (
          <CoachCard
            key={affiliation._id}
            coach={coachProfile}
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

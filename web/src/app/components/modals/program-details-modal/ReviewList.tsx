import { type ProgramComment } from "@ahmedrioueche/gympro-client";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../../../components/ui/UserAvatar";
import { useModalStore } from "../../../../store/modal";

interface ReviewListProps {
  comments: ProgramComment[];
}

const ReviewList = ({ comments }: ReviewListProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const handleOpenCoachProfile = (coachId: string) => {
    openModal("coach_profile", { coachId });
  };

  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-text-secondary text-center py-6">
        {t("training.programs.details.reviews.noReviews")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, i) => (
        <div
          key={i}
          className="bg-background-secondary border border-border rounded-xl p-4 flex gap-3"
        >
          {/* Avatar */}
          <button
            onClick={() => handleOpenCoachProfile(comment.userId)}
            className="flex-shrink-0"
          >
            <UserAvatar
              avatar={comment.userImage}
              alt={comment.userName}
              className="w-10 h-10"
            />
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => handleOpenCoachProfile(comment.userId)}
                className="font-semibold text-sm text-text-primary hover:text-primary transition-colors"
              >
                {comment.userName}
              </button>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starI) => (
                  <Star
                    key={starI}
                    size={14}
                    className={
                      starI < comment.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-border"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-text-secondary">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

import { trainingApi, type ProgramComment } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../../store/user";

const AddReviewForm = ({
  programId,
  onOptimisticAdd,
}: {
  programId: string;
  onOptimisticAdd: (comment: ProgramComment) => void;
}) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: {
      rating: number;
      text: string;
      userName: string;
      userImage?: string;
    }) => trainingApi.addComment(programId, data),
    onMutate: async (newComment) => {
      // Optimistically add the comment
      const optimisticComment: ProgramComment = {
        userId: user?._id || "",
        userName: newComment.userName,
        userImage: newComment.userImage,
        text: newComment.text,
        rating: newComment.rating,
        createdAt: new Date(),
      };
      onOptimisticAdd(optimisticComment);
    },
    onSuccess: () => {
      setText("");
      setRating(0);
      toast.success(t("training.programs.details.reviews.success"));
      // Refetch to get the real data from server
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || t("common.error"));
      // Refetch to restore original state
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const userName = user?.profile.fullName || user?.profile.username || "User";
    const userImage = user?.profile?.profileImageUrl;
    mutation.mutate({ rating, text, userName, userImage });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t("training.programs.details.reviews.rating")}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-all hover:scale-110"
            >
              <Star
                size={22}
                className={
                  star <= rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-text-secondary hover:text-yellow-500"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t("training.programs.details.reviews.comment")}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("training.programs.details.reviews.placeholder")}
          className="w-full bg-background border border-border rounded-lg p-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-colors"
          rows={3}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={rating === 0 || mutation.isPending}
          className="px-4 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending
            ? t("common.processing")
            : t("training.programs.details.reviews.submit")}
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;

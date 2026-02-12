import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useBookClass,
  useCancelBooking,
  useGymClasses,
} from "../../../../../../../hooks/queries/useGymClasses";
import { useGymStore } from "../../../../../../../store/gym";
import { useUserStore } from "../../../../../../../store/user";
import { getMessage } from "../../../../../../../utils/statusMessage";

export function useMemberClasses() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();
  const gymId = currentGym?._id;

  const { data: classesResponse, isLoading } = useGymClasses(gymId);
  const bookMutation = useBookClass(gymId);
  const cancelMutation = useCancelBooking(gymId);

  const handleBook = async (classId: string) => {
    try {
      if (!user?._id) return;
      // Fixed: userId is not a property of CreateClassBookingDto, it is handled by the backend
      const res = await bookMutation.mutateAsync({ classId });
      const msg = getMessage(res, t);
      if (res.success) {
        toast.success(msg.message);
      } else {
        toast.error(msg.message);
      }
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    }
  };

  const handleCancel = async (classId: string) => {
    try {
      const res = await cancelMutation.mutateAsync(classId);
      const msg = getMessage(res, t);
      if (res.success) {
        toast.success(msg.message);
      } else {
        toast.error(msg.message);
      }
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    }
  };

  const now = new Date();
  const groupedClasses = (classesResponse?.data || []).reduce(
    (acc: any[], curr: any) => {
      if (!curr.seriesId) {
        acc.push(curr);
      } else {
        const existingIndex = acc.findIndex(
          (c) => c.seriesId === curr.seriesId,
        );
        if (existingIndex === -1) {
          acc.push(curr);
        } else {
          const existing = acc[existingIndex];
          const existingDate = new Date(existing.scheduledAt);
          const currDate = new Date(curr.scheduledAt);

          // If current is upcoming and (existing is past OR current is sooner than existing)
          if (currDate >= now) {
            if (existingDate < now || currDate < existingDate) {
              acc[existingIndex] = curr;
            }
          }
        }
      }
      return acc;
    },
    [],
  );

  const hasClasses = groupedClasses.length > 0;

  return {
    classes: groupedClasses,
    allClasses: classesResponse?.data || [],
    isLoading,
    isProcessing: bookMutation.isPending || cancelMutation.isPending,
    hasClasses,
    user,
    handleBook,
    handleCancel,
  };
}

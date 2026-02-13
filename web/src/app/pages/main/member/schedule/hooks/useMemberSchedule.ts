import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { isSameDay, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useCancelBooking,
  useMemberBookedClasses,
} from "../../../../../../hooks/queries/useGymClasses";
import { useCoachSessions } from "../../../../../../hooks/queries/useSessions";
import { useActiveProgram } from "../../../../../../hooks/queries/useTraining";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import { getMessage } from "../../../../../../utils/statusMessage";
import { useSchedule } from "../../../coach/schedule/hooks/useSchedule";

export function useMemberSchedule() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { currentGym } = useGymStore();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const scheduleUtils = useSchedule();

  // Fetch Member's Booked Classes
  const { data: classesData, isLoading: isLoadingClasses } =
    useMemberBookedClasses();

  const cancelMutation = useCancelBooking(currentGym?._id);

  // Fetch Member's Private Sessions (reusing useCoachSessions as it's role-aware)
  const { data: sessionsData, isLoading: isLoadingSessions } =
    useCoachSessions();

  // Fetch Active Training Program
  const { data: activeProgram, isLoading: isLoadingProgram } =
    useActiveProgram();

  const sessions = sessionsData?.data || [];
  const memberClasses = classesData?.data || [];

  const handleSessionClick = (session: Session) => {
    openModal("session_details", { session });
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

  const handleClassClick = (gymClass: GymClass) => {
    // Check if the class is in the member's booked classes list
    const isActuallyBooked = memberClasses.some((c) => c._id === gymClass._id);

    openModal("class_details", {
      gymClass,
      onCancel: isActuallyBooked ? handleCancel : undefined,
      isBooking: cancelMutation.isPending,
    });
  };

  const isLoading = isLoadingClasses || isLoadingSessions || isLoadingProgram;

  // Group items by date for list view
  const groupedItems = useMemo(() => {
    if (view !== "list") return [];

    const items: { date: Date; type: "class" | "session"; data: any }[] = [];

    memberClasses.forEach((c) => {
      items.push({ date: new Date(c.scheduledAt), type: "class", data: c });
    });

    sessions.forEach((s) => {
      items.push({ date: new Date(s.startTime), type: "session", data: s });
    });

    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group by unique date
    const groups: { date: Date; items: typeof items }[] = [];
    items.forEach((item) => {
      const existingGroup = groups.find((g) => isSameDay(g.date, item.date));
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ date: startOfDay(item.date), items: [item] });
      }
    });

    return groups;
  }, [memberClasses, sessions, view]);

  return {
    t,
    view,
    setView,
    scheduleUtils,
    sessions,
    memberClasses,
    activeProgram,
    isLoading,
    groupedItems,
    handleSessionClick,
    handleClassClick,
  };
}

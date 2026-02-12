import { type GymClass } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import {
  useDeleteClass,
  useGymClasses,
} from "../../../../../../../hooks/queries/useGymClasses";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";

export const useManagerClasses = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  const {
    data: classesResponse,
    isLoading,
    error,
    refetch,
  } = useGymClasses(gymId);

  const { mutateAsync: deleteClass } = useDeleteClass(gymId);

  const handleCreate = () => {
    if (!gymId) return;
    openModal("gym_class", { gymId, onSuccess: refetch });
  };

  const handleEdit = (gymClass: GymClass) => {
    if (!gymId) return;
    openModal("gym_class", { gymId, gymClass, onSuccess: refetch });
  };

  const handleDelete = (gymClass: GymClass) => {
    if (!gymId) return;

    if (gymClass.seriesId) {
      openModal("confirm", {
        title: t("classes.delete.title", "Delete Class"),
        text: t(
          "classes.delete.message",
          "This is a recurring class. Would you like to cancel only this specific session or the entire series?",
        ),
        onConfirm: async () => {
          await deleteClass({ id: gymClass._id, deleteSeries: false });
        },
        confirmVariant: "danger",
        confirmText: t("classes.delete.confirmOne", "Cancel only this session"),
        secondaryAction: {
          label: t("classes.delete.confirmSeries", "Cancel entire series"),
          onClick: async () => {
            await deleteClass({ id: gymClass._id, deleteSeries: true });
          },
        },
      });
    } else {
      openModal("confirm", {
        title: t("classes.delete.title", "Delete Class"),
        text: t(
          "classes.confirmDeleteDesc",
          "Are you sure you want to delete this class? This action cannot be undone.",
        ),
        onConfirm: async () => {
          await deleteClass({ id: gymClass._id });
        },
        confirmVariant: "danger",
        confirmText: t("common.delete", "Delete"),
      });
    }
  };

  // Group classes by seriesId to avoid duplication in the management list
  const now = new Date();
  const groupedClasses = (classesResponse?.data || []).reduce(
    (acc: GymClass[], curr: GymClass) => {
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

          // If existing is in the past and current is upcoming, prefer current
          if (existingDate < now && currDate >= now) {
            acc[existingIndex] = curr;
          }
          // Otherwise keep the one closest to 'now' if both are upcoming,
          // or just keep the first one if both are past
          else if (
            existingDate >= now &&
            currDate >= now &&
            currDate < existingDate
          ) {
            acc[existingIndex] = curr;
          }
        }
      }
      return acc;
    },
    [],
  );

  return {
    classes: groupedClasses,
    allClasses: classesResponse?.data || [],
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};

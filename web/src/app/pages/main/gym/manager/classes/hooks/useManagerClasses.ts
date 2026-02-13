import { type GymClass } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import {
  useDeleteClass,
  useGymClasses,
  useRestoreClass,
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
  const { mutateAsync: restoreClass } = useRestoreClass(gymId);

  const handleCreate = () => {
    if (!gymId) return;
    openModal("gym_class", { gymId, onSuccess: refetch });
  };

  const handleEdit = (gymClass: GymClass) => {
    if (!gymId) return;
    openModal("gym_class", { gymId, gymClass, onSuccess: refetch });
  };

  const handleRestore = (gymClass: GymClass) => {
    if (!gymId) return;

    // Only show series restore if the underlying series template is actually cancelled
    const seriesTemplate = (classesResponse?.data || []).find(
      (c) => c.seriesId === gymClass.seriesId && c.isSeries === true,
    );
    const isSeriesCancelled = seriesTemplate?.status === "cancelled";
    const hasMultipleRestoreOptions = isSeriesCancelled;

    openModal("confirm", {
      title: t("classes.restore.title", "Restore Class"),
      text: t("classes.restore.message", "Restore cancelled class?"),
      onConfirm: async () => {
        await restoreClass({ id: gymClass._id, restoreSeries: false });
      },
      confirmVariant: "success",
      confirmText: hasMultipleRestoreOptions
        ? t("classes.restore.confirmOne", "Restore this session only")
        : t("classes.restore.confirm", "Confirm"),
      secondaryAction: hasMultipleRestoreOptions
        ? {
            label: t("classes.restore.confirmSeries", "Restore entire series"),
            variant: "success",
            onClick: async () => {
              await restoreClass({ id: gymClass._id, restoreSeries: true });
            },
          }
        : undefined,
    });
  };

  const handleHardDelete = (gymClass: GymClass) => {
    if (!gymId) return;

    openModal("confirm", {
      title: t("classes.hardDelete.title", "Permanently Delete"),
      text: t(
        "classes.hardDelete.message",
        "This will permanently delete the class and all its booking history. This action cannot be undone.",
      ),
      verificationText: gymClass.name,
      onConfirm: async () => {
        await deleteClass({
          id: gymClass._id,
          deleteSeries: true,
          hardDelete: true,
        });
      },
      confirmVariant: "danger",
      confirmText: t("common.deletePermanently", "Delete Permanently"),
    });
  };

  const handleDelete = (gymClass: GymClass) => {
    if (!gymId) return;

    if (gymClass.status === "cancelled") {
      handleHardDelete(gymClass);
      return;
    }

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
          variant: "danger",
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
          // Priority: Active > Template > Instance
          const existing = acc[existingIndex];
          const getScore = (item: GymClass) => {
            let score = 0;
            if (item.status !== "cancelled") score += 10;
            if (item.isSeries) score += 5;
            return score;
          };

          if (getScore(curr) > getScore(existing)) {
            acc[existingIndex] = curr;
          }
        }
      }
      return acc;
    },
    [] as GymClass[],
  );

  return {
    classes: groupedClasses,
    allClasses: classesResponse?.data || [],
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleRestore,
    handleHardDelete,
  };
};

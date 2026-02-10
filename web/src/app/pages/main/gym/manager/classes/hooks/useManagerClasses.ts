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

  const handleDelete = (id: string) => {
    openModal("confirm", {
      title: t("classes.deleteTitle", "Delete Class"),
      text: t(
        "classes.confirmDeleteDesc",
        "Are you sure you want to delete this class? This action cannot be undone.",
      ),
      onConfirm: async () => {
        await deleteClass(id);
      },
      confirmVariant: "danger",
      confirmText: t("common.delete", "Delete"),
    });
  };

  return {
    classes: classesResponse?.data || [],
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};

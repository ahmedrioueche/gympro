import { type GymService } from "@ahmedrioueche/gympro-client";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUpdateGymSettings } from "../../../../../../../hooks/queries/useGyms";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";

export function useGymServices() {
  const { t } = useTranslation();
  const { currentGym, setGym } = useGymStore();
  const { openModal } = useModalStore();
  const updateSettings = useUpdateGymSettings();

  const services = (currentGym?.settings?.servicesOffered || []) as (
    | GymService
    | string
  )[];

  // Helper to normalize services (handle legacy strings)
  const normalizedServices: GymService[] = services.map((s, index) => {
    if (typeof s === "string") {
      return {
        _id: `legacy-${index}`,
        name: s,
        createdAt: new Date().toISOString(),
      };
    }
    return s;
  });

  const handleAddService = () => {
    openModal("service", { mode: "create" });
  };

  const handleEditService = (service: GymService) => {
    openModal("service", { mode: "edit", service });
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!currentGym) return;

    // Optimistic update
    const newServices = normalizedServices.filter((s) => s._id !== serviceId);
    const previousGym = { ...currentGym };

    // Update store immediately
    setGym({
      ...currentGym,
      settings: {
        ...currentGym.settings,
        servicesOffered: newServices,
      } as any,
    });

    try {
      const result = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: { servicesOffered: newServices },
      });

      if (!result.success) {
        throw new Error("Failed to delete service");
      }
      toast.success(
        t("services.deleteSuccess", "Service deleted successfully"),
      );
    } catch (error) {
      // Revert
      setGym(previousGym);
      toast.error(t("services.deleteError", "Failed to delete service"));
    }
  };

  const saveService = async (
    data: { name: string; description?: string },
    existingService?: GymService,
  ) => {
    if (!currentGym) return;

    let newServices = [...normalizedServices];

    if (existingService) {
      // Edit mode
      newServices = newServices.map((s) =>
        s._id === existingService._id
          ? { ...s, ...data, updatedAt: new Date().toISOString() }
          : s,
      );
    } else {
      // Create mode
      const newServiceObj: GymService = {
        _id: Math.random().toString(36).substring(7), // Temporary ID
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
      };

      if (newServices.some((s) => s.name === data.name)) {
        toast.error(t("services.duplicateError", "Service already exists"));
        return;
      }
      newServices.push(newServiceObj);
    }

    try {
      const result = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: { servicesOffered: newServices },
      });

      if (result.success && result.data) {
        setGym(result.data);
        toast.success(
          existingService
            ? t("services.updateSuccess", "Service updated successfully")
            : t("services.createSuccess", "Service created successfully"),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error(t("services.saveError", "Failed to save service"));
      return false;
    }
  };

  return {
    services: normalizedServices,
    handleAddService,
    handleEditService,
    handleDeleteService,
    saveService,
    isUpdating: updateSettings.isPending,
  };
}

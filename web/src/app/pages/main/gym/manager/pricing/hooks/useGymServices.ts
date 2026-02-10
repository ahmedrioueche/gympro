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

  const services = currentGym?.settings?.servicesOffered || [];

  const handleAddService = () => {
    openModal("service", { mode: "create" });
  };

  const handleEditService = (service: string) => {
    openModal("service", { mode: "edit", service });
  };

  const handleDeleteService = async (service: string) => {
    if (!currentGym) return;

    // Optimistic update
    const newServices = services.filter((s) => s !== service);
    const previousGym = { ...currentGym };

    // Update store immediately
    setGym({
      ...currentGym,
      settings: {
        ...currentGym.settings,
        servicesOffered: newServices,
        // Ensure other required props match GymSettings interface if needed,
        // but Typescript might be lenient with spread.
        // Best to just spread settings.
        paymentMethods: currentGym.settings?.paymentMethods || [],
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

  const saveService = async (newService: string, oldService?: string) => {
    if (!currentGym) return;

    let newServices = [...services];

    if (oldService) {
      // Edit mode: replace old with new
      newServices = newServices.map((s) => (s === oldService ? newService : s));
    } else {
      // Create mode: append
      if (newServices.includes(newService)) {
        toast.error(t("services.duplicateError", "Service already exists"));
        return;
      }
      newServices.push(newService);
    }

    try {
      const result = await updateSettings.mutateAsync({
        id: currentGym._id,
        data: { servicesOffered: newServices },
      });

      if (result.success && result.data) {
        // Update local store with fresh data from backend
        setGym(result.data);

        toast.success(
          oldService
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
    services,
    handleAddService,
    handleEditService,
    handleDeleteService,
    saveService,
    isUpdating: updateSettings.isPending,
  };
}

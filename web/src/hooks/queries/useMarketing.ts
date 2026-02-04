import { gymApi, type GymMedia } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../store/gym";
import { useToast } from "../useToast";
import { gymKeys } from "./useGyms";

/**
 * Hook for managing gym marketing media
 */
export const useMarketing = (gymId: string) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { t } = useTranslation();
  const { setGym } = useGymStore();

  /**
   * Add a new media item to the gym
   */
  const addMedia = useMutation({
    mutationFn: async (media: GymMedia) => {
      const response = await gymApi.addMedia(gymId, media);
      return response.data;
    },
    onSuccess: (updatedGym) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(gymId) });
      if (updatedGym) setGym(updatedGym);
      success(t("marketing.form.successAdd"));
    },
    onError: () => {
      error(t("marketing.form.uploadError"));
    },
  });

  /**
   * Remove a media item from the gym
   */
  const removeMedia = useMutation({
    mutationFn: async (publicId: string) => {
      const response = await gymApi.removeMedia(gymId, publicId);
      return response.data;
    },
    onSuccess: (updatedGym) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(gymId) });
      if (updatedGym) setGym(updatedGym);
      success(t("marketing.form.successDelete"));
    },
    onError: () => {
      error(t("marketing.form.deleteError"));
    },
  });

  /**
   * Set a media item as the gym banner
   */
  const setBanner = useMutation({
    mutationFn: async (banner: { url: string; publicId: string }) => {
      const response = await gymApi.setBanner(gymId, banner);
      return response.data;
    },
    onSuccess: (updatedGym) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(gymId) });
      if (updatedGym) setGym(updatedGym);
      success(t("marketing.form.successBanner"));
    },
    onError: () => {
      error(t("marketing.form.bannerError"));
    },
  });

  return {
    addMedia,
    removeMedia,
    setBanner,
  };
};

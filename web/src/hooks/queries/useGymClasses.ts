import {
  gymClassApi,
  type CreateClassBookingDto,
  type CreateGymClassDto,
  type UpdateGymClassDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGymClasses = (gymId?: string) => {
  return useQuery({
    queryKey: ["gym-classes", gymId],
    queryFn: async () => {
      if (!gymId) return null;
      const response = await gymClassApi.getGymClasses(gymId);
      return response;
    },
    enabled: !!gymId,
  });
};

export const useCoachClasses = () => {
  return useQuery({
    queryKey: ["coach-classes"],
    queryFn: async () => {
      const response = await gymClassApi.getCoachClasses();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch coach classes");
      }
      return response;
    },
  });
};

export const useCreateClass = (gymId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGymClassDto) => {
      if (!gymId) throw new Error("Gym ID is required");
      const response = await gymClassApi.createClass(gymId, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-classes", gymId] });
      queryClient.invalidateQueries({ queryKey: ["coach-classes"] });
    },
  });
};

export const useUpdateClass = (gymId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      updateSeries = false,
    }: {
      id: string;
      data: UpdateGymClassDto;
      updateSeries?: boolean;
    }) => {
      const response = await gymClassApi.updateClass(id, data, updateSeries);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-classes", gymId] });
      queryClient.invalidateQueries({ queryKey: ["coach-classes"] });
    },
  });
};

export const useDeleteClass = (gymId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      deleteSeries = false,
    }: {
      id: string;
      deleteSeries?: boolean;
    }) => {
      const response = await gymClassApi.deleteClass(id, deleteSeries);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-classes", gymId] });
      queryClient.invalidateQueries({ queryKey: ["coach-classes"] });
    },
  });
};

export const useBookClass = (gymId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassBookingDto) => {
      const response = await gymClassApi.bookClass(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-classes", gymId] });
      queryClient.invalidateQueries({ queryKey: ["coach-classes"] });
    },
  });
};

export const useCancelBooking = (gymId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await gymClassApi.cancelBooking(classId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-classes", gymId] });
      queryClient.invalidateQueries({ queryKey: ["coach-classes"] });
    },
  });
};

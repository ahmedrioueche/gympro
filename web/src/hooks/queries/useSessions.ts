import {
  sessionApi,
  type CreateSessionDto,
  type SessionQueryDto,
  type UpdateSessionDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCoachSessions = (query?: SessionQueryDto) => {
  return useQuery({
    queryKey: ["sessions", query],
    queryFn: async () => {
      const response = await sessionApi.getAll(query);
      // response.data is ApiResponse<Session[]>, so we need response.data.data
      return response.data as any; // The actual data is in response.data which is ApiResponse
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionDto) => {
      const response = await sessionApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSessionDto;
    }) => {
      const response = await sessionApi.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sessionApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

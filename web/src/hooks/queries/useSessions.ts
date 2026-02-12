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
      return response; // Now returns ApiResponse<Session[]>
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionDto) => {
      const response = await sessionApi.create(data);
      return response;
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
      updateSeries,
    }: {
      id: string;
      data: UpdateSessionDto;
      updateSeries?: boolean;
    }) => {
      const response = await sessionApi.update(id, data, updateSeries);
      return response;
    },
    onMutate: async ({ id, data, updateSeries }) => {
      if (updateSeries) return; // Don't do optimistic update for series

      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previousSessions = queryClient.getQueriesData({
        queryKey: ["sessions"],
      });

      queryClient.setQueriesData({ queryKey: ["sessions"] }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((session: any) =>
            session._id === id ? { ...session, ...data } : session,
          ),
        };
      });

      return { previousSessions };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSessions) {
        context.previousSessions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      deleteSeries,
    }: {
      id: string;
      deleteSeries?: boolean;
    }) => {
      const response = await sessionApi.delete(id, deleteSeries);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

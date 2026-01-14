import {
  usersApi,
  type EditUserDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditUserDto) => {
      const result = await usersApi.editUser(userId, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }
      return result.data as User;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

import { type EditUserDto, usersApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/user";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser, user } = useUserStore();

  return useMutation({
    mutationFn: async (data: EditUserDto) => {
      if (!user?._id) throw new Error("User not found");
      const result = await usersApi.editUser(user._id, data);
      return result.data!;
    },
    onSuccess: (updatedUser) => {
      // Update local store
      updateUser(updatedUser);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

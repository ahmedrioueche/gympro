import { authApi, type IChangePasswordDto } from "@ahmedrioueche/gympro-client";
import { useMutation } from "@tanstack/react-query";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: IChangePasswordDto) => {
      const result = await authApi.changePassword(data);
      return result;
    },
  });
}

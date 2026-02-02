import { adminApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminEditors"],
    queryFn: async () => {
      const res = await adminApi.getEditors();
      // res is ApiResponse<AppEditorUser[]>, so res.data is the array
      // If res is an array (legacy), return res itself
      return Array.isArray(res) ? res : res.data || [];
    },
  });

  const editors = data || [];

  const filteredStaff = useMemo(() => {
    return editors.filter((editor) => {
      const matchesSearch =
        editor.profile.username.toLowerCase().includes(search.toLowerCase()) ||
        editor.profile.email?.toLowerCase().includes(search.toLowerCase()) ||
        editor.profile.fullName?.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [editors, search]);

  const removeEditorMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteEditor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEditors"] });
      toast.success(
        t("admin.staff.remove_success", "Editor removed successfully"),
      );
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error_occurred"));
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      adminApi.updateEditorPermissions(id, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEditors"] });
      toast.success(
        t("admin.staff.permissions_update_success", "Permissions updated"),
      );
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error_occurred"));
    },
  });

  return {
    staff: filteredStaff,
    isLoading,
    error,
    search,
    setSearch,
    removeEditor: removeEditorMutation.mutate,
    isRemoving: removeEditorMutation.isPending,
    updatePermissions: updatePermissionsMutation.mutate,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
  };
};

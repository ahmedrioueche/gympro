import { adminApi, ALL_APP_PERMISSIONS } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import { useModalStore } from "../../../../../store/modal";

export const AdminManagePermissionsModal = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentModal, adminManagePermissionsProps, closeModal } =
    useModalStore();
  const editor = adminManagePermissionsProps?.editor;

  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    if (editor) {
      setPermissions(editor.appPermissions || []);
    }
  }, [editor]);

  const { mutate: updatePermissions, isPending } = useMutation({
    mutationFn: (perms: string[]) =>
      adminApi.updateEditorPermissions(editor!._id, perms),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEditors"] });
      toast.success(t("admin.staff.permissions_update_success"));
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error_occurred"));
    },
  });

  const togglePermission = (perm: any) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleSave = () => {
    updatePermissions(permissions);
  };

  return (
    <BaseModal
      isOpen={currentModal === "admin_manage_permissions"}
      onClose={closeModal}
      title={t("admin.staff.modals.permissions_title")}
      subtitle={t("admin.staff.modals.permissions_subtitle", {
        name: editor?.profile?.fullName || editor?.profile?.username,
      })}
      icon={Key}
      primaryButton={{
        label: t("common.save"),
        onClick: handleSave,
        loading: isPending,
      }}
      maxWidth="max-w-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_APP_PERMISSIONS.map((perm) => (
          <button
            key={perm}
            type="button"
            onClick={() => togglePermission(perm)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all text-sm ${
              permissions.includes(perm)
                ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                : "bg-background border-border text-text-secondary hover:border-text-secondary/30"
            }`}
          >
            {t(`admin.staff.available_permissions.${perm}`)}
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                permissions.includes(perm)
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}
            >
              {permissions.includes(perm) && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        ))}
      </div>
    </BaseModal>
  );
};

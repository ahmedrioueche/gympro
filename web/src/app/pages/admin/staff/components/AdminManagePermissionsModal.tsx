import { adminApi, ALL_APP_PERMISSIONS } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Key, Lock, Mail, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import InputField from "../../../../../components/ui/InputField";
import { useModalStore } from "../../../../../store/modal";

export const AdminManagePermissionsModal = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentModal, adminManagePermissionsProps, closeModal } =
    useModalStore();
  const editor = adminManagePermissionsProps?.editor;

  const [permissions, setPermissions] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (editor) {
      setPermissions(editor.appPermissions || []);
      setFullName(editor.profile?.fullName || "");
      setUsername(editor.profile?.username || "");
      setEmail(editor.profile?.email || "");
      setPassword(""); // Clear password field on load
    }
  }, [editor]);

  const { mutate: updateEditor, isPending } = useMutation({
    mutationFn: () => {
      const payload: any = {
        appPermissions: permissions,
        fullName,
        username,
        email,
      };
      if (password) {
        payload.password = password;
      }
      return adminApi.updateEditor(editor!._id, payload);
    },
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
    updateEditor();
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
        icon: Save,
      }}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary">
            {t("settings.admin.profile.personalInfo")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label={t("settings.admin.profile.fullName")}
              leftIcon={<User className="w-5 h-5" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("settings.admin.profile.fullNamePlaceholder")}
            />
            <InputField
              label={t("auth.fields.username")}
              leftIcon={<User className="w-5 h-5" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="editor123"
            />
            <InputField
              label={t("settings.admin.profile.email")}
              leftIcon={<Mail className="w-5 h-5" />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@gympro.com"
            />
            <InputField
              label={t("settings.admin.profile.newPassword")}
              leftIcon={<Lock className="w-5 h-5" />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("settings.admin.profile.passwordPlaceholder")}
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Permissions Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary">
            {t("admin.staff.modals.permissions_title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2">
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
        </div>
      </div>
    </BaseModal>
  );
};

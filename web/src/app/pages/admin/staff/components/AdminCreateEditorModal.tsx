import {
  adminApi,
  ALL_APP_PERMISSIONS,
  type CreateEditorDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import InputField from "../../../../../components/ui/InputField";
import { useModalStore } from "../../../../../store/modal";
import { useModalLayer } from "../../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../../store/user";

export const AdminCreateEditorModal = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { isOpen, zIndex } = useModalLayer("admin_create_editor");

  const [form, setForm] = useState<CreateEditorDto>({
    username: "",
    email: "",
    fullName: "",
    password: "",
    appPermissions: [],
  });

  const { mutate: createEditor, isPending } = useMutation({
    mutationFn: (data: CreateEditorDto) => adminApi.createEditor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEditors"] });
      toast.success(t("common.create_success"));
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || t("common.error_occurred"));
    },
  });

  const { user } = useUserStore();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (user?.profile) {
      const isSameEmail =
        form.email &&
        form.email.toLowerCase() === user.profile.email?.toLowerCase();
      const isSameUsername =
        form.username &&
        form.username.toLowerCase() === user.profile.username?.toLowerCase();

      if (isSameEmail || isSameUsername) {
        toast.error(
          t(
            "staff.validation.selfAdditionBlocked",
            "You cannot add yourself as staff",
          ),
        );
        return;
      }
    }

    createEditor(form);
  };

  const togglePermission = (perm: any) => {
    setForm((prev) => ({
      ...prev,
      appPermissions: prev.appPermissions?.includes(perm)
        ? prev.appPermissions.filter((p) => p !== perm)
        : [...(prev.appPermissions || []), perm],
    }));
  };

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={t("admin.staff.modals.create_title")}
      icon={Shield}
      primaryButton={{
        label: t("common.add"),
        onClick: handleSubmit,
        loading: isPending,
        form: "create-editor-form",
        icon: UserPlus,
      }}
      maxWidth="max-w-2xl"
    >
      <form
        id="create-editor-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("admin.staff.modals.fields.full_name")}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            placeholder="John Doe"
          />
          <InputField
            label={t("admin.staff.modals.fields.username")}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            placeholder="johndoe"
          />
          <InputField
            label={t("admin.staff.modals.fields.email")}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="john@example.com"
          />
          <InputField
            label={t("admin.staff.modals.fields.password")}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-text-secondary">
            {t("admin.staff.table.permissions")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_APP_PERMISSIONS.map((perm) => (
              <button
                key={perm}
                type="button"
                onClick={() => togglePermission(perm)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm ${
                  form.appPermissions?.includes(perm)
                    ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                    : "bg-background border-border text-text-secondary hover:border-text-secondary/30"
                }`}
              >
                {t(`admin.staff.available_permissions.${perm}`)}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    form.appPermissions?.includes(perm)
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {form.appPermissions?.includes(perm) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

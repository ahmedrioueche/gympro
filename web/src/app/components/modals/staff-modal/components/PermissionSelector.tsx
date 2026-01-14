import {
  DEFAULT_ROLE_PERMISSIONS,
  PERMISSION_GROUPS,
  type GymPermission,
} from "@ahmedrioueche/gympro-client";
import { Check, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PermissionSelectorProps {
  selectedPermissions: GymPermission[];
  onChange: (permissions: GymPermission[]) => void;
  role?: string;
}

export default function PermissionSelector({
  selectedPermissions,
  onChange,
  role,
}: PermissionSelectorProps) {
  const { t } = useTranslation();

  // Safety check - ensure selectedPermissions is always an array
  const permissions = selectedPermissions || [];

  const togglePermission = (permission: GymPermission) => {
    if (permissions.includes(permission)) {
      onChange(permissions.filter((p) => p !== permission));
    } else {
      onChange([...permissions, permission]);
    }
  };

  const toggleGroup = (groupKey: string) => {
    const group = PERMISSION_GROUPS.find((g) => g.key === groupKey);
    if (!group) return;

    const groupPermissions = group.permissions.map((p) => p.key);
    const allSelected = groupPermissions.every((p) => permissions.includes(p));

    if (allSelected) {
      // Remove all permissions from this group
      onChange(permissions.filter((p) => !groupPermissions.includes(p)));
    } else {
      // Add all permissions from this group
      const newPermissions = new Set([...permissions, ...groupPermissions]);
      onChange(Array.from(newPermissions));
    }
  };

  const applyDefaults = () => {
    if (role && DEFAULT_ROLE_PERMISSIONS[role]) {
      onChange([...DEFAULT_ROLE_PERMISSIONS[role]]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-primary">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold">
            {t("staff.permissions.title", "Permissions")}
          </span>
        </div>
        {role && (
          <button
            type="button"
            onClick={applyDefaults}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
          >
            {t("staff.permissions.applyDefaults", "Apply Defaults")}
          </button>
        )}
      </div>

      <p className="text-sm text-text-secondary">
        {t(
          "staff.permissions.description",
          "Select what this staff member can access and manage."
        )}
      </p>

      {/* Permission Groups */}
      <div className="space-y-4">
        {PERMISSION_GROUPS.map((group) => {
          const groupPermissions = group.permissions.map((p) => p.key);
          const selectedCount = groupPermissions.filter((p) =>
            permissions.includes(p)
          ).length;
          const allSelected = selectedCount === groupPermissions.length;
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div
              key={group.key}
              className="border border-border rounded-xl overflow-hidden bg-surface"
            >
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      allSelected
                        ? "bg-primary border-primary"
                        : someSelected
                        ? "bg-primary/30 border-primary"
                        : "border-border"
                    }`}
                  >
                    {(allSelected || someSelected) && (
                      <Check
                        className={`w-3 h-3 ${
                          allSelected ? "text-white" : "text-primary"
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-text-primary">
                      {t(`staff.permissions.groups.${group.key}`, group.label)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {selectedCount}/{groupPermissions.length}{" "}
                      {t("staff.permissions.selected", "selected")}
                    </p>
                  </div>
                </div>
              </button>

              {/* Individual Permissions */}
              <div className="px-3 pb-3 flex flex-wrap gap-2">
                {group.permissions.map((permission) => {
                  const isSelected = permissions.includes(permission.key);
                  return (
                    <button
                      key={permission.key}
                      type="button"
                      onClick={() => togglePermission(permission.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white shadow-sm shadow-primary/30"
                          : "bg-background border border-border text-text-secondary hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>
                        {t(
                          `staff.permissions.items.${permission.key.replace(
                            ":",
                            "_"
                          )}`,
                          permission.label
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Count */}
      <div className="text-center py-2 px-4 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-sm text-primary font-medium">
          {permissions.length}{" "}
          {t("staff.permissions.permissionsSelected", "permissions selected")}
        </span>
      </div>
    </div>
  );
}

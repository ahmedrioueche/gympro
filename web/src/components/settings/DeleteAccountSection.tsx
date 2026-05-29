import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../store/modal";

export function DeleteAccountSection() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">
              {t("delete_account.section_title", "Delete Account")}
            </h3>
            <p className="text-red-700 text-sm mb-4">
              {t(
                "delete_account.section_description",
                "Permanently delete your account and all associated data. This action cannot be undone.",
              )}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => openModal("delete_account")}
        className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        {t("delete_account.button", "Delete Account")}
      </button>
    </div>
  );
}

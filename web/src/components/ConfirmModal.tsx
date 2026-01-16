import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../store/modal";
import InputField from "./ui/InputField";

export default function ConfirmModal() {
  const { t } = useTranslation();
  const { currentModal, confirmModalProps, closeModal } = useModalStore();
  const [inputValue, setInputValue] = useState("");

  const title = confirmModalProps?.title || t("confirm.default.title");
  const text = confirmModalProps?.text || t("confirm.default.text");
  const verificationText = confirmModalProps?.verificationText;

  useEffect(() => {
    if (currentModal === "confirm") {
      setInputValue("");
    }
  }, [currentModal]);

  const confirmVariant = confirmModalProps?.confirmVariant || "primary";

  const handleCancel = () => {
    confirmModalProps?.onCancel?.();
    closeModal();
  };

  const handleConfirm = () => {
    confirmModalProps?.onConfirm?.();
    closeModal();
  };

  if (currentModal !== "confirm") {
    return null;
  }

  const confirmText = confirmModalProps?.confirmText || t("common.confirm");

  // Determine header color/icon based on variant
  let HeaderIcon = AlertTriangle;
  let headerGradient = "from-primary/20 to-secondary/20";
  let iconColor = "text-primary";
  let buttonGradient = "from-primary to-secondary";

  if (confirmVariant === "danger") {
    HeaderIcon = AlertTriangle;
    headerGradient = "from-red-500/20 to-orange-500/20";
    iconColor = "text-red-500";
    buttonGradient = "from-red-500 to-orange-600";
  } else if (confirmVariant === "success") {
    HeaderIcon = CheckCircle;
    headerGradient = "from-green-500/20 to-emerald-500/20";
    iconColor = "text-green-500";
    buttonGradient = "from-green-500 to-emerald-600";
  } else if (confirmVariant === "primary") {
    HeaderIcon = Info;
    headerGradient = "from-primary/20 to-secondary/20";
    iconColor = "text-primary";
    buttonGradient = "from-primary to-secondary";
  }

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full border-2 border-border/50 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b border-border bg-gradient-to-r ${headerGradient}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border border-white/10 shadow-sm ${iconColor}`}
            >
              <HeaderIcon size={24} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-black/10 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-secondary text-base leading-relaxed bg-surface-secondary/50 p-4 rounded-xl border border-border">
            {text}
          </p>
          {verificationText && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-text-secondary select-none">
                {t("confirm.typeToConfirm", {
                  text: verificationText,
                  defaultValue: `Type "${verificationText}" to confirm`,
                })}
              </p>
              <InputField
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder={verificationText}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-2">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-xl font-medium text-text-secondary bg-surface hover:bg-surface-secondary border hover:border-border transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              verificationText ? inputValue !== verificationText : false
            }
            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.02] transition-all bg-gradient-to-r ${buttonGradient} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

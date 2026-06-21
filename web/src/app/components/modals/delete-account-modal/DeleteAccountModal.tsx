import { AlertTriangle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import BaseModal from "../../../../components/ui/BaseModal";
import InputField from "../../../../components/ui/InputField";
import { useDeleteAccount } from "../../../../hooks/useDeleteAccount";

export function DeleteAccountModal() {
  const { t } = useTranslation();
  const {
    
    isOpen,
    state,
    user,
    closeModal,
    setConfirmationText,
    setOtpCode,
    handleConfirmationSubmit,
    primaryButtonLabel,
    handlePrimaryClick,
  
    zIndex,
  } = useDeleteAccount();

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={t("delete_account.title", "Delete Account")}
      icon={AlertTriangle}
      maxWidth="max-w-2xl"
      showSecondaryButton
      primaryButton={{
        label: primaryButtonLabel,
        onClick: handlePrimaryClick,
        loading: state.isLoading,
        variant: "danger",
      }}
    >
      <div className="space-y-6">
        {/* Warning banner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                {t("delete_account.warning_title", "Permanent Action")}
              </h3>
              <p className="text-red-800 text-sm">
                {t(
                  "delete_account.warning_message",
                  "Deleting your account is permanent and cannot be undone. All your data, memberships, and progress will be deleted.",
                )}
              </p>
            </div>
          </div>
        </div>

        {state.step === "confirmation" && (
          <div className="space-y-4">
            <InputField
              label={t("delete_account.confirmation_label", "Confirm Deletion")}
              placeholder="Type 'DELETE MY ACCOUNT'"
              value={state.confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              error={state.error || undefined}
              onPaste={(e) => e.preventDefault()}
            />
          </div>
        )}

        {state.step === "otp" && (
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-text-primary font-medium">
                  {t("delete_account.otp_sent_to", "Verification code sent")}
                </p>
                <p className="text-text-secondary text-sm">
                  {t(
                    "delete_account.otp_message",
                    "We've sent a verification code to {{email}}",
                    { email: user?.profile?.email || "your email" },
                  )}
                </p>
              </div>
            </div>

            <InputField
              label={t("delete_account.otp_label", "Verification Code")}
              placeholder={t(
                "delete_account.otp_placeholder",
                "Enter 6-digit code",
              )}
              value={state.otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              error={state.error || undefined}
              maxLength={6}
            />

            <button
              type="button"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              onClick={handleConfirmationSubmit}
              disabled={state.isLoading}
            >
              {t("delete_account.resend_code", "Resend verification code")}
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

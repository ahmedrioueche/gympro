import { useTranslation } from "react-i18next";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  contactMethod: "email" | "phone";
  subscriptionTypeId: string;
  sendWelcomeMessage: boolean;
  notes: string;
  isContactless: boolean;
}

interface StepContactPreferencesProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string | boolean) => void;
  subscriptionOptions: { value: string; label: string }[];
}

function StepContactPreferences({
  formData,
  handleInputChange,
  subscriptionOptions,
}: StepContactPreferencesProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          {t("createMember.steps.contact.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("createMember.steps.contact.description")}
        </p>
      </div>

      {/* Send Welcome Message Toggle */}
      {!formData.isContactless && (
        <div className="bg-surface/50 border border-border rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">
                {t("createMember.form.welcomeMessage.label")}
              </h3>
              <p className="text-sm text-text-secondary">
                {t("createMember.form.welcomeMessage.description")}
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.sendWelcomeMessage}
              onChange={(e) =>
                handleInputChange("sendWelcomeMessage", e.target.checked)
              }
              className="w-5 h-5 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
            />
          </label>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {t("createMember.form.notes.label")}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder={t("createMember.form.notes.placeholder")}
          rows={4}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Review Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span>📋</span>
          {t("createMember.review.title")}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t("createMember.review.name")}:
            </span>
            <span className="text-text-primary font-semibold">
              {formData.fullName || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Type:</span>
            <span className="text-text-primary font-semibold">
              {formData.isContactless
                ? "Contactless (No Login)"
                : "Standard Member"}
            </span>
          </div>
          {!formData.isContactless && (
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {t("createMember.review.contact")}:
              </span>
              <span className="text-text-primary font-semibold">
                {formData.contactMethod === "email"
                  ? formData.email
                  : formData.phoneNumber || "-"}
              </span>
            </div>
          )}
          {formData.subscriptionTypeId && (
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {t("createMember.review.subscription")}:
              </span>
              <span className="text-text-primary font-semibold">
                {subscriptionOptions.find(
                  (s) => s.value === formData.subscriptionTypeId
                )?.label || "-"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StepContactPreferences;

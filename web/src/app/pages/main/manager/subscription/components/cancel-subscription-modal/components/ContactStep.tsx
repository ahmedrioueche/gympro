import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleContactSupport } from "../../../../../../../../utils/contact";

interface ContactStepProps {
  onContinue: () => void;
}

export function ContactStep({ onContinue }: ContactStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
        <p className="text-text-primary mb-4">
          {t("subscription.cancel_contact_message")}
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
          <li>{t("subscription.cancel_reason_billing")}</li>
          <li>{t("subscription.cancel_reason_features")}</li>
          <li>{t("subscription.cancel_reason_support")}</li>
          <li>{t("subscription.cancel_reason_other")}</li>
        </ul>
      </div>

      <p className="text-text-secondary text-sm">
        {t("subscription.cancel_contact_encourage")}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() =>
            handleContactSupport(
              t,
              t("subscription.cancel_support_subject"),
              t("subscription.cancel_support_body")
            )
          }
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium"
        >
          <Mail className="w-4 h-4" />
          {t("subscription.contact_support")}
        </button>
        <button
          onClick={onContinue}
          className="flex-1 px-4 py-3 bg-surface hover:bg-surface-hover text-text-primary border border-border rounded-xl transition-all font-medium"
        >
          {t("subscription.continue_cancellation")}
        </button>
      </div>
    </div>
  );
}

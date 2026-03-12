import { useTranslation } from "react-i18next";

export function ContactStep() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-2">
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
    </div>
  );
}

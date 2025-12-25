import { useTranslation } from "react-i18next";
import { handleContactSupport } from "../../../../../../utils/contact";

function SubscriptionFooter() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-center items-center gap-1 text-center p-8">
      <p className="text-text-secondary text-sm">
        {t("subscriptions.footer_info").split("\n")[0]}
      </p>
      <button
        onClick={() => handleContactSupport(t)}
        className="text-text-secondary text-sm underline hover:text-text-primary transition-colors"
      >
        {t("subscriptions.footer_info").split("\n")[1]}
      </button>
    </div>
  );
}

export default SubscriptionFooter;

import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import {
  useApplyPaddleUpgrade,
  usePreviewPaddleUpgrade,
} from "../../../../../../hooks/queries/usePaddleCheckout";

function ProcessingOverlay() {
  const { t } = useTranslation();
  const applyPaddleUpgradeMutation = useApplyPaddleUpgrade();
  const previewPaddleUpgradeMutation = usePreviewPaddleUpgrade();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-surface rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Loading />
        <p className="text-text-primary font-medium">
          {applyPaddleUpgradeMutation.isPending
            ? t("subscriptions.processing_upgrade", "Processing upgrade...")
            : previewPaddleUpgradeMutation.isPending
            ? t("subscriptions.loading_preview", "Loading preview...")
            : t("checkout.redirecting")}
        </p>
      </div>
    </div>
  );
}

export default ProcessingOverlay;

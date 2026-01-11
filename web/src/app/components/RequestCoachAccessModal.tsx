import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import { useRequestCoachAccess } from "../../hooks/queries/useDashboard";

interface RequestCoachAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestCoachAccessModal({
  isOpen,
  onClose,
}: RequestCoachAccessModalProps) {
  const { t } = useTranslation();
  const [certificationDetails, setCertificationDetails] = useState("");
  const [isCertified, setIsCertified] = useState(false);

  const { mutate: requestAccess, isPending } = useRequestCoachAccess();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!isCertified || !certificationDetails.trim()) return;

    requestAccess(
      { certificationDetails },
      {
        onSuccess: () => {
          onClose();
          setCertificationDetails("");
          setIsCertified(false);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            {t("dashboard.requestCoachAccess", "Request Coach Access")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-text-secondary">
            {t(
              "dashboard.coachAccessDescription",
              "To access the coach dashboard, please confirm that you are a certified fitness coach and provide some details about your certification."
            )}
          </p>

          {/* Certification checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isCertified}
              onChange={(e) => setIsCertified(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">
              {t(
                "dashboard.certifiedCoachConfirmation",
                "I confirm that I am a certified fitness coach"
              )}
            </span>
          </label>

          {/* Certification details */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("dashboard.certificationDetails", "Certification Details")}
            </label>
            <textarea
              value={certificationDetails}
              onChange={(e) => setCertificationDetails(e.target.value)}
              placeholder={t(
                "dashboard.certificationPlaceholder",
                "e.g., ACE Certified Personal Trainer, NASM-CPT, etc."
              )}
              className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            color="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isPending}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            variant="filled"
            color="primary"
            onClick={handleSubmit}
            disabled={!isCertified || !certificationDetails.trim() || isPending}
            className="flex-1"
          >
            {isPending
              ? t("common.submitting", "Submitting...")
              : t("common.submit", "Submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}

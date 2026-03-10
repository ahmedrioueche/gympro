import { useTranslation } from "react-i18next";
import { useWelcomeTour } from "../../../../hooks/useWelcomeTour";
import { useModalStore } from "../../../../store/modal";
import WelcomeTourModal from "./WelcomeTourModal";
import { getTourSteps } from "./tourData";

export default function WelcomeTourModalWrapper() {
  const { currentModal, welcomeTourProps, closeModal } = useModalStore();
  const { t } = useTranslation();
  const { isSubmitting, handleComplete } = useWelcomeTour();

  const isOpen = currentModal === "welcome_tour";

  if (!isOpen) return null;

  const role = welcomeTourProps?.role || "member";

  // Shared completion handler that calls API and closes the modal store
  const onFinish = () => {
    handleComplete();
    closeModal();
  };

  const onSkip = () => {
    handleComplete();
    closeModal();
  };

  const steps = getTourSteps(t, role);

  return (
    <WelcomeTourModal
      isOpen={isOpen}
      onClose={onSkip}
      onComplete={onFinish}
      steps={steps}
      isSubmitting={isSubmitting}
    />
  );
}

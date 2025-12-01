import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface NavButtonsProps {
  step: number;
  steps: any[];
  isSubmitting: boolean;
  formData: { fullName: string };
  handleNext: () => void;
  handleBack: () => void;
}

function NavButtons({
  step,
  steps,
  isSubmitting,
  formData,
  handleNext,
  handleBack,
}: NavButtonsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-700/50">
      <button
        type="button"
        onClick={() =>
          step === 1
            ? navigate({ to: APP_PAGES.gym.members.link })
            : handleBack()
        }
        className="px-4 py-2 rounded-lg text-text-secondary hover:bg-gray-800/50 transition-all font-medium text-sm"
      >
        ←{" "}
        {step === 1
          ? t("createMember.actions.cancel")
          : t("createMember.actions.back")}
      </button>

      <div className="flex gap-2">
        {step < steps.length ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            disabled={step === 1 && !formData.fullName}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {t("createMember.actions.next")} →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !formData.fullName}
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                {t("createMember.actions.submitting")}
              </>
            ) : (
              <>
                <span>✨</span>
                {t("createMember.actions.submit")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default NavButtons;

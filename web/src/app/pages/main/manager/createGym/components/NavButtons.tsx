import { useTranslation } from "react-i18next";

function NavButtons({
  step,
  setStep,
  navigate,
  formData,
  isPending,
  duplicateGymName,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-700/50">
      <button
        type="button"
        onClick={() =>
          step === 1 ? navigate({ to: "/manager/gyms" }) : setStep(step - 1)
        }
        className="px-4 py-2 rounded-lg text-text-secondary hover:bg-gray-800/50 transition-all font-medium text-sm"
      >
        ← {step === 1 ? t("actions.cancel") : t("actions.back")}
      </button>

      <div className="flex gap-2">
        {step < 3 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setStep(step + 1);
            }}
            disabled={(step === 1 && !formData.name) || duplicateGymName}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
          >
            {t("actions.next")} →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending || !formData.name || duplicateGymName}
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-sm"
          >
            {isPending ? (
              <>
                <span className="animate-spin">⏳</span>
                {t("create_gym.form.creating")}
              </>
            ) : (
              <>
                <span>✨</span>
                {t("create_gym.form.submit")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
export default NavButtons;

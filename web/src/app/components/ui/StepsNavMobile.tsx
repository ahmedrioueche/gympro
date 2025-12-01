import { useTranslation } from "react-i18next";

function StepsNavMobile({ steps, step }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center gap-2 md:gap-3 mb-6">
      {steps.map((s, idx) => (
        <div key={s.number} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              step === s.number
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                : step > s.number
                ? "bg-success/20 text-success"
                : "bg-gray-800/50 border border-gray-700/50 text-text-secondary"
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <div className="hidden sm:block">
              <div className="text-[10px] font-semibold opacity-75">
                {t("create_gym.steps.step")} {s.number}
              </div>
              <div className="text-xs font-bold">{s.title}</div>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                step > s.number ? "bg-success" : "bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default StepsNavMobile;

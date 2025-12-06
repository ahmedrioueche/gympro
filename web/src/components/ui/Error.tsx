import { useTranslation } from "react-i18next";

function ErrorComponent({ error }: { error?: string }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface border border-danger/20 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {error || t("common.error")}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ErrorComponent;

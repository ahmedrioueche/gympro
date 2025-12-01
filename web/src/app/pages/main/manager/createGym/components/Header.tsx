import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-lg shadow-purple-500/20">
        <span className="text-2xl">🏋️</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        {t("create_gym.title")}
      </h1>
      <p className="text-sm text-text-secondary">{t("create_gym.subtitle")}</p>
    </div>
  );
}

export default Header;

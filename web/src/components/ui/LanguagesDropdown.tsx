import { LANGUAGES, type AppLanguage } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

export default function LanguagesDropdown() {
  const { i18n } = useTranslation();

  const handleChange = (lang: AppLanguage) => {
    // Change language in i18n
    i18n.changeLanguage(lang);

    // Set text direction based on language
    document.documentElement.dir = LANGUAGES[lang].dir;
  };

  return (
    <select
      value={i18n.language as AppLanguage}
      onChange={(e) => handleChange(e.target.value as AppLanguage)}
      className="border rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
    >
      {Object.entries(LANGUAGES).map(([code, { label }]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

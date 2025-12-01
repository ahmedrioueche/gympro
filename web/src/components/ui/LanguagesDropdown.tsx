import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constants/common";
import type { AvailableLanguages } from "../../types/lang";

export default function LanguagesDropdown() {
  const { i18n } = useTranslation();

  const handleChange = (lang: AvailableLanguages) => {
    // Change language in i18n
    i18n.changeLanguage(lang);

    // Set text direction based on language
    document.documentElement.dir = LANGUAGES[lang].rtl ? "rtl" : "ltr";
  };

  return (
    <select
      value={i18n.language as AvailableLanguages}
      onChange={(e) => handleChange(e.target.value as AvailableLanguages)}
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

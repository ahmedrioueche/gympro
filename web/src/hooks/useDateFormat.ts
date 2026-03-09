import { format as dateFnsFormat } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";
import { useLanguageStore } from "../store/language";

export const useDateFormat = () => {
  const { language } = useLanguageStore();

  const getLocale = () => {
    switch (language) {
      case "ar":
        return ar;
      case "fr":
        return fr;
      case "en":
      default:
        return enUS;
    }
  };

  const format = (date: Date | number, formatStr: string) => {
    return dateFnsFormat(date, formatStr, { locale: getLocale() });
  };

  return { format, locale: getLocale() };
};

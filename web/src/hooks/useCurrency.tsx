import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES, type SupportedCurrency } from "@ahmedrioueche/gympro-client";
import { useUserStore } from "../store/user";

const getCurrency = (currency?: string) => {
    if (currency && SUPPORTED_CURRENCIES.includes(currency as any)) {
        return currency;
    }
    return DEFAULT_CURRENCY;
}


const useCurrency = () => {
    const { user } = useUserStore();

    const currency = getCurrency(user?.appSettings?.locale?.currency);

    return currency as SupportedCurrency;
}

export default useCurrency;
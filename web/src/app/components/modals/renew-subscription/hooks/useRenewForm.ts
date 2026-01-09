import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { DURATION_OPTIONS } from "../../../../../hooks/useSubscriptionOptions";
import { useModalStore } from "../../../../../store/modal";

export interface FormData {
  subscriptionTypeId: string;
  startDate: string;
  duration: string;
  paymentMethod: string;
}

export function calculateEndDate(startDate: string, duration: string): string {
  const start = new Date(startDate);
  const option = DURATION_OPTIONS.find((d) => d.value === duration);

  if (!option) return startDate;

  let endDate = start;
  if ("days" in option && option.days) {
    endDate = addDays(start, option.days);
  } else if ("weeks" in option && option.weeks) {
    endDate = addWeeks(start, option.weeks);
  } else if ("months" in option && option.months) {
    endDate = addMonths(start, option.months);
  } else if ("years" in option && option.years) {
    endDate = addYears(start, option.years);
  }

  return format(endDate, "yyyy-MM-dd");
}

export function useRenewForm() {
  const { renewSubscriptionProps } = useModalStore();

  const getDefaultStartDate = useCallback(() => {
    if (!renewSubscriptionProps?.currentSubscription?.endDate) {
      return format(new Date(), "yyyy-MM-dd");
    }
    const currentEndDate = new Date(
      renewSubscriptionProps.currentSubscription.endDate
    );
    const today = new Date();
    // If subscription hasn't expired yet, extend from current end date
    if (currentEndDate > today) {
      return format(currentEndDate, "yyyy-MM-dd");
    }
    // If expired, start from today
    return format(today, "yyyy-MM-dd");
  }, [renewSubscriptionProps?.currentSubscription?.endDate]);

  const [formData, setFormData] = useState<FormData>({
    subscriptionTypeId: "regular",
    startDate: format(new Date(), "yyyy-MM-dd"),
    duration: "1_month",
    paymentMethod: "cash",
  });

  // Update form data when modal props change
  useEffect(() => {
    if (renewSubscriptionProps) {
      setFormData({
        subscriptionTypeId:
          renewSubscriptionProps.currentSubscription?.typeId || "regular",
        startDate: getDefaultStartDate(),
        duration: "1_month",
        paymentMethod: "cash",
      });
    }
  }, [renewSubscriptionProps, getDefaultStartDate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isExtending =
    renewSubscriptionProps?.currentSubscription?.endDate &&
    new Date(renewSubscriptionProps.currentSubscription.endDate) > new Date();

  const calculatedEndDate = calculateEndDate(
    formData.startDate,
    formData.duration
  );

  return {
    formData,
    handleChange,
    isExtending,
    calculatedEndDate,
  };
}

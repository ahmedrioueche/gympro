import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useModalStore } from "../../../../store/modal";
export interface FormData {
  subscriptionTypeId: string;
  startDate: string;
  duration: string;
  paymentMethod: string;
}

export function calculateEndDate(startDate: string, duration: string): string {
  const start = new Date(startDate);
  const parts = duration.split(" ");
  if (parts.length !== 2) return startDate;

  const count = parseInt(parts[0]) || 1;
  const unit = parts[1].toLowerCase();

  let endDate = start;
  if (unit.includes("session") || unit.includes("day")) {
    endDate = addDays(start, count);
  } else if (unit.includes("week")) {
    endDate = addWeeks(start, count);
  } else if (unit.includes("month")) {
    endDate = addMonths(start, count);
  } else if (unit.includes("year")) {
    endDate = addYears(start, count);
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
      renewSubscriptionProps.currentSubscription.endDate,
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
    duration: "1 month",
    paymentMethod: "cash",
  });

  // Update form data when modal props change
  useEffect(() => {
    if (renewSubscriptionProps) {
      setFormData({
        subscriptionTypeId:
          renewSubscriptionProps.currentSubscription?.typeId || "regular",
        startDate: getDefaultStartDate(),
        duration: "1 month",
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
    formData.duration,
  );

  return {
    formData,
    handleChange,
    isExtending,
    calculatedEndDate,
  };
}

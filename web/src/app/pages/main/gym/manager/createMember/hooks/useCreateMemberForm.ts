import {
  BASE_SUBSCRIPTION_TYPES,
  membersApi,
  PAYMENT_METHODS,
  type CreateMemberDto,
  type PaymentMethod,
} from "@ahmedrioueche/gympro-client";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DURATION_OPTIONS } from "../../../../../../../hooks/useSubscriptionOptions";

type ContactMethod = "email" | "phone";

export interface FormData {
  // Step 1: General Info
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: string;
  age: string;
  isContactless: boolean;

  // Step 2: Subscription Info
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  subscriptionDuration: string;
  paymentMethod: PaymentMethod | "";

  // Step 3: Contact Preferences
  contactMethod: ContactMethod;
  sendWelcomeMessage: boolean;
  notes: string;
}

export interface FormErrors {
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  gender?: string;
  age?: string;
  contact?: string;
  subscriptionTypeId?: string;
  paymentMethod?: string;
  subscriptionStartDate?: string;
}

const initialFormData: FormData = {
  email: "",
  phoneNumber: "",
  fullName: "",
  gender: "",
  age: "",
  isContactless: false,
  subscriptionTypeId: BASE_SUBSCRIPTION_TYPES[0] || "",
  subscriptionStartDate: new Date().toISOString().split("T")[0],
  subscriptionDuration: "1_month",
  paymentMethod: PAYMENT_METHODS[0] || "",
  contactMethod: "email",
  sendWelcomeMessage: true,
  notes: "",
};

function calculateEndDate(startDate: string, duration: string): string {
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

export function useCreateMemberForm(
  gymId?: string,
  currentUserEmail?: string,
  currentUserPhone?: string
) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 8 && phoneRegex.test(phone);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      // Validate Name
      if (!formData.fullName.trim()) {
        newErrors.fullName = t("createMember.validation.nameRequired");
        isValid = false;
      }

      // Validate Age
      if (
        !formData.age ||
        isNaN(Number(formData.age)) ||
        Number(formData.age) < 1
      ) {
        newErrors.age = t("createMember.validation.ageInvalid");
        isValid = false;
      }

      // Validate Gender
      if (!formData.gender) {
        newErrors.gender = t("createMember.validation.genderRequired");
        isValid = false;
      }

      // Validate Contact Info ONLY if NOT contactless
      if (!formData.isContactless) {
        if (!formData.email && !formData.phoneNumber) {
          newErrors.contact = t("createMember.validation.contactRequired");
          isValid = false;
        }

        if (formData.email && !validateEmail(formData.email)) {
          newErrors.email = t("createMember.validation.emailInvalid");
          isValid = false;
        }

        if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
          newErrors.phoneNumber = t("createMember.validation.phoneInvalid");
          isValid = false;
        }

        if (formData.phoneNumber && !formData.phoneNumber.startsWith("+")) {
          newErrors.phoneNumber = t("createMember.validation.phoneInvalid");
          isValid = false;
        }
      }
    }

    if (currentStep === 2) {
      if (!formData.subscriptionTypeId) {
        newErrors.subscriptionTypeId = t(
          "createMember.validation.subscriptionRequired"
        );
        isValid = false;
      }

      if (!formData.paymentMethod) {
        newErrors.paymentMethod = t("createMember.validation.paymentRequired");
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      toast.error(
        t(
          "createMember.validation.checkForm",
          "Please check the form for errors"
        )
      );
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      if (field === "isContactless" && value === true) {
        return {
          ...prev,
          [field]: value,
          email: "",
          phoneNumber: "",
          contactMethod: "email",
        };
      }
      return { ...prev, [field]: value };
    });

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (
      (field === "email" ||
        field === "phoneNumber" ||
        field === "isContactless") &&
      errors.contact
    ) {
      setErrors((prev) => ({ ...prev, contact: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== 3 || !validateStep(step)) {
      return;
    }

    // Prevent creating member with same contact as current user
    const accountEmail = currentUserEmail?.trim().toLowerCase();
    const accountPhone = currentUserPhone?.replace(/\D/g, "");
    const inputEmail = formData.email?.trim().toLowerCase();
    const inputPhone = formData.phoneNumber?.replace(/\D/g, "");

    if (inputEmail && accountEmail && inputEmail === accountEmail) {
      const msg = t(
        "createMember.validation.sameEmail",
        "You cannot create a member with the same email as your account"
      );
      setErrors({ contact: msg });
      toast.error(msg);
      return;
    }

    if (inputPhone && accountPhone && inputPhone === accountPhone) {
      const msg = t(
        "createMember.validation.samePhone",
        "You cannot create a member with the same phone number as your account"
      );
      setErrors({ contact: msg });
      toast.error(msg);
      return;
    }

    if (!gymId) {
      toast.error(t("gym.no_gym_selected"));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const memberData: CreateMemberDto = {
        gymId,
        ...(formData.email ? { email: formData.email } : {}),
        ...(formData.phoneNumber ? { phoneNumber: formData.phoneNumber } : {}),
        fullName: formData.fullName,
        gender: formData.gender,
        age: formData.age,
        subscriptionTypeId: formData.subscriptionTypeId,
        subscriptionStartDate: formData.subscriptionStartDate,
        subscriptionEndDate: calculateEndDate(
          formData.subscriptionStartDate,
          formData.subscriptionDuration
        ),
        paymentMethod: formData.paymentMethod as PaymentMethod,
      };

      await membersApi.createMember(memberData);
      setShowSuccess(true);
      toast.success(t("createMember.success.title"));
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("createMember.error.message");
      setErrors({ contact: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setStep(1);
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    step,
    formData,
    errors,
    isSubmitting,
    showSuccess,
    handleNext,
    handleBack,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateEmail,
    validatePhone,
  };
}

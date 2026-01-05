import {
  apiClient,
  BASE_SUBSCRIPTION_TYPES,
  membersApi,
  PAYMENT_METHODS,
  type CreateMemberDto,
  type PaymentMethod,
} from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useGymStore } from "../../../../../../store/gym";
import { useUserStore } from "../../../../../../store/user";
import StepsNav from "../../../../../components/ui/StepsNav";
import StepsNavMobile from "../../../../../components/ui/StepsNavMobile";
import Tip from "../../../../../components/ui/Tip";
import Header from "./components/Header";
import NavButtons from "./components/NavButtons";
import StepContactPreferences from "./components/StepContactPreferences";
import StepGeneralInfo from "./components/StepGeneralInfo";
import StepSubscriptionInfo from "./components/StepSubscriptionInfo";

type ContactMethod = "email" | "phone";

interface FormData {
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
  paymentMethod: PaymentMethod | "";

  // Step 3: Contact Preferences
  contactMethod: ContactMethod;
  sendWelcomeMessage: boolean;
  notes: string;
}

interface FormErrors {
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

function CreateMemberPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phoneNumber: "",
    fullName: "",
    gender: "",
    age: "",
    isContactless: false,
    subscriptionTypeId: BASE_SUBSCRIPTION_TYPES[0] || "",
    subscriptionStartDate: new Date().toISOString().split("T")[0],
    paymentMethod: PAYMENT_METHODS[0] || "",
    contactMethod: "email",
    sendWelcomeMessage: true,
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [validatingPhone, setValidatingPhone] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
  const [phoneValid, setPhoneValid] = useState<boolean | undefined>(undefined);

  const steps = [
    {
      number: 1,
      title: t("createMember.steps.general.title"),
      description: t("createMember.steps.general.description"),
      icon: "👤",
    },
    {
      number: 2,
      title: t("createMember.steps.subscription.title"),
      description: t("createMember.steps.subscription.description"),
      icon: "💳",
    },
    {
      number: 3,
      title: t("createMember.steps.contact.title"),
      description: t("createMember.steps.contact.description"),
      icon: "📱",
    },
  ];

  // Map backend types to options
  const subscriptionOptions = BASE_SUBSCRIPTION_TYPES.map((type) => ({
    value: type,
    label: t(
      `createMember.form.subscription.${type}`,
      type.charAt(0).toUpperCase() + type.slice(1)
    ), // Fallback to capitalized
  }));

  // Map backend payment methods to options
  const paymentMethodOptions = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(
      `createMember.form.payment.${method}`,
      method.charAt(0).toUpperCase() + method.slice(1)
    ),
  }));

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation: allows +, -, space, brackets, and digits, min 8 chars
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 8 && phoneRegex.test(phone);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      // Validate Name (Strict)
      if (!formData.fullName.trim()) {
        newErrors.fullName = t("createMember.validation.nameRequired");
        isValid = false;
      }

      // Validate Age (Strict)
      if (
        !formData.age ||
        isNaN(Number(formData.age)) ||
        Number(formData.age) < 1
      ) {
        newErrors.age = t("createMember.validation.ageInvalid");
        isValid = false;
      }

      // Validate Gender (Strict)
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

        // If email provided, ensure async validation passed (or not in progress)
        if (formData.email) {
          if (validatingEmail) {
            newErrors.email = t(
              "createMember.validation.emailValidating",
              "Validating email..."
            );
            isValid = false;
          } else if (emailValid === false) {
            newErrors.email = t(
              "createMember.validation.emailInUse",
              "This email cannot be used to create a member"
            );
            isValid = false;
          }
        }

        if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
          newErrors.phoneNumber = t("createMember.validation.phoneInvalid");
          isValid = false;
        }

        // If phone provided, ensure it's in E.164 format (with country code +prefix)
        if (formData.phoneNumber && !formData.phoneNumber.startsWith("+")) {
          newErrors.phoneNumber = t(
            "createMember.validation.phoneInvalid",
            "Please enter a valid phone number"
          );
          isValid = false;
        }

        // If phone provided, ensure async validation passed (or not in progress)
        if (formData.phoneNumber) {
          if (validatingPhone) {
            newErrors.phoneNumber = t(
              "createMember.validation.phoneValidating",
              "Validating phone..."
            );
            isValid = false;
          } else if (phoneValid === false) {
            newErrors.phoneNumber = t(
              "createMember.validation.phoneInUse",
              "This phone number cannot be used to create a member"
            );
            isValid = false;
          }
        }
      }
    }

    if (currentStep === 2) {
      // Validate Subscription Info (Strict)
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
      setStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      // Show a toast if validation fails to make it obvious
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== steps.length || !validateStep(step)) {
      return;
    }

    // Prevent creating a member with same email or phone as the current account
    const accountEmail = user?.profile?.email?.trim().toLowerCase();
    const accountPhone = user?.profile?.phoneNumber?.replace(/\D/g, "");
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

    if (!currentGym) {
      toast.error(t("gym.no_gym_selected"));
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const memberData: CreateMemberDto = {
        gymId: currentGym._id,
        // Only include email/phone if provided
        ...(formData.email ? { email: formData.email } : {}),
        ...(formData.phoneNumber ? { phoneNumber: formData.phoneNumber } : {}),

        // Strict fields
        fullName: formData.fullName,
        gender: formData.gender,
        age: formData.age,

        // Subscription
        subscriptionTypeId: formData.subscriptionTypeId,
        subscriptionStartDate: formData.subscriptionStartDate,
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

      setErrors({
        contact: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic change handler
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      // Clear dependent fields if switching to contactless
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

    // Clear error for field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Also clear general "contact" error if editing contact fields
    if (
      (field === "email" ||
        field === "phoneNumber" ||
        field === "isContactless") &&
      errors.contact
    ) {
      setErrors((prev) => ({ ...prev, contact: undefined }));
    }
  };

  // Debounced async validation for email
  useEffect(() => {
    let timer: any = undefined;
    const email = formData.email?.trim();

    // Reset when empty
    if (!email) {
      setEmailValid(undefined);
      setValidatingEmail(false);
      setErrors((prev) => ({ ...prev, email: undefined }));
      return;
    }

    setValidatingEmail(true);
    setEmailValid(undefined);

    timer = setTimeout(() => {
      (async () => {
        // After debounce: first check format, then server lookup
        if (!validateEmail(email)) {
          setEmailValid(false);
          setErrors((prev) => ({
            ...prev,
            email: t("createMember.validation.emailInvalid"),
          }));
          setValidatingEmail(false);
          return;
        }

        try {
          const res = await apiClient.get(
            `/users/email/${encodeURIComponent(email)}`
          );
          // Found -> invalid
          setEmailValid(false);
          setErrors((prev) => ({
            ...prev,
            email: t(
              "createMember.validation.emailInUse",
              "This email cannot be used to create a member"
            ),
          }));
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 404) {
            setEmailValid(true);
            setErrors((prev) => ({ ...prev, email: undefined }));
          } else {
            // Other errors: log and treat as valid to avoid blocking unnecessarily
            console.warn("Email validation request failed", err);
            setEmailValid(true);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }
        } finally {
          setValidatingEmail(false);
        }
      })();
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.email, t]);

  // Debounced async validation for phone
  useEffect(() => {
    let timer: any = undefined;
    const phone = formData.phoneNumber?.trim();

    // Reset when empty
    if (!phone) {
      setPhoneValid(undefined);
      setValidatingPhone(false);
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
      return;
    }

    // If format invalid, mark invalid and set error, skip server call
    if (!validatePhone(phone)) {
      setPhoneValid(false);
      setValidatingPhone(false);
      setErrors((prev) => ({
        ...prev,
        phoneNumber: t("createMember.validation.phoneInvalid"),
      }));
      return;
    }

    setValidatingPhone(true);
    setPhoneValid(undefined);

    timer = setTimeout(() => {
      (async () => {
        try {
          const res = await apiClient.get(
            `/users/phone/${encodeURIComponent(phone)}`
          );
          // Found -> invalid
          setPhoneValid(false);
          setErrors((prev) => ({
            ...prev,
            phoneNumber: t(
              "createMember.validation.phoneInUse",
              "This phone number cannot be used to create a member"
            ),
          }));
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 404) {
            setPhoneValid(true);
            setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
          } else {
            console.warn("Phone validation request failed", err);
            setPhoneValid(true);
            setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
          }
        } finally {
          setValidatingPhone(false);
        }
      })();
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.phoneNumber, t]);

  if (showSuccess) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center animate-in fade-in duration-500">
        <div className="max-w-xl w-full">
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-success to-primary"></div>

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-bounce-short">
              <span className="text-5xl">✅</span>
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-4">
              {t("createMember.success.title")}
            </h2>
            <p className="text-text-secondary mb-8">
              {t("createMember.success.message")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setStep(1);
                  setFormData({
                    email: "",
                    phoneNumber: "",
                    fullName: "",
                    gender: "",
                    age: "",
                    isContactless: false,
                    subscriptionTypeId: "",
                    subscriptionStartDate: new Date()
                      .toISOString()
                      .split("T")[0],
                    paymentMethod: "",
                    contactMethod: "email",
                    sendWelcomeMessage: true,
                    notes: "",
                  });
                }}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25"
              >
                {t("createMember.success.addAnother")}
              </button>
              <Link
                to={APP_PAGES.gym.manager.members.link}
                className="px-6 py-3 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-hover hover:border-text-secondary transition-all duration-300"
              >
                {t("createMember.success.viewMembers")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
        {/* Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="sticky top-6">
            <Header />
            <div className="hidden lg:block mt-8">
              <StepsNav steps={steps} step={step} />
            </div>
            <div className="lg:hidden mt-6">
              <StepsNavMobile steps={steps} step={step} />
            </div>

            <div className="mt-8">
              <Tip
                title={t("createMember.tips.title")}
                description={t("createMember.tips.description")}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3">
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border rounded-2xl shadow-sm p-6 md:p-8 min-h-[500px] flex flex-col relative"
          >
            {/* Progress bar for mobile */}
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300 ease-out lg:hidden"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>

            <div className="flex-1">
              {step === 1 && (
                <StepGeneralInfo
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}
              {step === 2 && (
                <StepSubscriptionInfo
                  formData={formData}
                  handleInputChange={handleInputChange}
                  subscriptionOptions={subscriptionOptions}
                  paymentMethodOptions={paymentMethodOptions}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <StepContactPreferences
                  formData={formData}
                  handleInputChange={handleInputChange}
                  subscriptionOptions={subscriptionOptions}
                />
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <NavButtons
                step={step}
                steps={steps}
                isSubmitting={isSubmitting}
                formData={formData}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateMemberPage;
